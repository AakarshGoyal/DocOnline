import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { Card, PrimaryButton } from "@/components/ui";

// Where Stripe sends the patient back after a successful payment. We
// re-check with Stripe itself (never trust the URL alone) that money
// actually moved, then use the details Stripe stored at checkout time
// to make the actual booking -- the same atomic, race-safe booking
// function used everywhere else in the app.
export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/patient/checkout/success">) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : "";

  if (!sessionId) {
    return <ResultCard ok={false} message="Missing checkout session." />;
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return (
      <ResultCard
        ok={false}
        message="Payment was not completed, so no appointment was booked."
      />
    );
  }

  const slotId = session.metadata?.slot_id;
  const remarks = session.metadata?.remarks ?? "";

  if (!slotId) {
    return (
      <ResultCard
        ok={false}
        message="Payment succeeded, but we couldn't find which slot to book. Please contact support with this reference:"
        reference={sessionId}
      />
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("book_slot", {
    p_slot_id: slotId,
    p_remarks: remarks,
  });

  if (error) {
    // Rare: the slot got taken in the few seconds it took to pay.
    // The card was already charged, so this needs a human to sort out
    // (a refund) rather than silently losing the customer's money.
    return (
      <ResultCard
        ok={false}
        message={`Payment succeeded, but the slot could not be booked (${error.message}). Please contact support for a refund, with this reference:`}
        reference={sessionId}
      />
    );
  }

  return <ResultCard ok={true} message="Your appointment is booked." />;
}

function ResultCard({
  ok,
  message,
  reference,
}: {
  ok: boolean;
  message: string;
  reference?: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-1 items-center justify-center">
      <Card className="w-full space-y-4 text-center">
        <div className="text-4xl">{ok ? "✅" : "⚠️"}</div>
        <p className="text-[var(--foreground)]">{message}</p>
        {reference && (
          <p className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 font-mono text-xs text-[var(--text-muted)]">
            {reference}
          </p>
        )}
        <Link href={ok ? "/patient/appointments" : "/patient"}>
          <PrimaryButton type="button">
            {ok ? "View my appointments" : "Back to dashboard"}
          </PrimaryButton>
        </Link>
      </Card>
    </div>
  );
}
