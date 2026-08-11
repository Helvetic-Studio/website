"use client";

import { Toaster } from "@website/ui/components/toast";
import { TooltipProvider } from "@website/ui/components/tooltip";
import { MotionConfig } from "motion/react";

export interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => (
  <MotionConfig reducedMotion="user">
    <TooltipProvider>
      {children}
      <Toaster />
    </TooltipProvider>
  </MotionConfig>
);
