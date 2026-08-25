"use client";

import { useState } from "react";

const links = [
  { href: "#inside", label: "How it works" },
  { href: "#why", label: "Why PlayThruu" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav md:hidden">
      <button
        type="button"
        className="mobile-nav-toggle"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={function () {
          setOpen(function (v) {
            return !v;
          });
        }}
      >
        <span className={"mobile-nav-toggle-bar" + (open ? " is-open-top" : "")} />
        <span className={"mobile-nav-toggle-bar" + (open ? " is-open-bottom" : "")} />
      </button>
      {open && (
        <div id="mobile-nav-panel" className="mobile-nav-panel">
          {links.map(function (link) {
            return (
              <a
                key={link.href}
                href={link.href}
                className="mobile-nav-link"
                onClick={function () {
                  setOpen(false);
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
