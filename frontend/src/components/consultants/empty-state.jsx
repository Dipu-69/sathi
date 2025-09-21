import React from "react";
import { Button } from "../ui/button";

export default function EmptyState({ onReset }) {
    return (
        <div className="rounded-lg border bg-card p-8 text-center">
            <h3 className="text-lg font-semibold">No consultants match your filters</h3>
            <p className="text-sm text-muted-foreground mt-1">
                Try removing a filter or widening your price range.
            </p>
            <Button className="mt-4" variant="secondary" onClick={onReset}>Reset filters</Button>
        </div>
    );
}