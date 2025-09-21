import React, { useState } from "react";
import { Button } from "../ui/button";

export default function ContactForm() {
  const [status, setStatus] = useState("idle");
  const submit = (e) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("success"), 800);
  };
  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input id="name" className="w-full rounded-md border p-3" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input id="email" type="email" className="w-full rounded-md border p-3" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="topic">Topic</label>
        <input id="topic" className="w-full rounded-md border p-3" placeholder="Feedback, support, etc." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
        <textarea id="message" className="w-full rounded-md border p-3" rows={5} required />
      </div>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
      {status === "success" && <p className="text-sm text-primary mt-2">Thanks! We’ll be in touch soon.</p>}
    </form>
  );
}