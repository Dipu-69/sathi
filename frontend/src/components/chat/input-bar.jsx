import React, { useState } from "react";
import { Button } from "../ui/button";

export default function InputBar({ onSend }) {
  const [text, setText] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };
  return (
    <form onSubmit={submit} className="flex items-end gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Message"
        rows={1}
        placeholder="Type a message..."
        className="flex-1 resize-none rounded-md border bg-background p-3 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      />
      <Button type="submit">Send</Button>
    </form>
  );
}