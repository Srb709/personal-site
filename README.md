# PA Real Estate SEO Lead Engine

Production-ready Next.js 14 (App Router) SEO site for generating inbound buyer leads in:
- Bucks County, PA
- Montgomery County, PA
- Northeast Philadelphia

## Stack
- Next.js 14 + App Router
- TypeScript
- Tailwind CSS
- Local JSON persistence for leads + analytics
- Server-side email notifications via SMTP + `nodemailer`

## Features
- Scalable topical cluster architecture (location hubs + subpages + financing guides).
- 50+ indexable pages generated from structured content data.
- Consistent reusable design system and mobile-first UI.
- Lead form on every content page.
- `/admin/leads` internal lead inbox.
- `/admin/analytics` internal analytics + self-improvement dashboard.
- Automated `sitemap.xml` + `robots.txt`.
- Metadata + OpenGraph + FAQ schema injection.
- Internal linking engine to prevent orphan pages.

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in `.env.local`:
   - `EMAIL_TO`
   - `EMAIL_FROM`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
4. Start dev server:
   ```bash
   npm run dev
   ```
5. Visit:
   - `http://localhost:3000`
   - `http://localhost:3000/admin/leads`
   - `http://localhost:3000/admin/analytics`

## Deal Builder email delivery (homepage gate)
- Required env vars (set in `.env.local`): `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
- Add them to a local `.env.local` file in the project root (copy from `.env.example`).
- Run locally with email enabled:
  ```bash
  npm install
  cp .env.example .env.local
  npm run dev
  ```

## Deployment (Vercel)
1. Push repo to Git provider.
2. Import project into Vercel.
3. Add environment variables from `.env.example`.
4. Deploy (no code changes required).

> Note: local file persistence on Vercel uses `/tmp` and is ephemeral by nature. For long-term storage, switch to a managed DB.

## Content scaling
Content definitions are centralized in `lib/content.ts`. Add new slugs/topics there; pages and linking are generated automatically.

## Self-improvement loop
`/admin/analytics` consumes local analytics and produces:
- top-performing topics
- pages with no traffic
- pages generating leads
- suggested new similar pages
- weak pages to rewrite

This enables continuous SEO iteration without third-party APIs.
