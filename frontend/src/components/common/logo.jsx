import React from "react";

export default function Logo({ size = 28 }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Sathi — caring conversations"
    >
      {/* Chat bubble outline */}
      <rect
        x="6"
        y="7"
        width="36"
        height="24"
        rx="8"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bubble tail */}
      <path
        d="M22 31 L22 40 L30 33"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Heart inside (care) */}
      <path
        d="M24 28c-5-4-8-7-8-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 3-3 6-10 10z"
        fill="hsl(var(--primary))"
        fillOpacity="0.9"
      />

      {/* Small spark (gentle AI) */}
      <path
        d="M36 9l1.2 3.2 3.2 1.2-3.2 1.2-1.2 3.2-1.2-3.2-3.2-1.2 3.2-1.2z"
        fill="hsl(var(--accent))"
        opacity="0.95"
      />
    </svg>
  );
}