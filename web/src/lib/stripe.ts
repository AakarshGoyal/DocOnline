// A single shared Stripe client, server-side only. Never import this
// from a Client Component -- the secret key must never reach the
// browser.
//
// The Stripe SDK throws immediately if constructed with an empty
// string, which would otherwise crash the whole app build/boot in any
// environment where STRIPE_SECRET_KEY hasn't been set yet (a fresh
// Vercel preview deployment, a contributor's first `npm run build`,
// etc). Falling back to a placeholder keeps the app itself running;
// an actual attempt to use Stripe without a real key still fails
// loudly, just at the moment it's used instead of at build time.
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_not_configured", {
  apiVersion: "2026-08-26.dahlia",
});
