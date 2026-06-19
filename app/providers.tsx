"use client";

import { ReactNode } from "react";
import { WalletProvider } from "@/lib/wallet/context";
import AppShell from "@/components/layout/AppShell";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <AppShell>{children}</AppShell>
    </WalletProvider>
  );
}
