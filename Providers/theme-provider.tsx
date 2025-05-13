"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AtuhProvider } from "./auth-provider";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <AtuhProvider>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </AtuhProvider>
  );
}
