import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export interface ThemeProviderProps extends React.ComponentProps<
  typeof NextThemesProvider
> {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => (
  <NextThemesProvider {...props}>{children}</NextThemesProvider>
);
