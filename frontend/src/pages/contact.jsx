import React from "react";
import ContactForm from "../components/forms/contact-form";
import contactImg from "../assets/contact-illustration.png";

export default function Contact() {
    return (
        // Two columns from md and up; image on the left, form on the right
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: integrated illustration (hidden on mobile, larger on desktop) */}
            <aside aria-hidden="true" className="relative hidden md:flex justify-start">
                {/* Brand blobs behind the image */}
                <div className="pointer-events-none absolute -z-10 inset-0">
                    <div className="absolute left-[-80px] top-[-60px] h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
                    <div className="absolute left-[140px] top-[180px] h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
                </div>

                {/* Subtle dot pattern */}
                <svg
                    className="absolute left-4 top-4 -z-10 opacity-15"
                    width="300"
                    height="200"
                    viewBox="0 0 220 160"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                            <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" className="text-foreground" />
                </svg>

                {/* Gradient blob for a unique feel */}
                <svg
                    viewBox="0 0 600 600"
                    className="absolute -z-10 w-[420px] lg:w-[520px] opacity-80 left-6 top-6"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="sathiGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="hsl(165 60% 40% / 0.18)" />
                            <stop offset="100%" stopColor="hsl(258 77% 70% / 0.18)" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M434.5,320.5Q415,391,350,430.5Q285,470,216.5,433Q148,396,114,327Q80,258,109,188.5Q138,119,210,101.5Q282,84,352.5,113.5Q423,143,442.5,216.5Q462,290,434.5,320.5Z"
                        fill="url(#sathiGrad)"
                    />
                </svg>

                {/* Illustration (no card/border), sized to balance with form */}
                <img
                    src={contactImg}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="relative z-10 w-full max-w-[500px] lg:max-w-[600px] xl:max-w-[660px] h-auto object-contain select-none"
                />
            </aside>

            {/* Right: heading + form */}
            <div className="md:max-w-[720px]">
                <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
                <p className="text-muted-foreground mb-6">
                    We’ll get back within 2–3 business days.
                </p>
                <ContactForm />
            </div>
        </div>
    );
}