"use client";

import { SessionProvider } from "next-auth/react";

export function AtuhProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
