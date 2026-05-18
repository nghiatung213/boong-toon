# MirAi — Production Deployment Guide

## Architecture

| Layer | Production |
|--------|------------|
| Frontend | Vercel |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Files | Supabase Storage |
| Email | Resend |

Local dev without Supabase: set `USE_JSON_DB=true` in `.env.local`.

---

## Step 1 — Supabase setup

1. Create project at [supabase.com](https://supabase.com)
2. **SQL Editor** → run in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_storage_buckets.sql`
3. **Authentication** → Email → enable Email provider
4. **Authentication** → URL Configuration:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/**`, `http://localhost:3000/**`
5. Copy keys from **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY` (server only, never expose)

---

## Step 2 — Migrate existing JSON data

```bash
cd web
cp .env.example .env.local
# Fill Supabase keys in .env.local

npx tsx scripts/migrate-json-to-supabase.ts
```

**Note:** Legacy JSON users use text IDs — they must re-register via Supabase Auth. Purchases/entitlements migrate if `user_id` matches profile UUIDs.

---

## Step 3 — Vercel deployment

1. Push repo to GitHub
2. [vercel.com](https://vercel.com) → Import project → root directory: **`web`**
3. Environment variables (Production):

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AUTH_SECRET=
ADMIN_PASSWORD=
RESEND_API_KEY=
EMAIL_FROM=
```

4. Deploy → verify `/`, `/auth/login`, `/admin`

---

## Step 4 — Custom domain + DNS

1. Vercel → Project → **Settings → Domains** → Add `yourdomain.com`
2. DNS at your registrar:

| Type | Name | Value |
|------|------|--------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

3. SSL is automatic (Let’s Encrypt via Vercel)
4. Update `NEXT_PUBLIC_SITE_URL` and Supabase Auth redirect URLs

---

## Step 5 — Resend email

1. Verify domain at [resend.com](https://resend.com)
2. Set `EMAIL_FROM=MirAi <noreply@yourdomain.com>`
3. Test signup → check inbox

---

## Step 6 — PWA & SEO

Already configured:

- `public/manifest.json`
- `src/app/sitemap.ts`, `robots.ts`
- OpenGraph in `src/app/layout.tsx`
- Service worker: `public/sw.js`

After deploy, test **Add to Home Screen** on iOS/Android.

---

## Production checklist

- [ ] Supabase migrations applied
- [ ] Storage buckets created
- [ ] All Vercel env vars set
- [ ] `AUTH_SECRET` and `ADMIN_PASSWORD` changed from defaults
- [ ] `NEXT_PUBLIC_SITE_URL` matches live domain
- [ ] Supabase Auth redirect URLs updated
- [ ] Resend domain verified
- [ ] Run migration script for catalog/chapters
- [ ] Test: signup, login, purchase flow, admin approve, email
- [ ] Test: reader progress sync (login on two browsers)
- [ ] Admin `/admin` password works

---

## Caching strategy

| Asset | Strategy |
|-------|----------|
| Static JS/CSS | Vercel CDN, long cache |
| `public/uploads` (JSON mode) | Not used in production |
| Supabase Storage images | Public CDN via Supabase |
| API routes | Dynamic, no cache |
| PWA shell | Service worker caches `/` + offline page |

---

## Troubleshooting

**Build fails on middleware:** Ensure Supabase env vars are set in Vercel, or set `USE_JSON_DB=true` temporarily.

**Auth loop:** Check Supabase Site URL and Redirect URLs match your domain.

**Images 404:** Verify storage buckets and `next.config.ts` includes Supabase hostname.

**Emails not sending:** Check `RESEND_API_KEY` and domain verification; fallback logs in `data/email-outbox.json` when key missing.
