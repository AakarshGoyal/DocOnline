"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function rescheduleAppointment(formData: FormData) {
  const appointmentId = String(formData.get("appointmentId") ?? "");
  const newSlotId = String(formData.get("slotId") ?? "");

  if (!newSlotId) {
    return { error: "Please pick a new slot first." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("reschedule_appointment", {
    p_appointment_id: appointmentId,
    p_new_slot_id: newSlotId,
  });

  if (error) {
    revalidatePath(`/patient/appointments/${appointmentId}/reschedule`);
    return { error: error.message };
  }

  redirect("/patient/appointments");
}
