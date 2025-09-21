import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function CtaBanner() {
    return (
        <section className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-200/60 via-indigo-200/60 to-pink-200/60" />
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-2xl" />
            <div className="absolute -right-12 bottom-0 h-40 w-40 rounded-full bg-accent/30 blur-2xl" />
            <div className="px-6 py-10 md:px-10 md:py-12">
                <div className="grid gap-6 md:grid-cols-2 items-center">
                    <div>
                        <h3 className="text-2xl font-extrabold tracking-tight">Ready to take a small step?</h3>
                        <p className="text-muted-foreground mt-1">
                            Talk to Sathi or explore consultants who fit your needs.
                        </p>
                    </div>
                    <div className="flex gap-3 md:justify-end">
                        <Button asChild variant="secondary"><Link to="/consultants">Find Consultants</Link></Button>
                        <Button asChild><Link to="/chat">Talk to Sathi</Link></Button>
                    </div>
                </div>
            </div>
        </section>
    );
}