import React from "react";

export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] rounded-md bg-primary px-3 py-2 text-primary-foreground shadow-md"
    >
      Skip to main content
    </a>
  );
}

