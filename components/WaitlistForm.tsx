"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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

export default function WaitlistForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const mountedAt = useRef(0);

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
      <p className="form-success">
        You&rsquo;re on the list. <strong>See you on the other side.</strong>
      </p>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <div className="waitlist-form-row">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          aria-label="Email address"
          disabled={status === "submitting"}
        />
        <input
          type="text"
          name="company"
          className="hp-field"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button
          type="submit"
          className="button button-primary"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Joining…" : "Count me in"}
        </button>
      </div>
      {status === "error" && (
        <p className="form-error">
          {errorMessage || "Something went wrong — try again."}
        </p>
      )}
    </form>
  );
}
