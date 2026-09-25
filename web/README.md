# DocOnline (web)

A rebuild of the DocOnline appointment-booking app as a website
instead of an Android-only app. Same idea — patients book doctor
appointments, doctors manage their schedule — built to fix the known
issues in the original (plaintext passwords, double-booking, outdated
Android target).

See **[SETUP.md](./SETUP.md)** for the click-by-click guide to getting
this online (Supabase project, Google sign-in, deploying to Vercel).

## Stack

- [Next.js](https://nextjs.org) (React) for the website itself.
- [Supabase](https://supabase.com) for the database, login (email
  and Google), and security rules.
- Deployed on [Vercel](https://vercel.com).

## What's inside

- `supabase/schema.sql` — the entire database structure, security
  rules, and the booking logic (as plain SQL you run once).
- `src/app/` — every page of the site, organized by folder to match
  the URL (e.g. `src/app/patient/appointments/page.tsx` is the page at
  `/patient/appointments`).
- `src/lib/supabase/` — the two ways the app talks to Supabase (from
  the browser, and from the server).
- `src/components/` — small reusable pieces (buttons, inputs, the nav
  bar) shared across pages.

## Local development

```
npm install
cp .env.local.example .env.local   # then fill in your Supabase keys
npm run dev
```
