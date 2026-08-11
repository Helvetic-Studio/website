"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ComponentProps, ReactNode } from "react";

export interface ThemeProviderProps extends ComponentProps<
  typeof NextThemesProvider
> {
  children: ReactNode;
}

const ThemeHotkey = () => {
  const { resolvedTheme, setTheme } = useTheme();

  useHotkey(
    "D",
    () => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    },
    {
      ignoreInputs: true,
      preventDefault: true,
    }
  );

  return null;
};

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => (
  <NextThemesProvider {...props}>
    <ThemeHotkey />
    {children}
  </NextThemesProvider>
);
