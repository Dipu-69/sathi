import React from "react";
import { X } from "lucide-react";

export default function ActiveFilters({ filters, onRemove, onClear }) {
    const chips = [];

    if (filters.specialty !== "Any") chips.push({ k: "specialty", v: filters.specialty });
    if (filters.language !== "Any") chips.push({ k: "language", v: filters.language });
    if (filters.mode !== "any") chips.push({ k: "mode", v: filters.mode });
    if (filters.available) chips.push({ k: "available", v: "Available" });
    if (filters.minRating > 0) chips.push({ k: "minRating", v: `Rating ${filters.minRating}+` });
    if (filters.maxPrice < 5000) chips.push({ k: "maxPrice", v: `≤ ₹${filters.maxPrice}` });

    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {chips.map((c) => (
                <button
                    key={c.k}
                    onClick={() => onRemove(c.k)}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                    {c.v} <X className="h-3 w-3" />
                </button>
            ))}
            <button
                onClick={onClear}
                className="text-xs text-primary underline-offset-2 hover:underline"
            >
                Clear all
            </button>
        </div>
    );
}