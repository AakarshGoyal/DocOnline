"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function bookSlot(formData: FormData) {
  const slotId = String(formData.get("slotId") ?? "");
  const remarks = String(formData.get("remarks") ?? "");
  const doctorId = String(formData.get("doctorId") ?? "");

  if (!slotId) {
    return { error: "Please pick a slot first." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("book_slot", {
    p_slot_id: slotId,
    p_remarks: remarks,
  });

  if (error) {
    // Most likely: someone else booked it a second before you did.
    // Refresh the slot list so the person can pick a different time.
    revalidatePath(`/patient/book/${doctorId}`);
    return { error: error.message };
  }

  redirect("/patient/appointments");
}
