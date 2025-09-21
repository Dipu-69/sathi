import React from "react";
import { Card } from "../ui/card";

const items = [
    { q: "Sathi helped me breathe and plan one tiny step. It felt doable.", a: "— R., 27" },
    { q: "I liked that it was gentle and practical, not preachy.", a: "— M., 34" },
    { q: "The prompts made it easier to name what I was feeling.", a: "— K., 22" }
];

export default function Testimonials() {
    return (
        <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">What people say</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {items.map((t, i) => (
                    <Card key={i} className="relative overflow-hidden p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
                        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary to-accent" />
                        <p className="italic">“{t.q}”</p>
                        <p className="mt-3 text-sm text-muted-foreground">{t.a}</p>
                    </Card>
                ))}
            </div>
        </section>
    );
}