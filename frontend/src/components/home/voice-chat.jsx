import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Mic, MicOff, Play, Loader2, Send } from "lucide-react";

const SR = typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

function getSupportedMimeType() {
    const types = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
    ];
    for (const t of types) {
        if (MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) return t;
    }
    return "";
}

function levelFromAnalyser(analyser) {
    const buffer = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buffer);
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
        const v = (buffer[i] - 128) / 128;
        sum += v * v;
    }
    const rms = Math.sqrt(sum / buffer.length); // 0..~1
    return Math.min(1, rms * 2.5);
}

function Message({ role, text, audioUrl }) {
    const isUser = role === "user";
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
            >
                {audioUrl ? (
                    <audio className="w-full mb-2" controls src={audioUrl} preload="metadata" />
                ) : null}
                {text ? <div className="whitespace-pre-wrap">{text}</div> : null}
            </div>
        </div>
    );
}

export default function VoiceChat() {
    const [isRecording, setIsRecording] = useState(false);
    const [level, setLevel] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [audioUrl, setAudioUrl] = useState(null);
    const [aiThinking, setAiThinking] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hi! Tap the mic and tell me how you’re feeling. I’m listening.",
        },
    ]);

    // Refs for media
    const streamRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const mimeRef = useRef("");
    const acRef = useRef(null);
    const analyserRef = useRef(null);
    const rafRef = useRef(null);

    // Speech recognition (optional)
    const srRef = useRef(null);
    const interimRef = useRef("");

    const resetAll = () => {
        setIsRecording(false);
        setLevel(0);
        setTranscript("");
        setAudioUrl(null);
        stopEverything();
    };

    // Start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Audio context + analyser for live level
            const AC = window.AudioContext || window.webkitAudioContext;
            acRef.current = new AC();
            const source = acRef.current.createMediaStreamSource(stream);
            analyserRef.current = acRef.current.createAnalyser();
            analyserRef.current.fftSize = 512;
            source.connect(analyserRef.current);

            const loop = () => {
                if (!analyserRef.current) return;
                setLevel(levelFromAnalyser(analyserRef.current));
                rafRef.current = requestAnimationFrame(loop);
            };
            loop();

            // MediaRecorder
            mimeRef.current = getSupportedMimeType();
            const rec = new MediaRecorder(stream, mimeRef.current ? { mimeType: mimeRef.current } : undefined);
            chunksRef.current = [];
            rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
            rec.onstop = handleRecordingStop;
            rec.start();
            recorderRef.current = rec;

            // Optional: live speech recognition
            if (SR) {
                const sr = new SR();
                sr.lang = "en-IN"; // tweak as needed
                sr.interimResults = true;
                sr.continuous = true;
                sr.onresult = (e) => {
                    let finalText = "";
                    for (let i = e.resultIndex; i < e.results.length; i++) {
                        const res = e.results[i];
                        if (res.isFinal) finalText += res[0].transcript;
                        else interimRef.current = res[0].transcript;
                    }
                    // mix interim + final so UI feels live
                    setTranscript((prev) => (finalText ? (prev + " " + finalText).trim() : (prev || "").trim()));
                };
                sr.onerror = () => { };
                srRef.current = sr;
                try {
                    sr.start();
                } catch { }
            }

            setTranscript("");
            setAudioUrl(null);
            setIsRecording(true);
        } catch (err) {
            console.error("Mic error:", err);
            alert("Couldn’t access the microphone. Please check permissions.");
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (!recorderRef.current) return;
        recorderRef.current.stop();
        setIsRecording(false);
        // stop speech recognition
        if (srRef.current) {
            try {
                srRef.current.stop();
            } catch { }
        }
    };

    function stopEverything() {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
            try { recorderRef.current.stop(); } catch { }
        }
        recorderRef.current = null;

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;

        if (acRef.current) {
            try { acRef.current.close(); } catch { }
            acRef.current = null;
            analyserRef.current = null;
        }
        if (srRef.current) {
            try { srRef.current.stop(); } catch { }
            srRef.current = null;
        }
    }

    // When MediaRecorder stops
    const handleRecordingStop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeRef.current || "audio/webm" });
        chunksRef.current = [];
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const finalTranscript = (transcript + " " + (interimRef.current || "")).trim();
        interimRef.current = "";

        // Push user message to chat
        setMessages((m) => [
            ...m,
            { role: "user", text: finalTranscript || "Voice note", audioUrl: url },
        ]);

        // Call AI stub, you’ll replace with Gemini
        setAiThinking(true);
        try {
            const reply = await sendToAI({ transcript: finalTranscript, audioBlob: blob });
            setMessages((m) => [...m, { role: "assistant", text: reply }]);
        } catch (e) {
            setMessages((m) => [
                ...m,
                {
                    role: "assistant",
                    text: "Thanks for sharing. I couldn’t reach the AI right now, but I’m here to listen.",
                },
            ]);
        } finally {
            setAiThinking(false);
        }
    };

    // AI stub — replace with Gemini later
    async function sendToAI({ transcript, audioBlob }) {
        // TODO: Replace this with your Gemini call
        // const reply = await geminiRespond({ transcript, audio: audioBlob });
        await new Promise((r) => setTimeout(r, 900));
        const tone = classifyMood(transcript);
        const tips = {
            calm: "I’m glad you feel settled. Want to build on that with a 1‑minute gratitude note?",
            stressed: "That sounds heavy. Try box breathing: inhale 4, hold 4, exhale 4, hold 4.",
            anxious: "Let’s ground for a moment: name 5 things you can see, 4 you can touch, 3 you can hear.",
            sad: "I hear the weight in your words. If it helps, name what feels hardest right now—just a sentence.",
            angry: "Strong feelings are valid. A brief pause and a plan for one small next step can help.",
            grateful: "That’s lovely. Savor it—why does it matter to you today?",
            tired: "Rest matters. A 2‑minute body scan could help unwind a bit.",
            default: "Thank you for sharing. I’m here with you—would you like a quick grounding or breathing exercise?",
        };
        return tips[tone] || tips.default;
    }

    function classifyMood(t = "") {
        const s = (t || "").toLowerCase();
        if (/(calm|okay|fine|peace|relax)/.test(s)) return "calm";
        if (/(stress|overwhelm|pressure|busy|loaded)/.test(s)) return "stressed";
        if (/(anx|worry|nervous|uneasy|panic)/.test(s)) return "anxious";
        if (/(sad|down|low|blue|upset)/.test(s)) return "sad";
        if (/(angry|mad|frustrat|irritat|rage)/.test(s)) return "angry";
        if (/(grateful|thankful|appreciat|blessed)/.test(s)) return "grateful";
        if (/(tired|exhaust|sleepy|drained|fatigue)/.test(s)) return "tired";
        return "default";
    }

    useEffect(() => () => stopEverything(), []);

    const meterWidth = `${Math.round(level * 100)}%`;
    const recSupported = typeof navigator !== "undefined" && navigator.mediaDevices && window.MediaRecorder;

    return (
        <section>
            <Card className="p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold">Share how you feel (voice beta)</h3>
                        <p className="text-sm text-muted-foreground">
                            Tap the mic, speak freely. I’ll listen and reflect back gently.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {!isRecording ? (
                            <Button onClick={startRecording} disabled={!recSupported}>
                                <Mic className="h-4 w-4 mr-2" /> Start
                            </Button>
                        ) : (
                            <Button onClick={stopRecording} variant="destructive">
                                <MicOff className="h-4 w-4 mr-2" /> Stop
                            </Button>
                        )}
                    </div>
                </div>

                {/* Meter + status */}
                <div className="mt-4">
                    <div className="h-2 w-full rounded bg-muted overflow-hidden">
                        <div
                            className={`h-full bg-primary transition-[width] duration-75 ${isRecording ? "animate-pulse" : ""}`}
                            style={{ width: isRecording ? meterWidth : "0%" }}
                        />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                        {isRecording ? "Listening…" : "Mic is idle"}
                        {SR ? (isRecording ? " • Transcribing" : "") : " • (No live transcription in this browser)"}
                    </div>
                </div>

                {/* Transcript preview + playback */}
                {(transcript || audioUrl) && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr,auto]">
                        <div className="rounded-xl border p-3">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Transcript</div>
                            <div className="text-sm min-h-[20px] whitespace-pre-wrap">
                                {transcript || "…(will appear after you speak)"}
                            </div>
                        </div>
                        {audioUrl && (
                            <div className="rounded-xl border p-3 self-start">
                                <div className="text-xs font-medium text-muted-foreground mb-1">Your note</div>
                                <audio controls src={audioUrl} className="w-64" />
                            </div>
                        )}
                    </div>
                )}

                {/* Chat history */}
                <div className="mt-5 space-y-2">
                    {messages.map((m, i) => (
                        <Message key={i} role={m.role} text={m.text} audioUrl={m.audioUrl} />
                    ))}
                    {aiThinking && (
                        <div className="flex justify-start">
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-sm">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sathi is thinking…
                            </div>
                        </div>
                    )}
                </div>

                {/* Fallback action */}
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Play className="h-3.5 w-3.5" />
                    You can also type in chat or try a quick tool from Resources.
                </div>
            </Card>
        </section>
    );
}