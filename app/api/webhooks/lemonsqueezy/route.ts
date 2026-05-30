import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

/**
 * LemonSqueezy Webhook Handler
 * Subscribes to: subscription.created, subscription.updated, subscription.cancelled, subscription.expired
 *
 * On subscription creation: grants is_pro = true in the profiles table
 * On cancellation/expiry: removes is_pro access
 *
 * IMPORTANT: Register this as webhook URL in LemonSqueezy dashboard:
 * https://app.lemonsqueezy.com/settings/webhooks
 * Set secret: LEMONSQUEEZY_WEBHOOK_SECRET env var
 *
 * Also add custom_data to your LemonSqueezy product's checkout:
 * custom_data: { user_id: "<userId from localStorage>" }
 */

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-lemonsqueezy-signature') || '';

    // Verify webhook signature (skip in dev if secret not set)
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (secret) {
      const { createHmac, timingSafeEqual } = await import('crypto');
      const hmac = createHmac('sha256', secret);
      hmac.update(rawBody);
      const expectedSig = hmac.digest('hex');
      const sigBuf = Buffer.from(signature, 'hex');
      const expectedBuf = Buffer.from(expectedSig, 'hex');
      if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventName = event?.meta?.event_name;

    console.log(`[LemonSqueezy Webhook] Event: ${eventName}`);

    // Extract user_id from custom_data (passed during checkout creation)
    const userId = event?.meta?.custom_data?.user_id ||
                   event?.meta?.custom_data?.userId;

    if (!userId) {
      console.warn('[Webhook] No user_id in custom_data — skipping');
      return NextResponse.json({ received: true });
    }

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated': {
        const status = event?.data?.attributes?.status;
        if (status === 'active' || status === 'trialing' || status === 'on_trial') {
          const variantId = event?.data?.attributes?.first_order_item?.variant_id || null;
          await (supabase.from('profiles') as any).upsert(
            { id: userId, is_pro: true, pro_variant_id: variantId },
            { onConflict: 'id' }
          );
          console.log(`[Webhook] ✅ Granted pro to user ${userId} (status: ${status})`);
        }
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired':
      case 'subscription_payment_failed': {
        await (supabase.from('profiles') as any).upsert(
          { id: userId, is_pro: false },
          { onConflict: 'id' }
        );
        console.log(`[Webhook] ❌ Revoked pro from user ${userId} (${eventName})`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed';
    console.error('[Webhook] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}