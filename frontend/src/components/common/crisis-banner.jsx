import React from "react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

export default function CrisisBanner() {
  return (
    <div className="hidden md:block border-b bg-muted/60">
      <div className="container py-2">
        <Alert className="p-2 bg-transparent border-none">
          <AlertTitle className="sr-only">Crisis resources</AlertTitle>
          <AlertDescription className="text-sm">
            If you’re in immediate danger, call your local emergency number.
            In India: 112. AASRA Helpline: 91-9820466726.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}