@AGENTS.md

## SecLab Nigeria — Product Notes

### Revenue System (Built 2026-05-28)
- **ProGate component**: `app/components/ProGate.tsx` — modal + upsell for CTF upgrade
- **LemonSqueezy checkout**: `app/api/checkout/route.ts` — creates hosted checkout sessions
- **Webhook handler**: `app/api/webhooks/lemonsqueezy/route.ts` — grants `is_pro = true` in Supabase on subscription events
- **CTF page upgrade**: `app/ctf/page.tsx` — new "⭐ Private (Pro)" tab, pro badge, upsell banner

### Payment Flow
1. User clicks upgrade → ProGate modal → /api/checkout → redirects to LemonSqueezy hosted checkout
2. User pays on LemonSqueezy → webhook fires → `is_pro = true` in `profiles` table
3. CTF page checks `profile.is_pro` → shows private challenges tab + PRO badge

### Env Vars Required
- `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID`, `NEXT_PUBLIC_LEMON_SQUEEZY_ELITE_VARIANT_ID`
- Supabase `profiles` table needs `is_pro boolean default false` column

### Deployment
- API routes require SSR — **deploy to Vercel or Railway**, NOT GitHub Pages
- Remove `output: 'export'` from next.config.ts when deploying to Vercel
- GitHub Actions still builds static pages for the marketing UI; payment routes are server-only

### Supabase Schema Additions Needed
```sql
-- Add is_pro flag to profiles
ALTER TABLE profiles ADD COLUMN is_pro boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN pro_variant_id integer;
ALTER TABLE profiles ADD COLUMN pro_started_at timestamptz;
ALTER TABLE profiles ADD COLUMN pro_expires_at timestamptz;

-- Add private challenge flag
ALTER TABLE challenges ADD COLUMN is_private boolean DEFAULT false;
```