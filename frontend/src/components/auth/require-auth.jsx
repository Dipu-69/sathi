import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("sathi-user") || "null");
    } catch { }
    const location = useLocation();
    if (!user) {
        const next = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?next=${next}`} replace />;
    }
    return children;
}