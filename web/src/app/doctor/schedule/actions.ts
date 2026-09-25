"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setTodaysHours(formData: FormData) {
  const start = String(formData.get("start") ?? "");
  const end = String(formData.get("end") ?? "");

  if (!start || !end) {
    return { error: "Please pick both a start and end time." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("generate_today_slots", {
    p_start: start,
    p_end: end,
  });

  if (error) return { error: error.message };

  revalidatePath("/doctor/schedule");
  return { success: true };
}
