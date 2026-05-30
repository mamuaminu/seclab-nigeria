import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

/**
 * Paystack Webhook Handler
 * Subscribes to: charge.success
 *
 * On successful payment: grants is_pro = true in the profiles table
 * Uses Paystack webhook signature verification (HMAC SHA256)
 *
 * IMPORTANT: Register this as webhook URL in Paystack dashboard:
 * https://dashboard.paystack.co/settings/webhooks
 * Set secret: PAYSTACK_WEBHOOK_SECRET env var
 */

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature') || '';

    // Verify webhook signature
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
    if (secret) {
      const { createHmac, timingSafeEqual } = await import('crypto');
      const hmac = createHmac('sha512', secret);
      hmac.update(rawBody);
      const expectedSig = hmac.digest('hex');
      if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventName = event?.event;

    console.log(`[Paystack Webhook] Event: ${eventName}`);

    // Only handle successful charges
    if (eventName !== 'charge.success') {
      return NextResponse.json({ received: true });
    }

    const data = event?.data;
    if (!data) {
      return NextResponse.json({ received: true });
    }

    // Extract metadata
    const metadata = data?.metadata || {};
    const userId = metadata?.userId || metadata?.user_id;
    const tierName = metadata?.tierName || metadata?.tier_name || 'Pro';

    if (!userId) {
      console.warn('[Webhook] No user_id in metadata — skipping');
      return NextResponse.json({ received: true });
    }

    // Map tier to variant_id for reference
    const variantId = tierName === 'Elite' ? 'elite' : 'pro';

    // Grant pro access
    await (supabase.from('profiles') as any).upsert(
      { id: userId, is_pro: true, pro_variant_id: variantId },
      { onConflict: 'id' }
    );

    console.log(`[Webhook] ✅ Granted ${tierName} pro to user ${userId}`);

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed';
    console.error('[Webhook] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
