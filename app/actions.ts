"use server";

import { supabase } from "@/lib/supabase";
import { sendWaitlistConfirmation } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Below this, a submission is effectively instant — no real person reads
// the page, fills the field, and clicks submit that fast.
const MIN_SUBMIT_MS = 600;

type WaitlistMeta = {
  source?: string;
  honeypot?: string;
  elapsedMs?: number;
};

export async function joinWaitlist(
  email: string,
  meta: WaitlistMeta = {},
): Promise<{ ok: true } | { ok: false; message: string }> {
  // Bot signals: a filled honeypot field, or a submission faster than any
  // human could manage. Pretend success either way — don't tip off the bot.
  if (meta.honeypot) return { ok: true };
  if (typeof meta.elapsedMs === "number" && meta.elapsedMs < MIN_SUBMIT_MS) {
    return { ok: true };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "That doesn't look like a valid email address." };
  }

  const { error } = await supabase
    .from("waitlist")
    .insert({ email, source: meta.source || "direct" });

  if (error) {
    if (error.code === "23505") {
      // Already on the list — treat as success, no duplicate confirmation email.
      return { ok: true };
    }
    console.error("waitlist insert failed:", error);
    return { ok: false, message: "Something went wrong — try again." };
  }

  try {
    await sendWaitlistConfirmation(email);
  } catch (err) {
    // The signup itself succeeded; a flaky email send shouldn't fail the user-facing flow.
    console.error("waitlist confirmation email failed:", err);
  }

  return { ok: true };
}
