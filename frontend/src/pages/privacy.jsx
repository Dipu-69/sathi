import React from "react";

export default function Privacy() {
  return (
    <div className="prose max-w-3xl">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground">
        We aim to collect the minimum data required to provide helpful features. You control your data.
      </p>
      <ul className="list-disc pl-6 text-muted-foreground">
        <li>No PII stored without your consent</li>
        <li>Anonymous analytics with opt-in</li>
        <li>Secure transport (HTTPS), strong content security policies</li>
      </ul>
      <p className="text-muted-foreground">This page is a placeholder. Add your finalized policy here.</p>
    </div>
  );
}