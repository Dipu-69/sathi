import React from "react";
import { Search } from "lucide-react";

export default function ConsultantSearch({ value, onChange }) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, specialty, language, or location…"
        className="w-full pl-9 pr-3 h-10 rounded-md border bg-background focus-visible:ring-2 focus-visible:ring-primary/50 outline-none"
        aria-label="Search consultants"
      />
    </div>
  );
}