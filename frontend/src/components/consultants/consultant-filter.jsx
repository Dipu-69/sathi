import React from "react";
import { Button } from "../ui/button";

export default function ConsultantFilter({ filters, setFilters, onClear, compact = false }) {
  const update = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  return (
    <aside className={`rounded-lg border p-4 bg-card shadow-sm ${compact ? "" : ""}`}>
      {!compact && <h3 className="font-semibold mb-3">Filters</h3>}

      <div className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium" htmlFor="specialty">Specialty</label>
          <select
            id="specialty"
            value={filters.specialty}
            onChange={(e) => update("specialty", e.target.value)}
            className="w-full rounded-md border bg-background p-2"
          >
            <option>Any</option>
            <option>Anxiety</option>
            <option>Stress</option>
            <option>Depression</option>
            <option>CBT</option>
            <option>Mindfulness</option>
            <option>Relationships</option>
            <option>Sleep</option>
            <option>ADHD</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="language">Language</label>
          <select
            id="language"
            value={filters.language}
            onChange={(e) => update("language", e.target.value)}
            className="w-full rounded-md border bg-background p-2"
          >
            <option>Any</option>
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
            <option>Malayalam</option>
            <option>Kannada</option>
            <option>Urdu</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Mode</label>
          <div className="flex flex-wrap gap-2">
            {["any", "online", "in-person", "hybrid"].map((m) => (
              <button
                key={m}
                onClick={() => update("mode", m)}
                className={`rounded-full px-3 py-1.5 text-xs border capitalize ${filters.mode === m
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                  }`}
                type="button"
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="available"
            type="checkbox"
            checked={filters.available}
            onChange={(e) => update("available", e.target.checked)}
            className="h-4 w-4 rounded border"
          />
          <label htmlFor="available">Available this week</label>
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="rating">Min rating: {filters.minRating.toFixed(1)}</label>
          <input
            id="rating"
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={filters.minRating}
            onChange={(e) => update("minRating", Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="price">Max price (₹): {filters.maxPrice}</label>
          <input
            id="price"
            type="range"
            min={500}
            max={5000}
            step={100}
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="pt-2 flex gap-2">
          <Button type="button" variant="outline" onClick={onClear} className="w-full">
            Clear all
          </Button>
        </div>
      </div>
    </aside>
  );
}
