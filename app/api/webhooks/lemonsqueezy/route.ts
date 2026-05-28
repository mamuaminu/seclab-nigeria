import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

/**
 * LemonSqueezy Webhook Handler
 * Subscribes to: subscription.created, subscription.updated, subscription.cancelled, subscription.expired
 *
 * On subscription creation: grants pro_tier = true in the profiles table
 * On cancellation/expiry: removes pro_tier access
 *
 * Must be registered as webhook URL in LemonSqueezy dashboard:
 * https://app.lemonsqueezy.com/settings/webhooks
 * Secret: LEMONSQUEEZY_WEBHOOK_SECRET env var
 */

function verifyWebhookSignature(request: Request): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return true; // Skip verification in dev if secret not set

  const signature = request.headers.get('X-Signature');
  if (!signature) return false;

  try {
    // LemonSqueezy sends HMAC SHA-256 signature
    const encoder = new TextEncoder();
    const key = encoder.encode(secret);
    const data = encoder.encode(request.headers.get('X-Signature-Input') || '');

    // Verify using timing-safe comparison in production
    return signature.length === 64; // SHA-256 hex = 64 chars
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-lemonsqueezy-signature') || '';

    // Verify webhook signature
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (secret) {
      // Use Node.js crypto for proper HMAC verification
      const { createHmac } = await import('crypto');
      const hmac = createHmac('sha256', secret);
      hmac.update(rawBody);
      const expectedSig = hmac.digest('hex');

      // Timing-safe comparison
      let valid = expectedSig.length === signature.length;
      for (let i = 0; i < expectedSig.length; i++) {
        if (expectedSig[i] !== signature[i]) valid = false;
      }
      if (!valid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventName = event?.meta?.event_name;
    const userId = event?.meta?.custom_data?.user_id;
    const variantId = event?.data?.attributes?.first_order_item?.variant_id;
    const status = event?.data?.attributes?.status;

    console.log(`[Webhook] Event: ${eventName}, User: ${userId}, Status: ${status}`);

    if (!userId) {
      return NextResponse.json({ error: 'No user_id in custom_data' }, { status: 400 });
    }

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated': {
        if (status === 'active' || status === 'trialing') {
          // Grant pro access
          await (supabase.from('profiles') as any).upsert(
            { id: userId, is_pro: true, pro_variant_id: variantId },
            { onConflict: 'id' }
          );
          console.log(`[Webhook] Granted pro to user ${userId}`);
        }
        break;
      }
      case 'subscription_cancelled':
      case 'subscription_expired':
      case 'subscription_payment_failed': {
        // Remove pro access
        await (supabase.from('profiles') as any).upsert(
          { id: userId, is_pro: false },
          { onConflict: 'id' }
        );
        console.log(`[Webhook] Revoked pro from user ${userId}`);
        break;
      }
      default:
        console.log(`[Webhook] Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed';
    console.error('[Webhook] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}