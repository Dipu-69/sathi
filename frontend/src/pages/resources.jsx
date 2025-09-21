import React, { useMemo, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import ResourceCard from "../components/resources/resource-card";
import CategoryChips from "../components/resources/category-chips";
import {
  Wind,
  Anchor,
  NotebookPen,
  Moon,
  Heart,
  Sparkles,
  Sun,
  Brain,
  Bed,
  Zap,
  Ear,
  Smile,
  Music2,
  FileText,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

const CATEGORIES = ["Exercises", "Journaling", "Mindfulness", "Sleep", "SOS"];

const RESOURCES = [
  // Exercises
  { id: 1, title: "Box Breathing (4‑4‑4‑4)", desc: "Reset in one minute with a steady rhythm.", category: "Exercises", minutes: 1, tags: ["breathing", "calm"], icon: Wind, color: "teal" },
  { id: 2, title: "Grounding (5‑4‑3‑2‑1)", desc: "Anchor to the present using your senses.", category: "Exercises", minutes: 2, tags: ["anxiety", "presence"], icon: Anchor, color: "cyan" },
  { id: 3, title: "Progressive Muscle Relaxation", desc: "Release tension from head to toe, gently.", category: "Exercises", minutes: 5, tags: ["tension", "body"], icon: Zap, color: "amber" },
  { id: 4, title: "Body Scan (mini)", desc: "Notice and soften areas of tightness.", category: "Exercises", minutes: 3, tags: ["mind-body"], icon: Ear, color: "violet" },

  // Journaling
  { id: 5, title: "Journaling Prompts", desc: "Gentle prompts to help process feelings.", category: "Journaling", minutes: 5, tags: ["reflect"], icon: NotebookPen, color: "indigo" },
  { id: 6, title: "Cognitive Reframe", desc: "Question and reshape a sticky thought.", category: "Journaling", minutes: 4, tags: ["rethink"], icon: Brain, color: "pink" },
  { id: 7, title: "Gratitude Note", desc: "Name one thing you’re thankful for and why.", category: "Journaling", minutes: 2, tags: ["gratitude"], icon: Heart, color: "pink" },

  // Mindfulness
  { id: 8, title: "Mindful Minute", desc: "Breathe in, breathe out—just notice.", category: "Mindfulness", minutes: 1, tags: ["mindful"], icon: Sun, color: "teal" },
  { id: 9, title: "Loving‑Kindness", desc: "A brief kindness practice for yourself or others.", category: "Mindfulness", minutes: 3, tags: ["warmth"], icon: Sparkles, color: "violet" },

  // Sleep
  { id: 10, title: "Wind‑down Routine", desc: "A short sequence to ease into rest.", category: "Sleep", minutes: 5, tags: ["sleep"], icon: Moon, color: "indigo" },
  { id: 11, title: "Sleep Hygiene Basics", desc: "Small habits that can improve sleep quality.", category: "Sleep", minutes: 3, tags: ["sleep"], icon: Bed, color: "cyan" },

  // SOS
  { id: 12, title: "Panic Soothers", desc: "Quick tips for spikes of panic or overwhelm.", category: "SOS", minutes: 2, tags: ["anxiety"], icon: Smile, color: "amber" },

  // Media — Audio and Video (more of these)
  {
    id: 13,
    title: "Calming Piano",
    desc: "Soft background music to settle the mind.",
    category: "Mindfulness",
    minutes: 3,
    tags: ["music", "soothe"],
    icon: Music2,
    color: "indigo",
    kind: "audio",
    href: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 14,
    title: "5‑minute Guided Breathing",
    desc: "Follow along and breathe with guidance.",
    category: "Mindfulness",
    minutes: 5,
    tags: ["video", "breathing"],
    icon: Youtube,
    color: "pink",
    kind: "video",
    href: "https://www.youtube.com/watch?v=inpok4MKVLM",
  },
  {
    id: 16,
    title: "Lo‑fi Beats to Focus",
    desc: "Gentle beats to help you stay present.",
    category: "Mindfulness",
    minutes: 10,
    tags: ["lofi", "focus", "music"],
    icon: Youtube,
    color: "violet",
    kind: "video",
    href: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
  },
  {
    id: 17,
    title: "Rain Sounds for Relaxing",
    desc: "Soft rain ambience for calm or sleep.",
    category: "Sleep",
    minutes: 10,
    tags: ["rain", "sleep", "ambience"],
    icon: Youtube,
    color: "indigo",
    kind: "video",
    href: "https://www.youtube.com/watch?v=1ZYbU82GVz4",
  },
  {
    id: 18,
    title: "Ocean Waves",
    desc: "Slow, steady waves to unwind.",
    category: "Sleep",
    minutes: 10,
    tags: ["ocean", "sleep", "nature"],
    icon: Youtube,
    color: "cyan",
    kind: "video",
    href: "https://www.youtube.com/watch?v=9uIk_91GQYI",
  },
  {
    id: 19,
    title: "Soft Guitar",
    desc: "Light acoustic guitar to ease the mind.",
    category: "Mindfulness",
    minutes: 4,
    tags: ["music", "acoustic"],
    icon: Music2,
    color: "amber",
    kind: "audio",
    href: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 20,
    title: "Ambient Loops",
    desc: "Warm pads and gentle tones.",
    category: "Mindfulness",
    minutes: 6,
    tags: ["ambient", "music"],
    icon: Music2,
    color: "teal",
    kind: "audio",
    href: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
  {
    id: 21,
    title: "Morning Piano",
    desc: "Light piano to begin the day softly.",
    category: "Mindfulness",
    minutes: 3,
    tags: ["piano", "morning", "music"],
    icon: Music2,
    color: "pink",
    kind: "audio",
    href: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    id: 22,
    title: "Deep Sleep Tones",
    desc: "Low, soothing tones for deep rest.",
    category: "Sleep",
    minutes: 8,
    tags: ["sleep", "music"],
    icon: Music2,
    color: "violet",
    kind: "audio",
    href: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
  },

  // Keep a single doc (very few docs as requested)
  {
    id: 15,
    title: "Stress Basics (PDF)",
    desc: "A short overview and tips for managing stress.",
    category: "SOS",
    minutes: 3,
    tags: ["pdf", "education"],
    icon: FileText,
    color: "violet",
    kind: "doc",
    href: "https://www.nimh.nih.gov/sites/default/files/documents/health/publications/so-stressed-out-fact-sheet/22-mh-8146-so-stressed-out.pdf",
  },
];

export default function Resources() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      const matchesCat = category === "All" || r.category === category;
      const matchesQ =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesQ;
    });
  }, [query, category]);

  const featuredMedia = RESOURCES.filter(
    (r) => r.kind === "video" || r.kind === "audio"
  ).slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Hero band */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-200/50 via-indigo-200/50 to-pink-200/50" />
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-2xl" />
        <div className="absolute -right-12 bottom-0 h-40 w-40 rounded-full bg-accent/30 blur-2xl" />
        <div className="px-6 py-10 md:px-10 md:py-12">
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-muted-foreground mt-1">
            Short, gentle practices you can use anytime.
          </p>

          {/* Quick actions */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link to="/chat">Ask Sathi for a prompt</Link>
            </Button>
            <Button asChild>
              <Link to="/chat">Guide me through breathing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search + categories */}
      <section className="space-y-4">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search music, videos, or topics…"
            aria-label="Search resources"
            className="w-full h-10 rounded-md border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
        </div>

        <CategoryChips items={CATEGORIES} active={category} onPick={setCategory} />
      </section>

      {/* Featured row (show media first) */}
      <section className="grid md:grid-cols-3 gap-4">
        {featuredMedia.map((r) => (
          <ResourceCard key={`feat-${r.id}`} {...r} />
        ))}
      </section>

      {/* All resources */}
      <section className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Showing {filtered.length} of {RESOURCES.length}
        </div>

        {filtered.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="font-semibold">No resources found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try another keyword or category.
            </p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {filtered.map((r) => (
              <ResourceCard key={r.id} {...r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}