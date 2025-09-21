import React from "react";
import Hero from "../components/common/hero";
import FeatureGrid from "../components/common/feature-grid";
import MoodStrip from "../components/home/mood-strip";
import ToolsMarquee from "../components/home/tools-marquee";
import HowItWorks from "../components/home/how-it-works";
import Testimonials from "../components/home/testimonials";
import FAQ from "../components/home/faq";
import CtaBanner from "../components/home/cta-banner";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import VoiceChat from "../components/home/voice-chat";

export default function Home() {
    return (
        <div className="space-y-16">
            {/* Calm hero you already had */}
            <Hero
                title="A calmer mind, one small step at a time."
                subtitle="Sathi supports you with gentle AI guidance, resources, and access to trusted consultants."
                ctaPrimary={{ to: "/chat", label: "Talk to Sathi" }}
                ctaSecondary={{ to: "/consultants", label: "Find a Consultant" }}
            />

            {/* New engaging, colorful sections */}
            <MoodStrip />
            <VoiceChat />
            <ToolsMarquee />
            <HowItWorks />

            <section>
                <FeatureGrid />
            </section>

            <Testimonials />
            <FAQ />
            <CtaBanner />

            {/* Privacy note stays */}
            <Card className="p-8 shadow-md bg-card">
                <h2 className="text-2xl font-bold mb-2">Your privacy matters</h2>
                <p className="text-muted-foreground">
                    We only store what’s needed to help you. You control your data.
                </p>
                <div className="mt-4">
                    <Button asChild variant="secondary"><Link to="/privacy">Learn more</Link></Button>
                </div>
            </Card>
        </div>
    );
}