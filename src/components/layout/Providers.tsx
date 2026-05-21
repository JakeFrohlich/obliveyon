"use client";

import { SessionProvider } from "next-auth/react";
import { useBfcacheRefresh } from "@/hooks/use-bfcache-refresh";

function BfcacheGuard() {
  useBfcacheRefresh();
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <BfcacheGuard />
      {children}
    </SessionProvider>
  );
}
