import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { PlayCircle, FileText, ExternalLink, Music2, Video } from "lucide-react";

const colorMap = {
    teal: { grad: "from-teal-400/50 to-emerald-400/50", icon: "text-teal-600 bg-teal-100/80" },
    indigo: { grad: "from-indigo-400/50 to-sky-400/50", icon: "text-indigo-600 bg-indigo-100/80" },
    pink: { grad: "from-pink-400/50 to-rose-400/50", icon: "text-pink-600 bg-pink-100/80" },
    amber: { grad: "from-amber-400/50 to-orange-400/50", icon: "text-amber-700 bg-amber-100/80" },
    violet: { grad: "from-violet-400/50 to-fuchsia-400/50", icon: "text-violet-600 bg-violet-100/80" },
    cyan: { grad: "from-cyan-400/50 to-sky-400/50", icon: "text-cyan-700 bg-cyan-100/80" },
};

// Try to build a YouTube embed URL from common watch links
function getYouTubeEmbed(url) {
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtu.be")) {
            const id = u.pathname.replace("/", "");
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }
        if (u.hostname.includes("youtube.com")) {
            if (u.pathname.startsWith("/shorts/")) {
                const id = u.pathname.split("/")[2];
                return id ? `https://www.youtube.com/embed/${id}` : null;
            }
            const id = u.searchParams.get("v");
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }
    } catch {
        // ignore
    }
    return null;
}

export default function ResourceCard({
    icon: Icon,
    title,
    desc,
    tags = [],
    minutes,
    color = "teal",
    href = "#",
    kind, // "audio" | "video" | "doc" | "link"
}) {
    const theme = colorMap[color] || colorMap.teal;

    const cta =
        kind === "audio" ? "Listen" :
            kind === "video" ? "Watch" :
                kind === "doc" ? "Read" :
                    "Open";

    const CtaIcon =
        kind === "audio" ? Music2 :
            kind === "video" ? Video :
                kind === "doc" ? FileText :
                    ExternalLink;

    const youtubeEmbed = kind === "video" ? getYouTubeEmbed(href) : null;

    return (
        <div className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-2xl">
            <div className={cn("rounded-2xl p-[1px] bg-gradient-to-r", theme.grad)}>
                <Card className="rounded-2xl bg-background/90 backdrop-blur p-5 shadow-sm h-full">
                    <div className="flex items-start gap-3">
                        <div className={cn("rounded-xl p-2 ring-1 ring-black/5", theme.icon)}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold leading-snug">{title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{desc}</p>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {minutes ? <Badge variant="blue">{minutes} min</Badge> : null}
                        {kind ? <Badge className="bg-muted capitalize">{kind}</Badge> : null}
                        {tags.map((t) => (
                            <Badge key={t} className="bg-muted">{t}</Badge>
                        ))}
                    </div>

                    {/* Inline previews for media */}
                    {kind === "audio" && href && (
                        <audio
                            className="mt-3 w-full"
                            controls
                            preload="none"
                            src={href}
                        />
                    )}

                    {kind === "video" && youtubeEmbed && (
                        <div className="mt-3 aspect-video overflow-hidden rounded-xl ring-1 ring-black/5">
                            <iframe
                                className="h-full w-full"
                                src={youtubeEmbed}
                                title={title}
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    )}

                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary group-hover:underline"
                    >
                        <CtaIcon className="h-4 w-4" />
                        {cta}
                    </a>
                </Card>
            </div>
        </div>
    );
}