import React from "react";
import { Card } from "../ui/card";
import { Brain, Users, BookOpen } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Companion", desc: "Judgment-free space to reflect, reframe, and plan small steps." },
  { icon: Users, title: "Consultants", desc: "Discover specialists by language, focus, and availability." },
  { icon: BookOpen, title: "Tools", desc: "Breathing guides, prompts, and resources to support your day." }
];

export default function FeatureGrid() {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map(({ icon: Icon, title, desc }) => (
        <Card key={title} className="p-6 shadow-sm hover:shadow-md transition-shadow">
          <Icon className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground">{desc}</p>
        </Card>
      ))}
    </section>
  );
}