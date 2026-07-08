"use client";

import { ReactNode } from "react";
import { WalletProvider } from "@/lib/wallet/context";
import AppShell from "@/components/layout/AppShell";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <AppShell>{children}</AppShell>
      <Toaster theme="dark" position="bottom-right" />
    </WalletProvider>
  );
}
