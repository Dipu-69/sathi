import React from "react";
import { Card } from "../ui/card";
import { Wind, Anchor, NotebookPen, Moon, Heart, Sparkles } from "lucide-react";

const tools = [
    { icon: Wind, title: "Box Breathing", desc: "Reset in 60s" },
    { icon: Anchor, title: "Grounding 5‑4‑3‑2‑1", desc: "Back to the present" },
    { icon: NotebookPen, title: "Journaling Prompt", desc: "Name the feeling" },
    { icon: Moon, title: "Wind‑down", desc: "Ease into rest" },
    { icon: Heart, title: "Self‑compassion", desc: "Be on your side" },
    { icon: Sparkles, title: "Reframe", desc: "Shift the lens" }
];

function ToolCard({ icon: Icon, title, desc }) {
    return (
        <div className="rounded-2xl p-[1px] bg-gradient-to-r from-teal-400/40 via-indigo-400/40 to-pink-400/40">
            <Card className="rounded-2xl bg-background/90 backdrop-blur px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/15 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <div className="font-semibold">{title}</div>
                        <div className="text-xs text-muted-foreground">{desc}</div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default function ToolsMarquee() {
    return (
        <section className="space-y-4">
            <header className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold">Daily tools that meet you where you are</h2>
            </header>

            <div className="relative overflow-hidden">
                {/* Edge fades */}
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />

                {/* Track */}
                <div className="group">
                    <div
                        className="
              flex w-max will-change-transform
              animate-sathi-marquee
              hover:[animation-play-state:paused]
            "
                    >
                        {/* Group A */}
                        <ul className="flex shrink-0 gap-4 pr-4">
                            {tools.map((t, i) => (
                                <li key={`a-${i}`}>
                                    <ToolCard {...t} />
                                </li>
                            ))}
                        </ul>
                        {/* Group B (duplicate for seamless loop) */}
                        <ul className="flex shrink-0 gap-4 pr-4" aria-hidden="true">
                            {tools.map((t, i) => (
                                <li key={`b-${i}`}>
                                    <ToolCard {...t} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}