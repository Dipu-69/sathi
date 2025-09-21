import React from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
    const qas = [
        {
            q: "Is Sathi a substitute for therapy?",
            a: "No. Sathi offers supportive guidance and tools, and can help you find trusted consultants."
        },
        {
            q: "Is my data private?",
            a: "Yes. We collect the minimum needed to help you, with clear controls. See our Privacy page for details."
        },
        {
            q: "Can I use Sathi on mobile?",
            a: "Yes. Everything is responsive and touch‑friendly."
        }
    ];

    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold">Common questions</h2>
            <div className="space-y-3">
                {qas.map((x, i) => (
                    <details key={i} className="group rounded-xl border p-4 open:bg-muted/50">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-medium text-foreground">
                            <span className="truncate">{x.q}</span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-2 text-sm text-muted-foreground">{x.a}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}