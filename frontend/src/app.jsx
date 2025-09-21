import React from "react";

import { Outlet } from "react-router-dom";
import AppShell from "./components/layout/app-shell";
import BackendConnector from "./components/BackendConnector";
import BackendTest from "./components/BackendTest";

export default function App() {
  return (
    <AppShell>
      <Outlet />
        <BackendConnector />
        <BackendTest /> 
    </AppShell>
  );
}