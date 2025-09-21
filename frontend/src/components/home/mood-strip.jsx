import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const moods = [
    { key: "calm", label: "Calm", gradient: "from-teal-400 to-emerald-500", emoji: "🫶" },
    { key: "stressed", label: "Stressed", gradient: "from-amber-400 to-orange-500", emoji: "😮‍💨" },
    { key: "anxious", label: "Anxious", gradient: "from-indigo-400 to-blue-600", emoji: "😟" },
    { key: "sad", label: "Sad", gradient: "from-sky-400 to-cyan-500", emoji: "😔" },
    { key: "angry", label: "Angry", gradient: "from-rose-400 to-pink-500", emoji: "😤" },
    { key: "grateful", label: "Grateful", gradient: "from-violet-400 to-fuchsia-500", emoji: "🌸" },
    { key: "tired", label: "Tired", gradient: "from-slate-400 to-zinc-600", emoji: "🥱" },
];

const tips = {
    calm: "Nice. Consider a gratitude prompt to reinforce the calm.",
    stressed: "Try 1 minute of Box Breathing: inhale 4 • hold 4 • exhale 4 • hold 4.",
    anxious: "Ground yourself with 5-4-3-2-1: see 5, touch 4, hear 3, smell 2, taste 1.",
    sad: "A short “name the feeling” journaling note can help soften the weight.",
    angry: "Pause for 10 slow breaths, then plan one small next step.",
    grateful: "Write one thing you’re thankful for and why it matters today.",
    tired: "A mini body scan can help you rest: notice toes → legs → belly → shoulders.",
};

export default function MoodStrip() {
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const mood = useMemo(() => moods.find((m) => m.key === selected) || null, [selected]);

    const pickMood = (key) => {
        setSelected(key);
        setOpen(true);
    };

    const reset = () => {
        setOpen(false);
        setSelected(null);
    };

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <section className="space-y-4">
            <header className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold">How are you feeling today?</h2>
                <Button variant="secondary" size="sm" onClick={reset}>
                    Reset
                </Button>
            </header>

            {/* Mood chips */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {moods.map((m) => (
                    <button
                        key={m.key}
                        onClick={() => pickMood(m.key)}
                        className={`shrink-0 rounded-full pl-3 pr-3 py-2 text-sm text-white shadow transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 bg-gradient-to-r ${m.gradient} hover:-translate-y-0.5`}
                        aria-pressed={selected === m.key}
                    >
                        <span className="mr-1">{m.emoji}</span> {m.label}
                    </button>
                ))}
            </div>

            {/* Inline tip (still shows under chips) */}
            <div className="min-h-[52px]" aria-live="polite" aria-atomic="true">
                {selected && (
                    <div className="rounded-xl border bg-gradient-to-r from-primary/10 via-accent/10 to-transparent p-4 text-sm">
                        <span className="font-medium mr-1">Tip:</span>
                        {tips[selected]}
                    </div>
                )}
            </div>

            {/* Emoji spotlight overlay */}
            {open && mood && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_.2s_ease-out]"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="mood-title"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="w-[min(92vw,520px)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`rounded-3xl p-[2px] bg-gradient-to-r ${mood.gradient} animate-[popIn_.22s_ease-out]`}>
                            <div className="rounded-3xl bg-background/95 p-6 shadow-xl ring-1 ring-black/5">
                                <button
                                    aria-label="Close"
                                    onClick={() => setOpen(false)}
                                    className="float-right inline-flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted"
                                >
                                    ✕
                                </button>

                                <div className="clear-both text-center">
                                    <div className="text-7xl md:text-8xl leading-none drop-shadow-sm select-none">
                                        {mood.emoji}
                                    </div>
                                    <h3 id="mood-title" className="mt-3 text-xl font-semibold">
                                        {mood.label}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {tips[mood.key]}
                                    </p>

                                    <div className="mt-6 flex justify-center gap-2">
                                        <Button variant="secondary" onClick={() => setOpen(false)}>
                                            Close
                                        </Button>
                                        <Button asChild>
                                            <Link to="/resources">Try a tool</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Keyframes (scoped) */}
                    <style>{`
            @keyframes popIn {
              0% { transform: scale(.96); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes fadeIn {
              from { opacity: 0; } to { opacity: 1; }
            }
          `}</style>
                </div>
            )}
        </section>
    );
}