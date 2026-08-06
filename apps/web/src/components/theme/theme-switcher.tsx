"use client";

import { Moon02Icon, Sun03Icon, ComputerIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import type { JSX } from "react";
import { useSyncExternalStore } from "react";

interface ThemeOptionProps {
  icon: JSX.Element;
  value: string;
  isActive?: boolean;
  onClick: (value: string) => void;
}

const ThemeOption = ({ icon, value, isActive, onClick }: ThemeOptionProps) => (
  <button
    data-active={isActive}
    className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-[color] hover:text-foreground data-[active=true]:text-foreground [&_svg]:size-4"
    role="radio"
    aria-checked={isActive}
    aria-label={`Switch to ${value} theme`}
    onClick={() => {
      onClick(value);
    }}
  >
    {icon}

    {isActive && (
      <motion.span
        layoutId="theme-option"
        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
        className="absolute inset-0 rounded-full border"
      />
    )}
  </button>
);

const THEME_OPTIONS = [
  {
    icon: <HugeiconsIcon icon={ComputerIcon} />,
    value: "system",
  },
  {
    icon: <HugeiconsIcon icon={Sun03Icon} />,
    value: "light",
  },
  {
    icon: <HugeiconsIcon icon={Moon02Icon} />,
    value: "dark",
  },
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isMounted) {
    return <div className="flex h-8 w-24" />;
  }

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center overflow-clip rounded-full bg-background inset-ring-1 inset-ring-border"
      role="radiogroup"
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          onClick={setTheme}
        />
      ))}
    </motion.div>
  );
};
