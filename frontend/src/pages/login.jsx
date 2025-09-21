import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import loginImg from "../assets/auth-login.avif"; // <- fixed import

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const next = params.get("next") || "/chat";

    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("sathi-user") || "null");
            if (user) navigate(next, { replace: true });
        } catch { }
    }, [navigate, next]);

    const onSubmit = (e) => {
        e.preventDefault();
        setErr("");
        const form = new FormData(e.currentTarget);
        const email = String(form.get("email") || "").trim();
        const password = String(form.get("password") || "");

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email.");
        if (password.length < 6) return setErr("Password must be at least 6 characters.");

        setLoading(true);
        setTimeout(() => {
            const user = { name: email.split("@")[0], email, token: "demo-token" };
            localStorage.setItem("sathi-user", JSON.stringify(user));
            setLoading(false);
            navigate(next, { replace: true });
        }, 800);
    };

    return (
        <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-6 py-10 md:grid-cols-2">
            {/* Left: form */}
            <div className="mx-auto w-full max-w-md">
                <button
                    onClick={() => navigate("/")}
                    className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to home
                </button>

                <div className="rounded-2xl border bg-background/90 p-6 shadow-sm">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Log in to continue.</p>

                    <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
                        <div>
                            <label className="text-sm font-medium" htmlFor="email">Email</label>
                            <div className="relative mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="h-10 w-full rounded-md border bg-background px-9 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                />
                                <Mail className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium" htmlFor="password">Password</label>
                            <div className="relative mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPass ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-10 w-full rounded-md border bg-background px-9 pr-10 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                />
                                <Lock className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((s) => !s)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    aria-label={showPass ? "Hide password" : "Show password"}
                                >
                                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {err ? <p className="text-sm text-rose-600">{err}</p> : null}

                        <Button type="submit" disabled={loading} className="w-full">
                            <LogIn className="mr-2 h-4 w-4" />
                            {loading ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Don’t have an account?{" "}
                        <Link className="text-primary hover:underline" to={`/signup?next=${encodeURIComponent(next)}`}>
                            Create one
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right: image */}
            <div className="relative hidden md:block">
                <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-primary/15 via-accent/10 to-transparent blur-2xl" />
                <img
                    src={loginImg}
                    alt="Illustration of calm and supportive chat"
                    className="h-[520px] w-full rounded-3xl object-cover shadow-xl ring-1 ring-black/5"
                />
            </div>
        </div>
    );
}