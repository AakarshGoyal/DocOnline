"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function cancelAppointment(formData: FormData) {
  const appointmentId = String(formData.get("appointmentId") ?? "");
  const supabase = await createClient();
  await supabase.rpc("cancel_appointment", { p_appointment_id: appointmentId });
  revalidatePath("/patient/appointments");
}
