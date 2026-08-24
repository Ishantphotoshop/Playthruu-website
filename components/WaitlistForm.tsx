"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (typeof email !== "string") return;

    setStatus("submitting");
    const { error } = await supabase.from("waitlist").insert({ email });

    if (!error || error.code === "23505") {
      // 23505 = unique_violation (already on the list) — treat as success.
      setStatus("done");
      return;
    }
    setStatus("error");
    setErrorMessage(error.message);
  }

  if (status === "done") {
    return <p className="form-success">You&rsquo;re on the list. <strong>See you on the other side.</strong></p>;
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <div className="waitlist-form-row">
        <label htmlFor="email" className="sr-only">Email address</label>
        <input id="email" name="email" type="email" required placeholder="your@email.com" aria-label="Email address" disabled={status === "submitting"} />
        <button type="submit" className="button button-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Joining…" : "Count me in"}
        </button>
      </div>
      {status === "error" && <p className="form-error">{errorMessage || "Something went wrong — try again."}</p>}
    </form>
  );
}
