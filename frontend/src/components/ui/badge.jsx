import React from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, variant = "muted", children, ...props }) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs";
  const variants = {
    muted: "bg-muted text-foreground/80",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-sky-100 text-sky-700",
    amber: "bg-amber-100 text-amber-700",
    primary: "bg-primary/10 text-primary",
  };
  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}