import { useState } from "react";
import Button from "../ui/Button.jsx";

const links = [
  { href: "#properties", label: "Properties" },
  { href: "#who", label: "Who it's for" },
  { href: "#features", label: "Features" },
  { href: "#compare", label: "Why Routify" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-4 py-[18px] sm:px-8">
        <div className="flex items-center gap-2 font-display text-[19px] font-bold">
          <span className="h-[9px] w-[9px] rounded-full bg-blue shadow-[0_0_0_3px_rgba(76,141,255,0.2)]" />
          Routify
        </div>

        {/* Desktop links */}
        <div className="hidden gap-8 text-[14.5px] text-muted md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-fg">{l.label}</a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" href="/login">Log in</Button>
          <Button variant="primary" href="/register">Start free</Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-line md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="border-t border-line bg-ink px-4 py-5 md:hidden">
          <div className="flex flex-col gap-4 text-[14.5px] text-muted">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-fg">
                {l.label}
              </a>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Button variant="ghost" href="#">Log in</Button>
            <Button variant="primary" href="#">Start free</Button>
          </div>
        </div>
      )}
    </nav>
  );
}