# Getting DocOnline (web) running — step by step

You don't need to write any code for this. Just follow the steps in
order. Anywhere you see `you`, that's a click-by-click step for you;
everything else is already done in the code.

---

## Part 1 — Set up the database (Supabase)

You said you already made a Supabase account, so:

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and
   click **New project**.
   - Name it anything, e.g. `doconline`.
   - Pick a database password (Supabase generates one for you — just
     save it somewhere, a password manager or a note. You won't need
     to type it again for anything in this guide).
   - Pick the region closest to you.
   - Click **Create new project** and wait ~2 minutes for it to spin up.

2. Once it's ready, open the **SQL Editor** in the left sidebar, click
   **New query**, then open the file `web/supabase/schema.sql` from
   this project, copy its entire contents, paste it into the SQL
   editor, and click **Run** (bottom right).
   - You should see "Success. No rows returned." That means all the
     tables, security rules, and booking logic are now live.

3. Get your API keys: click the **Settings** (gear icon) in the
   sidebar → **API**. You'll see:
   - **Project URL** — looks like `https://xxxxx.supabase.co`
   - **anon public** key — a long string under "Project API keys"

   Keep this tab open, you'll paste these in Part 3.

4. Turn on Google login: **Authentication** (left sidebar) →
   **Sign In / Providers** → find **Google** in the list → toggle it
   on. It will ask for a **Client ID** and **Client Secret** — that's
   Part 2 below. Also copy the **Callback URL (for OAuth)** shown on
   this same Google provider screen — you'll need it in Part 2. Leave
   this Supabase tab open too.

---

## Part 2 — Set up "Sign in with Google"

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
   and create a new project (top-left project dropdown → **New
   Project**), any name is fine.

2. In the search bar at the top, search for **OAuth consent screen**
   and open it.
   - User type: **External**.
   - Fill in an app name (e.g. "DocOnline"), your email as support
     email, and your email again under developer contact info.
   - You can skip scopes and test users for now — save and continue
     through each step.

3. Search for **Credentials** in the top search bar and open it.
   - Click **Create Credentials** → **OAuth client ID**.
   - Application type: **Web application**.
   - Under **Authorized redirect URIs**, click **Add URI** and paste
     the **Callback URL** you copied from Supabase in step Part 1.4.
   - Click **Create**. A popup shows a **Client ID** and **Client
     secret** — copy both.

4. Back in the Supabase tab (Part 1.4), paste that Client ID and
   Client secret into the Google provider fields, and click **Save**.

Google login is now wired up.

---

## Part 3 — Run the app on your own computer (optional, to test)

Only do this if you want to preview it locally before putting it
online. Otherwise skip straight to Part 4.

1. Install [Node.js](https://nodejs.org) (the LTS version) if you
   don't have it.
2. Open a terminal in the `web` folder of this project and run:
   ```
   npm install
   ```
3. Copy `.env.local.example` to a new file named `.env.local` in that
   same folder, and paste in the Project URL and anon public key from
   Part 1.3.
4. Run:
   ```
   npm run dev
   ```
5. Open the link it prints (usually `http://localhost:3000`) in your
   browser.

---

## Part 4 — Put it on the internet (Vercel)

You said you already have a Vercel account, so:

1. Push this repository to GitHub if it isn't already there (ask me
   and I can do this part for you).
2. Go to [vercel.com/new](https://vercel.com/new), and import this
   GitHub repository.
3. Vercel will ask for the **Root Directory** — set it to `web`
   (important: the actual website code lives in the `web` folder of
   this repo, not the repo root, which still has the old Android app).
4. Before clicking Deploy, expand **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Project URL from Part 1.3
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your anon public key from Part 1.3
5. Click **Deploy**. In about a minute you'll get a live link like
   `https://doconline-yourname.vercel.app` that anyone can open.

6. One last step: Google needs to know about this new live address.
   Go back to Google Cloud Console → Credentials → your OAuth client,
   and add another **Authorized redirect URI**:
   `https://<your-vercel-domain>/auth/callback` (use your real Vercel
   link). Save.

That's it — the app is live. Any time I make more changes and push
them, Vercel automatically redeploys the new version to the same link.

---

---

## Part 5 — Real (test-mode) payments with Stripe

You're already through Parts 1–4, so the app is live. This adds real
Stripe checkout (test mode — no real money moves) in place of the old
"Complete Payment" button.

1. Go to [dashboard.stripe.com/register](https://dashboard.stripe.com/register)
   and create a free account (you can skip the "activate your account"
   business details for now — test mode works without them).
2. Once in the dashboard, make sure the toggle near the top says
   **Test mode** (it does by default for a new account).
3. Go to **Developers** → **API keys** in the left sidebar.
4. Copy the **Secret key** (starts with `sk_test_...`). Click "Reveal
   test key" if it's hidden.
5. Add it to Vercel: your project on vercel.com → **Settings** →
   **Environment Variables** → add:
   - `STRIPE_SECRET_KEY` → the `sk_test_...` value you copied.
6. Redeploy (Vercel → **Deployments** tab → "..." on the latest one →
   **Redeploy**) so the new variable takes effect.

That's it. On the live site, booking a slot now takes you to a real
Stripe checkout page. Use Stripe's official test card to "pay" without
moving real money:

- Card number: `4242 4242 4242 4242`
- Expiry: any future date (e.g. `12/34`)
- CVC: any 3 digits
- ZIP: any 5 digits

**Going live later** (charging real cards) means finishing Stripe's
"Activate your account" step (business/bank details) and swapping the
`sk_test_...` key for the `sk_live_...` one — tell me when you're ready
for that and I'll walk you through it.

---

## If something doesn't work

Tell me what you see (a screenshot of any error is perfect) and I'll
fix it — you don't need to diagnose it yourself.
