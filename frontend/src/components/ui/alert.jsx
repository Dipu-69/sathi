import React from "react";
import { cn } from "../../lib/utils"; // <- changed

export function Alert({ className, variant = "default", ...props }) {
  return (
    <div
      role="status"
      className={cn(
        "w-full rounded-md border p-4",
        variant === "destructive"
          ? "border-destructive/30 text-destructive"
          : "border-border text-foreground",
        className
      )}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }) {
  return <h5 className={cn("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function AlertDescription({ className, ...props }) {
  return <div className={cn("text-sm text-muted-foreground", className)} {...props} />;
}