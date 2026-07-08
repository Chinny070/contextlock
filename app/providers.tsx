"use client";

import { ReactNode } from "react";
import { WalletProvider } from "@/lib/wallet/context";
import { AuthProvider } from "@/lib/kwest/auth";
import AppShell from "@/components/layout/AppShell";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <AuthProvider>
        <AppShell>{children}</AppShell>
        <Toaster theme="dark" position="bottom-right" />
      </AuthProvider>
    </WalletProvider>
  );
}
