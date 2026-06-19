"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import { Toaster } from "sonner";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}
