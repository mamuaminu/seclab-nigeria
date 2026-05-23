import { NextRequest, NextResponse } from 'next/server';

/**
 * LemonSqueezy Checkout API — creates a hosted checkout URL
 * for SecLab Nigeria CTF tiers (Pro $15/mo, Elite $40/mo)
 *
 * Uses Lemon Squeezy REST API directly via fetch (no SDK needed).
 * Works as a Next.js API route — not compatible with `output: 'export'`.
 * Deploy to Railway or Vercel for server-side rendering.
 */

const LEMONSQUEEZY_API_BASE = 'https://api.lemonsqueezy.com/v1';

async function lsRequest(
  endpoint: string,
  method: string,
  apiKey: string,
  body?: unknown
): Promise<{ statusCode: number; data: unknown; error: unknown }> {
  const url = `${LEMONSQUEEZY_API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    ...(body ? { body: JSON.stringify({ data: body }) } : {}),
  });

  const data = await res.json();
  return { statusCode: res.status, data, error: null };
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'LEMONSQUEEZY_API_KEY is not configured. Add it to Railway/Vercel env vars.' },
        { status: 500 }
      );
    }

    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    if (!storeId) {
      return NextResponse.json(
        { error: 'LEMONSQUEEZY_STORE_ID is not configured.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { variantId, projectName, email, name } = body;

    if (!variantId) {
      return NextResponse.json({ error: 'variantId is required' }, { status: 400 });
    }

    // Create checkout via Lemon Squeezy REST API
    const result = await lsRequest(
      `/checkouts/${storeId}/${variantId}`,
      'POST',
      apiKey,
      {
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: email || undefined,
              name: name || undefined,
            },
            product_options: {
              name: projectName || 'SecLab Nigeria Pro',
              description: 'SecLab Nigeria CTF Pro Access',
            },
            checkout_options: {
              embed: false,
              media: true,
              logo: true,
            },
            expires_at: null,
          },
        },
      }
    );

    if (result.statusCode !== 200 && result.statusCode !== 201) {
      console.error('LemonSqueezy API error:', result);
      return NextResponse.json(
        { error: 'Failed to create checkout session. Please try again.' },
        { status: result.statusCode || 500 }
      );
    }

    const checkoutUrl = (result.data as { data: { attributes: { url: string } } })?.data?.attributes?.url;
    if (!checkoutUrl) {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Checkout route error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}