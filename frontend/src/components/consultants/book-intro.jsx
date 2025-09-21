// src/components/consultants/book-intro.jsx
import React, { useMemo, useState } from "react";
import { Sheet, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, Clock, Video, MapPin, CheckCircle2 } from "lucide-react";

function Avatar({ name }) {
    const initial = name?.charAt(0)?.toUpperCase() ?? "?";
    return (
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/30 text-foreground font-semibold ring-1 ring-black/5">
            {initial}
        </div>
    );
}

const TIME_SLOTS = ["10:00", "11:30", "14:00", "16:00", "19:00", "21:00"];

function nextDays(n = 7) {
    const out = [];
    const fmtW = new Intl.DateTimeFormat("en-IN", { weekday: "short" });
    for (let i = 0; i < n; i++) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + i);
        out.push({
            key: d.toISOString(),
            date: d,
            label: `${fmtW.format(d)} ${d.getDate()}`,
        });
    }
    return out;
}

function formatINR(v) {
    try {
        return v.toLocaleString("en-IN");
    } catch {
        return String(v);
    }
}

export default function BookIntro({ open, onClose, consultant, onBooked }) {
    const c = consultant;
    const days = useMemo(() => nextDays(7), []);
    const [dayKey, setDayKey] = useState(days[0]?.key);
    const [time, setTime] = useState("");
    const [mode, setMode] = useState(() => {
        if (!c) return "online";
        return c.mode === "hybrid" ? "online" : c.mode;
    });

    if (!c) return null;

    const selectedDay = days.find((d) => d.key === dayKey)?.date;
    const introMinutes = 20;
    const introFee = Math.max(99, Math.min(599, Math.round(c.price * 0.25))); // 25% of session, capped

    const canConfirm = !!time && !!dayKey;

    const handleConfirm = () => {
        if (!canConfirm) return;
        const booking = {
            id: `${c.id}-${Date.now()}`,
            consultantId: c.id,
            consultantName: c.name,
            mode,
            dateISO: selectedDay.toISOString(),
            time,
            introMinutes,
            fee: introFee,
            createdAt: new Date().toISOString(),
        };
        try {
            const prev = JSON.parse(localStorage.getItem("sathi-bookings") || "[]");
            prev.push(booking);
            localStorage.setItem("sathi-bookings", JSON.stringify(prev));
        } catch { }
        onBooked?.(booking);
        onClose?.();
        setTime("");
    };

    const showModePicker = c.mode === "hybrid";
    const displayMode =
        c.mode === "in-person" ? "In‑Person" : c.mode === "online" ? "Online" : mode === "online" ? "Online" : "In‑Person";

    return (
        <Sheet open={!!open} onOpenChange={(v) => !v && onClose?.()}>
            <SheetContent side="right" className="w-[380px] sm:w-[420px]" title="Book intro">
                <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                        <Avatar name={c.name} />
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                                <h3 className="font-semibold leading-tight break-words">{c.name}</h3>
                                {c.verified && (
                                    <Badge variant="primary" className="gap-1 shrink-0">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                                    </Badge>
                                )}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    {c.location}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Video className="h-4 w-4 text-primary" />
                                    {displayMode}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing + duration */}
                    <div className="rounded-lg border p-3">
                        <div className="text-sm">
                            <span className="font-medium">Intro call:</span> {introMinutes} min • ₹{formatINR(introFee)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Full session: ₹{formatINR(c.price)} • mode: {c.mode.charAt(0).toUpperCase() + c.mode.slice(1)}
                        </div>
                    </div>

                    {/* Mode (only if hybrid) */}
                    {showModePicker && (
                        <div>
                            <div className="text-sm font-medium mb-2">Mode</div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={mode === "online" ? "default" : "outline"}
                                    onClick={() => setMode("online")}
                                >
                                    Online
                                </Button>
                                <Button
                                    type="button"
                                    variant={mode === "in-person" ? "default" : "outline"}
                                    onClick={() => setMode("in-person")}
                                >
                                    In‑Person
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Date */}
                    <div>
                        <div className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Choose a day
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {days.map((d) => (
                                <button
                                    key={d.key}
                                    onClick={() => setDayKey(d.key)}
                                    className={`shrink-0 rounded-lg border px-3 py-2 text-sm ${d.key === dayKey ? "border-primary bg-primary/10" : "hover:bg-muted"
                                        }`}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time */}
                    <div>
                        <div className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Pick a time
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {TIME_SLOTS.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTime(t)}
                                    className={`rounded-lg border px-3 py-2 text-sm ${time === t ? "border-primary bg-primary/10" : "hover:bg-muted"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                            All times shown in your local time.
                        </div>
                    </div>

                    {/* Confirm */}
                    <div className="pt-2">
                        <Button className="w-full" disabled={!canConfirm} onClick={handleConfirm}>
                            Confirm intro • ₹{formatINR(introFee)}
                        </Button>
                        <Button className="w-full mt-2" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}