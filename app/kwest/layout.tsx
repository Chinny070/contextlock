"use client";

import { ReactNode } from "react";
import { RequireAuth } from "@/lib/kwest/auth";
import KwestNavbar from "@/components/layout/KwestNavbar";

export default function KwestLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-slate-950 text-white">
        <KwestNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
