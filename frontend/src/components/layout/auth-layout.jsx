import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-[radial-gradient(45rem_30rem_at_25%_10%,hsl(var(--primary)/0.08),transparent),radial-gradient(35rem_30rem_at_80%_80%,hsl(var(--accent)/0.08),transparent)]">
            <Outlet />
        </div>
    );
}