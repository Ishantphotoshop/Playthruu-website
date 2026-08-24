"use server";

import { supabase } from "@/lib/supabase";
import { sendWaitlistConfirmation } from "@/lib/mailer";

export async function joinWaitlist(email: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") {
      // Already on the list — treat as success, no duplicate confirmation email.
      return { ok: true };
    }
    return { ok: false, message: error.message };
  }

  try {
    await sendWaitlistConfirmation(email);
  } catch (err) {
    // The signup itself succeeded; a flaky email send shouldn't fail the user-facing flow.
    console.error("waitlist confirmation email failed:", err);
  }

  return { ok: true };
}
