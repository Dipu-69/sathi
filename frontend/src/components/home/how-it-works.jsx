import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const steps = [
    { n: 1, title: "Share how you feel", desc: "Pick a mood or type to Sathi in a safe, judgment‑free space." },
    { n: 2, title: "Get gentle guidance", desc: "Try small, doable steps—breathing, reframes, prompts." },
    { n: 3, title: "Find the right expert", desc: "Browse language, specialty, and availability that fit you." },
    { n: 4, title: "Keep steady progress", desc: "Tiny check‑ins and tools to support your day." }
];

export default function HowItWorks() {
    return (
        <section className="space-y-8">
            <h2 className="text-xl md:text-2xl font-bold">How Sathi supports you</h2>

            <div className="relative grid gap-6 md:grid-cols-4">
                {/* colorful line behind steps */}
                <div className="pointer-events-none absolute left-0 right-0 top-1/2 -z-10 hidden md:block h-1 bg-gradient-to-r from-teal-300 via-indigo-300 to-pink-300" />
                {steps.map((s) => (
                    <div key={s.n} className="relative rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow">
                        <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary/90 to-accent/90 text-white text-sm font-bold">
                            {s.n}
                        </div>
                        <div className="font-semibold">{s.title}</div>
                        <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                    </div>
                ))}
            </div>

            <div>
                <Button asChild>
                    <Link to="/chat">Start with Sathi <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
        </section>
    );
}