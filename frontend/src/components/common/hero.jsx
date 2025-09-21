import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import heroDefault from "../../assets/hero-illustration.png"; // place your image here

export default function Hero({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  image = heroDefault,
  imageAlt = "Illustration of calm support and conversation",
}) {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      {/* Left: text + CTAs */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">{subtitle}</p>
        <div className="flex gap-3">
          <Button asChild>
            <Link to={ctaPrimary.to}>{ctaPrimary.label}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to={ctaSecondary.to}>{ctaSecondary.label}</Link>
          </Button>
        </div>
      </div>

      {/* Right: integrated illustration (no card) */}
      <div className="relative hidden md:block">
        {/* Soft brand blobs behind the image */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-6 bottom-0 h-44 w-44 rounded-full bg-accent/30 blur-3xl" />

        {/* Illustration wrapper */}
        <figure className="relative mx-auto max-w-[560px] rounded-[28px] overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            loading="eager"
            decoding="async"
            className="block w-full h-72 md:h-80 lg:h-96 object-contain select-none"
          />
          {/* Gentle overlay to blend with page */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/20 via-transparent to-transparent" />
        </figure>

        {/* Small floating label to feel native */}
        <div className="absolute left-3 top-3 rounded-full border bg-background/80 backdrop-blur px-3 py-1 text-xs text-muted-foreground shadow-sm">
          Gentle, private, supportive
        </div>
      </div>
    </section>
  );
}