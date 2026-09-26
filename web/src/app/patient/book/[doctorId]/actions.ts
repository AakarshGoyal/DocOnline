"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

// Step 1 of paying: send the patient to Stripe's own hosted checkout
// page. We don't book the slot yet -- that only happens after Stripe
// confirms the payment actually went through (see checkout/actions.ts).
export async function startCheckout(formData: FormData) {
  const slotId = String(formData.get("slotId") ?? "");
  const remarks = String(formData.get("remarks") ?? "");
  const doctorId = String(formData.get("doctorId") ?? "");

  if (!slotId) {
    return { error: "Please pick a slot first." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?role=patient");

  const { data: doctor } = await supabase
    .from("doctors")
    .select("price")
    .eq("profile_id", doctorId)
    .maybeSingle();
  const { data: doctorProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", doctorId)
    .maybeSingle();

  if (!doctor) {
    return { error: "Could not find that doctor." };
  }

  const origin = (await headers()).get("origin");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(doctor.price) * 100),
          product_data: {
            name: `Appointment with Dr. ${doctorProfile?.full_name ?? ""}`,
          },
        },
        quantity: 1,
      },
    ],
    // These three values travel with the payment itself, so the success
    // page can trust them even though they started out as form fields --
    // Stripe (not the visitor's browser) is what hands them back to us.
    metadata: {
      slot_id: slotId,
      remarks,
      patient_id: user.id,
    },
    success_url: `${origin}/patient/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/patient/book/${doctorId}`,
  });

  if (!session.url) {
    return { error: "Could not start checkout. Please try again." };
  }
  redirect(session.url);
}
