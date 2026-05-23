/**
 * LemonSqueezy checkout URL builder for SecLab Nigeria CTF
 * Works with static GitHub Pages export — CTF buttons redirect to
 * Lemon Squeezy hosted checkout pages.
 *
 * SETUP:
 * 1. Create a LemonSqueezy store at https://app.lemonsqueezy.com
 * 2. Create products/variants for Pro ($15/mo) and Elite ($40/mo)
 * 3. Set variant IDs in .env.local (see .env.example)
 * 4. Deploy API route to Vercel or Railway (for server-side checkout creation)
 * 5. On GitHub Pages, CTF page buttons open Lemon Squeezy hosted checkout
 */

export const NEXT_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://seclab-nigeria.vercel.app';

// Variant IDs from Lemon Squeezy dashboard
// Find them in: Store → Products → [Product] → Variants
const PRO_VARIANT_ID = process.env.NEXT_PUBLIC_PRO_VARIANT_ID || '';
const ELITE_VARIANT_ID = process.env.NEXT_PUBLIC_ELITE_VARIANT_ID || '';

// Store slug from Lemon Squeezy store URL
const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || 'seclab-nigeria';

/**
 * Tier names matching the CTF page TIERS array
 */
export type TierName = 'Free' | 'Pro' | 'Elite';

/**
 * Build LemonSqueezy hosted checkout URL.
 * Lemon Squeezy hosted checkout handles payment flow entirely on their domain.
 * No webhook or server required — user is redirected to LS after payment.
 */
export function buildCheckoutUrl(tierName: TierName): string {
  const variantId = tierName === 'Pro' ? PRO_VARIANT_ID : ELITE_VARIANT_ID;

  if (!variantId) {
    // Not configured — link to the store page so user can see products
    return `https://seclab-nigeria.lemonsqueezy.com`;
  }

  return `https://seclab-nigeria.lemonsqueezy.com/checkout/buy/${variantId}`;
}

/**
 * Redirect to Lemon Squeezy hosted checkout (same tab).
 * Works on static GitHub Pages — no API call needed.
 */
export function openCheckout(tierName: TierName): void {
  const url = buildCheckoutUrl(tierName);
  window.location.href = url;
}

/**
 * Open checkout in a new tab.
 */
export function openCheckoutNewTab(tierName: TierName): void {
  window.open(buildCheckoutUrl(tierName), '_blank', 'noopener,noreferrer');
}

/**
 * Check if tier has a real variant ID configured (not empty/default).
 */
export function isTierConfigured(tierName: TierName): boolean {
  if (tierName === 'Free') return true;
  const id = tierName === 'Pro' ? PRO_VARIANT_ID : ELITE_VARIANT_ID;
  return !!id && !id.includes('YOUR_');
}

/**
 * Get the configured variant ID for a tier (used by API route).
 */
export function getVariantId(tierName: TierName): string | null {
  if (tierName === 'Free') return null;
  return tierName === 'Pro' ? PRO_VARIANT_ID : ELITE_VARIANT_ID;
}