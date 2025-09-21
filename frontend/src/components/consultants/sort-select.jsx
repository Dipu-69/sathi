import React from "react";

export default function SortSelect({ value, onChange }) {
    return (
        <select
            aria-label="Sort consultants"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
        >
            <option value="rating-desc">Top rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
        </select>
    );
}