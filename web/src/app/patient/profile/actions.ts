"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updatePatientProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're not logged in." };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const age = Number(formData.get("age") ?? 0);

  if (!fullName || !phone || !age) {
    return { error: "Please fill in every field." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone, age })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/patient/profile");
  return { success: true };
}
