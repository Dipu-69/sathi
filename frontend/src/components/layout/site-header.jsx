import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Logo from "../common/logo";

const nav = [
  { to: "/", label: "Home" },
  { to: "/chat", label: "AI Companion" },
  { to: "/consultants", label: "Consultants" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact Us" },
];

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
      }
    >
      {label}
    </NavLink>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
      <div className="container h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-extrabold tracking-tight text-xl">Sathi</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => <NavItem key={n.to} {...n} />)}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild>
            <Link to="/chat">Talk to Sathi</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-2 mt-6">
                {nav.map((n) => <NavItem key={n.to} {...n} />)}
                <Button asChild className="mt-4">
                  <Link to="/chat">Talk to Sathi</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}