"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateDoctorProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're not logged in." };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const specialtyId = String(formData.get("specialtyId") ?? "");
  const degree = String(formData.get("degree") ?? "").trim();
  const experience = Number(formData.get("experience") ?? 0);
  const hospital = String(formData.get("hospital") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);

  if (!fullName || !phone || !specialtyId || !degree || !hospital || !experience || !price) {
    return { error: "Please fill in every field." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone })
    .eq("id", user.id);
  if (profileError) return { error: profileError.message };

  const { error: doctorError } = await supabase
    .from("doctors")
    .update({ specialty_id: specialtyId, degree, experience, hospital, price })
    .eq("profile_id", user.id);
  if (doctorError) return { error: doctorError.message };

  revalidatePath("/doctor/profile");
  return { success: true };
}
