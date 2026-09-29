"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/ui";

const LINKS = [
  { href: "/#log", label: "Diary" },
  { href: "/#game-pages", label: "Game pages" },
  { href: "/#friends", label: "Friends" },
  { href: "/news", label: "News" },
];

// Transparent over the hero, solid once the page moves. On phones the
// links fold into a full-screen sheet; the waitlist button stays visible
// in the bar at every width because it's the one thing the site asks for.
export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(function () {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(
    function () {
      document.documentElement.classList.toggle("menu-open", open);
      if (!open) return;
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    },
    [open],
  );

  return (
    <header className={"site-nav" + (scrolled || open ? " is-solid" : "")}>
      <div className="site-nav__inner container">
        <Link href="/" className="site-nav__brand" aria-label="PlayThruu home" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <nav className="site-nav__links" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="site-nav__link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="site-nav__actions">
          <Link href="/#waitlist" className="btn btn--accent btn--sm" onClick={() => setOpen(false)}>
            Join the waitlist
          </Link>
          <button
            type="button"
            className="site-nav__toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={"site-nav__bar" + (open ? " is-open-a" : "")} />
            <span className={"site-nav__bar" + (open ? " is-open-b" : "")} />
          </button>
        </div>
      </div>

      <nav id="site-menu" className={"site-menu" + (open ? " is-open" : "")} aria-label="Menu" hidden={!open}>
        {LINKS.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className="site-menu__link"
            style={{ transitionDelay: open ? 60 + i * 40 + "ms" : "0ms" }}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
