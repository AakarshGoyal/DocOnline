"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function completeProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = formData.get("role") === "doctor" ? "doctor" : "patient";
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName || !phone) {
    return { error: "Please fill in your name and phone number." };
  }

  const age = role === "patient" ? Number(formData.get("age") ?? 0) : null;
  if (role === "patient" && (!age || age <= 0)) {
    return { error: "Please enter a valid age." };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    role,
    full_name: fullName,
    phone,
    age,
  });
  if (profileError) {
    return { error: profileError.message };
  }

  if (role === "doctor") {
    const specialtyId = String(formData.get("specialtyId") ?? "");
    const degree = String(formData.get("degree") ?? "").trim();
    const experience = Number(formData.get("experience") ?? 0);
    const hospital = String(formData.get("hospital") ?? "").trim();
    const price = Number(formData.get("price") ?? 0);

    if (!specialtyId || !degree || !hospital || !experience || !price) {
      return { error: "Please fill in every doctor field." };
    }

    const { error: doctorError } = await supabase.from("doctors").insert({
      profile_id: user.id,
      specialty_id: specialtyId,
      degree,
      experience,
      hospital,
      price,
    });
    if (doctorError) {
      return { error: doctorError.message };
    }
  }

  redirect(role === "doctor" ? "/doctor" : "/patient");
}
