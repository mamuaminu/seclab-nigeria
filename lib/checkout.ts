/**
 * Paystack checkout for SecLab Nigeria CTF tiers
 * Pro: ₦10,000/mo | Elite: ₦25,000/mo
 *
 * SETUP:
 * 1. Create Paystack account at https://paystack.com
 * 2. Create products for Pro and Elite in dashboard
 * 3. Set PAYSTACK_SECRET_KEY in .env.local
 * 4. Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY for frontend
 * 5. Register webhook: https://seclab-nigeria.vercel.app/api/webhooks/paystack
 */

export const NEXT_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://seclab-nigeria.vercel.app';

// Paystack public key (safe to expose)
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

/**
 * Tier names matching the CTF page TIERS array
 */
export type TierName = 'Free' | 'Pro' | 'Elite';

/**
 * Open Paystack checkout via API call.
 * Calls /api/checkout which creates a Paystack transaction and returns authorization_url.
 */
export async function openCheckout(tierName: TierName, email: string, userId: string, name?: string): Promise<void> {
  if (tierName === 'Free') return;

  const baseUrl = NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tierName, email, name, userId }),
  });

  const data = await res.json();

  if (!res.ok || !data.checkoutUrl) {
    throw new Error(data.error || 'Failed to create checkout');
  }

  // Redirect to Paystack hosted checkout
  window.location.href = data.checkoutUrl;
}

/**
 * Check if Paystack is configured.
 */
export function isPaystackConfigured(): boolean {
  return !!PAYSTACK_PUBLIC_KEY && !PAYSTACK_PUBLIC_KEY.includes('YOUR_');
}
