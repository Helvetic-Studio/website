"use client";

import { Toaster } from "@website/ui/components/toast";
import { TooltipProvider } from "@website/ui/components/tooltip";

import { ThemeProvider } from "@/components/theme/theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </ThemeProvider>
  );
};
