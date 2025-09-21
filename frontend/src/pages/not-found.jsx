import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Robot404(props) {
  return (
    <svg
      viewBox="0 0 800 520"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="nfTitle nfDesc"
      role="img"
      {...props}
    >
      <title id="nfTitle">404 not found</title>
      <desc id="nfDesc">A friendly, semi-realistic robot in front of 404</desc>

      <defs>
        {/* Metal gradients */}
        <linearGradient id="metal-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6C7686" />
          <stop offset="50%" stopColor="#4B5563" />
          <stop offset="100%" stopColor="#3B4250" />
        </linearGradient>
        <linearGradient id="metal-mid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8C96A6" />
          <stop offset="100%" stopColor="#5B6472" />
        </linearGradient>
        <linearGradient id="metal-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B2B9C6" />
          <stop offset="100%" stopColor="#7B8494" />
        </linearGradient>
        {/* Glass/screen */}
        <linearGradient id="screen-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        {/* Eye glow */}
        <radialGradient id="eye-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFD54A" />
          <stop offset="100%" stopColor="#CC8F00" />
        </radialGradient>
        {/* Ground shadow */}
        <radialGradient id="ground" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E5E7EB" />
          <stop offset="100%" stopColor="#F3F4F6" />
        </radialGradient>
        {/* Soft shadow filter */}
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity=".12" />
        </filter>
        <filter id="tinyGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Animations */}
      <style>{`
        .float { animation: float 4s ease-in-out infinite; }
        .arm-sway { animation: sway 3.8s ease-in-out infinite; transform-box: fill-box; transform-origin: top center; }
        .blink { animation: blink 6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .antenna { animation: pulse 1.6s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes blink {
          0%, 92%, 100% { transform: scaleY(1); }
          94%, 96% { transform: scaleY(0.12); }
        }
        @keyframes pulse {
          0%, 100% { opacity: .85; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* 404 backdrop */}
      <g opacity="0.18">
        <text x="110" y="240" fontFamily="Inter, ui-sans-serif" fontWeight="800" fontSize="200" fill="#FACC15">
          404
        </text>
      </g>

      {/* Ground */}
      <ellipse cx="400" cy="440" rx="150" ry="22" fill="url(#ground)" />

      {/* Loose wires */}
      <path d="M120 310 C 200 330, 240 360, 270 395" stroke="#9CA3AF" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="270" cy="395" r="6" fill="#9CA3AF" />
      <path d="M680 310 C 600 330, 560 360, 530 395" stroke="#9CA3AF" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="530" cy="395" r="6" fill="#9CA3AF" />

      {/* Robot */}
      <g className="float" filter="url(#softShadow)">
        {/* Arms */}
        <g className="arm-sway">
          {/* Left arm group */}
          <g transform="translate(320,280)">
            <circle cx="0" cy="0" r="8" fill="url(#metal-light)" />
            <rect x="-10" y="6" width="20" height="55" rx="8" fill="url(#metal-mid)" />
            <circle cx="0" cy="64" r="7" fill="url(#metal-light)" />
            {/* Hand + plug */}
            <rect x="-8" y="68" width="16" height="14" rx="3" fill="#6B7280" />
            <rect x="-3" y="80" width="6" height="10" rx="1.5" fill="#9CA3AF" />
          </g>

          {/* Right arm group */}
          <g transform="translate(480,280)">
            <circle cx="0" cy="0" r="8" fill="url(#metal-light)" />
            <rect x="-10" y="6" width="20" height="55" rx="8" fill="url(#metal-mid)" />
            <circle cx="0" cy="64" r="7" fill="url(#metal-light)" />
            {/* Hand + plug */}
            <rect x="-8" y="68" width="16" height="14" rx="3" fill="#6B7280" />
            <rect x="-3" y="80" width="6" height="10" rx="1.5" fill="#9CA3AF" />
          </g>
        </g>

        {/* Body */}
        <g transform="translate(350,260)">
          <rect x="0" y="0" width="100" height="140" rx="14" fill="url(#metal-dark)" stroke="#2F3744" strokeWidth="2" />
          {/* Panel ribs */}
          <rect x="22" y="36" width="56" height="10" rx="3" fill="#AAB3C0" opacity=".55" />
          <rect x="22" y="58" width="56" height="10" rx="3" fill="#AAB3C0" opacity=".4" />
          <rect x="22" y="80" width="56" height="10" rx="3" fill="#AAB3C0" opacity=".3" />
          {/* Side bolts */}
          <circle cx="6" cy="16" r="3" fill="#9CA3AF" />
          <circle cx="94" cy="16" r="3" fill="#9CA3AF" />
          <circle cx="6" cy="124" r="3" fill="#9CA3AF" />
          <circle cx="94" cy="124" r="3" fill="#9CA3AF" />
        </g>

        {/* Head */}
        <g transform="translate(335,175)">
          <rect x="0" y="0" width="130" height="85" rx="12" fill="url(#metal-mid)" stroke="#3B4452" strokeWidth="2" />
          {/* Side ears */}
          <rect x="-14" y="26" width="14" height="24" rx="4" fill="url(#metal-light)" />
          <rect x="130" y="26" width="14" height="24" rx="4" fill="url(#metal-light)" />
          {/* Antenna */}
          <g className="antenna">
            <rect x="62" y="-18" width="6" height="18" rx="3" fill="#F59E0B" />
            <circle cx="65" cy="-22" r="6" fill="#FCD34D" filter="url(#tinyGlow)" />
          </g>
          {/* Eyes */}
          <g transform="translate(30,28)" className="blink">
            <ellipse cx="0" cy="0" rx="12" ry="8" fill="url(#eye-glow)" />
            <rect x="-12" y="-2" width="24" height="4" rx="2" fill="#111827" opacity=".35" />
          </g>
          <g transform="translate(98,28)" className="blink">
            <ellipse cx="0" cy="0" rx="12" ry="8" fill="url(#eye-glow)" />
            <rect x="-12" y="-2" width="24" height="4" rx="2" fill="#111827" opacity=".35" />
          </g>
          {/* Mouth slot */}
          <rect x="55" y="56" width="20" height="6" rx="3" fill="#0F172A" opacity=".35" />
          {/* Top gloss */}
          <path d="M8,6 h114 a10,10 0 0 1 10,10 v0 c-30,12 -94,12 -134,0 v0 a10,10 0 0 1 10,-10 z" fill="#FFFFFF" opacity=".08" />
        </g>

        {/* Legs */}
        <g transform="translate(370,400)">
          <rect x="0" y="0" width="26" height="20" rx="4" fill="url(#metal-dark)" />
          <rect x="42" y="0" width="26" height="20" rx="4" fill="url(#metal-dark)" />
          {/* Feet shadows */}
          <ellipse cx="13" cy="26" rx="18" ry="5" fill="#E5E7EB" opacity=".7" />
          <ellipse cx="55" cy="26" rx="18" ry="5" fill="#E5E7EB" opacity=".7" />
        </g>
      </g>
    </svg>
  );
}

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-tr from-primary/10 via-accent/10 to-transparent blur-2xl" />
          <Robot404 className="mx-auto h-56 w-auto sm:h-72" />
        </div>

        <h1 className="mt-6 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you’re looking for doesn’t exist or may have moved.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-muted"
          >
            Go back
          </button>
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground shadow hover:opacity-90"
          >
            Go to Home
          </Link>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          If you believe this is a bug, please contact support.
        </p>
      </div>
    </div>
  );
}