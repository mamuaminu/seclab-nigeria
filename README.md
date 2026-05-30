# SecLab Nigeria — CTF Platform

> **Revenue Status: $15/mo Pro · $40/mo Elite · 20 Private Challenges deployed**

A production-grade cybersecurity CTF platform built for Nigerian security talent. Built by [Muhammad Aminu Musa](https://github.com/mamuaminu).

---

## Products

| Product | URL | Revenue Model |
|---------|-----|--------------|
| **SecLab CTF** | [seclab-nigeria.vercel.app/ctf](https://seclab-nigeria.vercel.app/ctf) | LemonSqueezy ($15 Pro / $40 Elite) |
| **SecLab Courses** | [seclab-nigeria.vercel.app/courses](https://seclab-nigeria.vercel.app/courses) | Coming soon |
| **SecLab Recon SaaS** | [seclab-nigeria.vercel.app/recon](https://seclab-nigeria.vercel.app/recon) | Free tier + $25 Pro |

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env.local
# Fill in SUPABASE_SERVICE_ROLE_KEY + LemonSqueezy keys

# Seed private CTF challenges
node scripts/seed-private-challenges.js

# Run dev server
npm run dev
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Payments | LemonSqueezy (subscription billing) |
| Styling | Tailwind CSS (custom design system) |
| Hosting | Vercel (with server-side API routes) |

---

## Revenue Architecture

### How Payment Flow Works

```
User clicks "Upgrade to Pro" on CTF page
        ↓
ProGate component → /api/checkout route
        ↓
Server-side: LemonSqueezy REST API creates checkout
        ↓
user_id passed as custom_data in checkout
        ↓
User pays on LemonSqueezy hosted page
        ↓
LemonSqueezy POSTs to /api/webhooks/lemonsqueezy
        ↓
Webhook: supabase.profiles.is_pro = true
        ↓
User sees private challenges next page load
```

### Setting Up LemonSqueezy Products

1. Create account at [app.lemonsqueezy.com](https://app.lemonsqueezy.com)
2. Create **Pro Access** product ($15/month, recurring)
3. Create **Elite Access** product ($40/month, recurring)
4. Get Variant IDs from each product's URL: `/store/YOUR-STORE/checkout/buy/VARIANT-ID`
5. Add to `.env.local`:
   ```
   LEMONSQUEEZY_API_KEY=...
   LEMONSQUEEZY_STORE_ID=...
   LEMONSQUEEZY_WEBHOOK_SECRET=...
   NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID=...
   NEXT_PUBLIC_LEMON_SQUEEZY_ELITE_VARIANT_ID=...
   ```
6. Register webhook: `https://your-domain.com/api/webhooks/lemonsqueezy`
   - Events: `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired`

---

## Database Schema

### challenges
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| title | text | Challenge name |
| description | text | Full description |
| category | text | Web, Crypto, Network, etc. |
| difficulty | text | Easy, Medium, Hard, Insane |
| points | integer | Score value |
| hint | text | Free hint shown on challenge |
| flag_hash | text | SHA256 of the flag |
| tags | jsonb | Array of tag strings |
| is_private | boolean | Only visible to Pro users |
| active | boolean | Show/hide challenge |

### ctf_hints
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| challenge_id | integer | FK → challenges |
| hint_text | text | Hint content |
| hint_order | integer | Display order |
| unlock_cost | integer | Points to unlock |

### profiles
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK (also user_id from localStorage) |
| username | text | Display name |
| points | integer | Total CTF points |
| solves_count | integer | Total solves |
| is_pro | boolean | Pro subscription active |
| pro_variant_id | text | LS variant purchased |

---

## Scripts

### `scripts/seed-private-challenges.js`
Seeds 20 premium challenges (Hard + Insane difficulty) into the database.
Run this when setting up or resetting the private challenge pool.

```bash
SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/seed-private-challenges.js
```

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add all `.env.local` variables in Vercel Dashboard → Settings → Environment Variables.

**Important:** Next.js API routes require server-side rendering. Do NOT use `next export`. GitHub Pages is not supported for this project.

### Railway

```bash
railway login
railway init
railway up
```

---

## Features

- [x] Free CTF challenges (public)
- [x] Pro/Elite paid tiers via LemonSqueezy
- [x] Private challenge vault (20 challenges)
- [x] Points system with leaderboard
- [x] Hint system with point unlock
- [x] Daily challenge rotation
- [x] Webhook-driven subscription activation
- [x] Mobile-responsive design
- [x] Dark mode design system

---

## License

Proprietary — All rights reserved Muhammad Aminu Musa.