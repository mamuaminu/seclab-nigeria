import { NextRequest, NextResponse } from 'next/server';

/**
 * Paystack Checkout API — creates a Paystack transaction for SecLab Nigeria CTF tiers
 * Pro: ₦10,000/mo | Elite: ₦25,000/mo
 *
 * Uses Paystack REST API directly via fetch.
 */

const PAYSTACK_API_BASE = 'https://api.paystack.co';

async function paystackRequest(
  endpoint: string,
  method: string,
  apiKey: string,
  body?: unknown
): Promise<{ statusCode: number; data: unknown; error: unknown }> {
  const url = `${PAYSTACK_API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json();
  return { statusCode: res.status, data, error: null };
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.PAYSTACK_SECRET_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'PAYSTACK_SECRET_KEY is not configured.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { tierName, email, name, userId } = body;

    if (!tierName || !email) {
      return NextResponse.json({ error: 'tierName and email are required' }, { status: 400 });
    }

    // Amounts in kobo (₦)
    const tierAmounts: Record<string, number> = {
      Pro: 1000000,    // ₦10,000
      Elite: 2500000,  // ₦25,000
    };

    const amount = tierAmounts[tierName];
    if (!amount) {
      return NextResponse.json({ error: 'Invalid tier. Use Pro or Elite.' }, { status: 400 });
    }

    // Create Paystack transaction
    const result = await paystackRequest(
      '/transaction/initialize',
      'POST',
      apiKey,
      {
        email,
        amount,
        currency: 'NGN',
        metadata: {
          tierName,
          userId,
          name,
          product_name: `SecLab Nigeria ${tierName} Access`,
        },
        callback_url: `https://seclab-nigeria.vercel.app/ctf?payment=success&tier=${tierName}`,
      }
    );

    if (result.statusCode !== 200) {
      console.error('Paystack API error:', result);
      return NextResponse.json(
        { error: 'Failed to create checkout session. Please try again.' },
        { status: result.statusCode || 500 }
      );
    }

    const responseData = result.data as { status: boolean; data: { authorization_url: string; reference: string } };
    if (!responseData.status || !responseData.data?.authorization_url) {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    }

    return NextResponse.json({
      checkoutUrl: responseData.data.authorization_url,
      reference: responseData.data.reference,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Checkout route error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
