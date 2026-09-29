"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { joinWaitlist } from "@/app/actions";

function detectSource(): string {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source") || params.get("ref");
  if (utmSource) return utmSource;
  if (document.referrer) {
    try {
      return new URL(document.referrer).hostname;
    } catch {
      // malformed referrer — fall through to "direct"
    }
  }
  return "direct";
}

// Used twice on the homepage (hero and the closing section), so ids are
// generated per instance rather than hard-coded.
export default function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const mountedAt = useRef(0);
  const id = useId();

  useEffect(function () {
    mountedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email");
    const honeypot = form.get("company");
    if (typeof email !== "string") return;

    setStatus("submitting");
    const result = await joinWaitlist(email, {
      source: detectSource(),
      honeypot: typeof honeypot === "string" ? honeypot : undefined,
      elapsedMs: Date.now() - mountedAt.current,
    });

    if (result.ok) {
      setStatus("done");
      return;
    }
    setStatus("error");
    setErrorMessage(result.message);
  }

  if (status === "done") {
    return (
      <p className="waitlist-done" role="status" aria-live="polite">
        <span className="stamp stamp--playing">You&rsquo;re in</span>
        We&rsquo;ll email you when PlayThruu opens on 20 October.
      </p>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} noValidate={false}>
      <label htmlFor={id + "-email"} className="sr-only">
        Email address
      </label>
      <input
        id={id + "-email"}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@email.com"
        aria-describedby={status === "error" ? id + "-error" : undefined}
        aria-invalid={status === "error" || undefined}
        disabled={status === "submitting"}
      />
      <input type="text" name="company" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" className="btn btn--accent" disabled={status === "submitting"}>
        {status === "submitting" ? "Joining…" : "Join the waitlist"}
      </button>
      {status === "error" && (
        <p id={id + "-error"} className="form-error" role="alert">
          {errorMessage || "That didn't go through. Try again in a moment."}
        </p>
      )}
    </form>
  );
}
