import React from "react";
import ChatWindow from "../components/chat/chat-window";

export default function Chat() {
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Talk to Sathi</h1>
        <p className="text-muted-foreground">
          This is supportive guidance, not a substitute for professional or emergency care.
        </p>
      </header>
      <ChatWindow />
    </div>
  );
}