import React from "react";
import SkipLink from "./skip-link";
import CrisisBanner from "../common/crisis-banner";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import SupportChatbot from "../support/support-chatbot";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SkipLink />
      <CrisisBanner />
      <SiteHeader />
      <main id="main" className="flex-1 container py-10">
        {children}
      </main>
      <SiteFooter />
      <SupportChatbot />
    </div>
  );
}
