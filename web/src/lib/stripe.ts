// A single shared Stripe client, server-side only. Never import this
// from a Client Component -- the secret key must never reach the
// browser.
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-08-26.dahlia",
});
