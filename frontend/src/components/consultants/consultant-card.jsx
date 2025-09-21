import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle2, MapPin, Video, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";

function Avatar({ name }) {
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/30 text-foreground font-semibold">
      {initial}
    </div>
  );
}

export default function ConsultantCard({
  id,
  name,
  tags = [],
  languages = [],
  rating,
  price,
  mode,
  location,
  verified,
  available,
  favorite,
  onToggleFavorite,
  onBook, // pass from parent to open BookIntro
}) {
  const priceINR = typeof price === "number" ? price.toLocaleString("en-IN") : "-";
  const displayMode =
    mode === "in-person" ? "In‑Person" : mode === "online" ? "Online" : mode === "hybrid" ? "Hybrid" : mode;

  return (
    <Card className="h-full p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <Avatar name={name} />
            {verified && (
              <span
                className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-emerald-600 ring-1 ring-emerald-200"
                title="Verified"
              >
                <CheckCircle2 className="h-4 w-4" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="min-w-0">
              <h3 className="font-semibold leading-tight break-words" title={name}>
                {name}
              </h3>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1" aria-label={`Rating ${rating ?? "NA"}`}>
                <Star className="h-4 w-4 text-amber-500 fill-amber-400/60" />
                {typeof rating === "number" ? rating.toFixed(1) : "—"}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" /> {location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Video className="h-4 w-4 text-primary" /> {displayMode}
              </span>
            </div>
          </div>

          {/* Favorite */}
          <button
            type="button"
            aria-label={favorite ? "Remove from saved" : "Save to favorites"}
            aria-pressed={!!favorite}
            onClick={onToggleFavorite}
            className={`rounded-full border p-1.5 transition hover:bg-muted ${favorite ? "bg-primary/10 border-primary/30" : ""}`}
          >
            <Heart className={`h-4 w-4 ${favorite ? "text-primary fill-primary/70" : "text-foreground"}`} />
          </button>
        </div>

        {/* Tags */}
        {tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge key={t} className="bg-muted text-muted-foreground">
                {t}
              </Badge>
            ))}
          </div>
        )}

        {/* Languages */}
        <p className="mt-2 text-sm text-muted-foreground">
          Languages: {languages?.length ? languages.join(", ") : "—"}
        </p>

        {/* Push footer to bottom */}
        <div className="mt-auto" />

        {/* Footer (price + buttons) */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="text-sm grow">
            <span className="font-semibold">₹{priceINR}</span>
            <span className="text-muted-foreground"> / session</span>
            {available && (
              <Badge variant="green" className="ml-2">
                Available
              </Badge>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto shrink-0">
            <Button asChild variant="secondary" className="flex-1 sm:flex-none">
              <Link to={`/consultants/${id}`}>View Profile</Link>
            </Button>
            <Button variant="default" className="flex-1 sm:flex-none" onClick={onBook}>
              Book intro
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}