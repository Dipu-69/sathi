import React from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Heart, ShieldCheck, Sparkles, Users } from "lucide-react";

const TEAM = [
  { name: "Anju", role: "Sleeper" },
  { name: "Nidhi", role: "AI Developer" },
  { name: "Amrita", role: "Logo Maker" },
  { name: "Himesh", role: "Berozgar" },
  { name: "Aneesha", role: "Developer" },
];

function Avatar({ name }) {
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/30 text-foreground font-semibold ring-1 ring-black/5">
      {initial}
    </div>
  );
}

export default function About() {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl ring-1 ring-black/5">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-100/60 via-indigo-100/60 to-pink-100/60" />
        <div className="px-6 py-10 md:px-10 md:py-14">
          <h1 className="text-3xl font-bold">About Sathi</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Sathi is a gentle companion for mental well‑being—offering practical tools,
            privacy‑first design, and access to trusted consultants. We focus on accessibility,
            clarity, and small steps that make a difference.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-rose-500" />
            <div>
              <h3 className="font-semibold">Care, not clutter</h3>
              <p className="text-sm text-muted-foreground">
                Simple, gentle experiences that reduce friction.
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="font-semibold">Privacy first</h3>
              <p className="text-sm text-muted-foreground">
                Your data stays yours. Clear controls, no surprises.
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <div>
              <h3 className="font-semibold">Small, steady steps</h3>
              <p className="text-sm text-muted-foreground">
                Real progress through tiny, repeatable actions.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Team */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Our Team</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <Card key={m.name} className="p-5">
              <div className="flex items-center gap-3">
                <Avatar name={m.name} />
                <div className="min-w-0">
                  <h3 className="font-semibold leading-tight break-words">{m.name}</h3>
                  <Badge variant="secondary" className="mt-1 capitalize">
                    {m.role}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Closing note */}
      <section className="rounded-2xl border p-6">
        <h3 className="font-semibold">Our promise</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We’re building Sathi with care and honesty. If you have feedback or want to collaborate,
          we’d love to hear from you.
        </p>
      </section>
    </div>
  );
}