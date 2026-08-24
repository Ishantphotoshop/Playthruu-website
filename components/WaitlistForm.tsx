"use client";

import { FormEvent, useState } from "react";

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return <p className="form-success">Save complete. You are on the list — see you on the other side.</p>;
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <span className="prompt" aria-hidden="true">&gt;</span>
      <label htmlFor="email" className="sr-only">Email address</label>
      <input id="email" type="email" required placeholder="player@email.com" aria-label="Email address" />
      <button type="submit" className="button button-primary">Count me in <span>▶</span></button>
    </form>
  );
}
