import React from "react";

const chips = [
  "A quick grounding exercise",
  "Help reframing a thought",
  "Gratitude prompt",
  "Plan a tiny next step",
];

export default function Suggestions({ onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c}
          onClick={() => onPick(c)}
          className="text-sm px-3 py-1 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground transition"
        >
          {c}
        </button>
      ))}
    </div>
  );
}