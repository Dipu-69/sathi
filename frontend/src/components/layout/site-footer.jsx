
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../common/logo";
import { ArrowUp, Instagram, Linkedin, Twitter, Mail, Phone } from "lucide-react";
import { Button } from "../ui/button"; // used on desktop only

export default function SiteFooter() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { to: "/chat", label: "Chat" },
    { to: "/consultants", label: "Consultants" },
    { to: "/resources", label: "Resources" },
    { to: "/contact", label: "Contact" },
    { to: "/privacy", label: "Privacy" },
    { to: "/terms", label: "Terms" },
  ];

  return (
    <footer className="relative mt-16 bg-gradient-to-b from-background to-muted/40">
      {/* Accent top line + soft blobs */}
      <div aria-hidden="true" className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-teal-400/50 via-indigo-400/50 to-pink-400/50" />
      <div aria-hidden="true" className="pointer-events-none absolute -z-10">
        <div className="absolute -left-16 top-0 h-36 w-36 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-36 w-36 rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* MOBILE — super compact */}
      <div className="container py-6 md:hidden">
        {/* Brand row */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2">
            <Logo />
            <span className="font-extrabold tracking-tight text-lg">Sathi</span>
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted transition"
            aria-label="Back to top"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Top
          </button>
        </div>

        {/* Quick links as chips (horizontal scroll) */}
        <div className="mt-4 -mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {quickLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="shrink-0 rounded-full border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted transition"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Tiny help + contact (single line where possible) */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-primary" />
            Emergency: 112
          </span>
          <a href="mailto:support@sathi.app" className="inline-flex items-center gap-1 hover:underline">
            <Mail className="h-3.5 w-3.5 text-primary" />
            support@sathi.app
          </a>
        </div>

        {/* Social icons */}
        <div className="mt-3 flex items-center gap-2">
          <a aria-label="Sathi on Twitter" className="rounded-full border p-1.5 hover:bg-muted transition" href="#" target="_blank" rel="noreferrer">
            <Twitter className="h-4 w-4" />
          </a>
          <a aria-label="Sathi on Instagram" className="rounded-full border p-1.5 hover:bg-muted transition" href="#" target="_blank" rel="noreferrer">
            <Instagram className="h-4 w-4" />
          </a>
          <a aria-label="Sathi on LinkedIn" className="rounded-full border p-1.5 hover:bg-muted transition" href="#" target="_blank" rel="noreferrer">
            <Linkedin className="h-4 w-4" />
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-4 border-t pt-3 text-[11px] text-muted-foreground">
          © {year} Sathi. Gentle support, not a substitute for emergency care.
        </div>
      </div>

      {/* DESKTOP / TABLET — keep richer version */}
      <div className="container py-10 hidden md:block">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand + short text */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <Logo />
              <span className="font-extrabold tracking-tight text-xl">Sathi</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Gentle support for a calmer mind. Tools, guidance, and access to trusted consultants.
            </p>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>Emergency: 112 (India)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <a className="hover:underline" href="mailto:support@sathi.app">support@sathi.app</a>
              </div>
            </div>
          </div>

          {/* Explore */}
          <nav>
            <div className="text-sm font-semibold mb-3">Explore</div>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-primary" to="/chat">AI Companion</Link></li>
              <li><Link className="hover:text-primary" to="/consultants">Consultants</Link></li>
              <li><Link className="hover:text-primary" to="/resources">Resources</Link></li>
              <li><Link className="hover:text-primary" to="/about">About</Link></li>
              <li><Link className="hover:text-primary" to="/contact">Contact</Link></li>
            </ul>
          </nav>

          {/* Legal */}
          <nav>
            <div className="text-sm font-semibold mb-3">Legal</div>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-primary" to="/privacy">Privacy</Link></li>
              <li><Link className="hover:text-primary" to="/terms">Terms</Link></li>
            </ul>
          </nav>

          {/* Newsletter + socials */}
          <div>
            <div className="text-sm font-semibold mb-2">Stay in the loop</div>
            <p className="text-sm text-muted-foreground">
              Occasional updates with gentle prompts and new tools.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks! You’ll hear from us soon.");
              }}
              className="mt-2 flex gap-2 max-w-md"
            >
              <label htmlFor="f-email" className="sr-only">Email address</label>
              <input
                id="f-email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-md border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
              <Button type="submit" className="shrink-0">Subscribe</Button>
            </form>

            <div className="mt-4 flex items-center gap-3">
              <a aria-label="Sathi on Twitter" className="rounded-full border p-2 hover:bg-muted transition" href="#" target="_blank" rel="noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
              <a aria-label="Sathi on Instagram" className="rounded-full border p-2 hover:bg-muted transition" href="#" target="_blank" rel="noreferrer">
                <Instagram className="h-4 w-4" />
              </a>
              <a aria-label="Sathi on LinkedIn" className="rounded-full border p-2 hover:bg-muted transition" href="#" target="_blank" rel="noreferrer">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-top border-t pt-6 text-xs text-muted-foreground">
          <p>© {year} Sathi. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1.5 text-foreground hover:bg-muted transition"
            aria-label="Back to top"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}