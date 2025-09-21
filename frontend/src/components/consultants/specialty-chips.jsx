import React from "react";

export default function SpecialtyChips({ items, active, onPick }) {
    return (
        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-2">
                <button
                    onClick={() => onPick("Any")}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs border ${active === "Any" ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"}`}
                >
                    All
                </button>
                {items.map((s) => (
                    <button
                        key={s}
                        onClick={() => onPick(s)}
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs border ${active === s ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"}`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}