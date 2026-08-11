"use client";

import {
  Moon02Icon,
  Sun03Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import type { JSX } from "react";
import { useSyncExternalStore } from "react";

interface ThemeOptionProps {
  icon: JSX.Element;
  value: string;
  isActive: boolean;
  onChange: (value: string) => void;
  reduceMotion: boolean;
}

const ThemeOption = ({
  icon,
  value,
  isActive,
  onChange,
  reduceMotion,
}: ThemeOptionProps) => {
  let activeIndicator: JSX.Element | null = null;
  if (isActive) {
    activeIndicator = reduceMotion ? (
      <span className="absolute inset-0 rounded-full border" />
    ) : (
      <motion.span
        layoutId="theme-option"
        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
        className="absolute inset-0 rounded-full border"
      />
    );
  }

  return (
    <label
      data-active={isActive}
      className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-[color] hover:text-foreground data-[active=true]:text-foreground [&_svg]:size-4"
    >
      <input
        type="radio"
        name="theme"
        value={value}
        checked={isActive}
        aria-label={`Switch to ${value} theme`}
        className="sr-only"
        onChange={() => {
          onChange(value);
        }}
      />
      {icon}
      {activeIndicator}
    </label>
  );
};

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

// Client-only gate without useEffect+setState (blocked by react-compiler).
// Store never updates, so subscribe returns a no-op unsubscribe.
const unsubscribeFromNothing = (): undefined => undefined;
const subscribeToNothing = (_onStoreChange: () => void): (() => void) =>
  unsubscribeFromNothing;

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const reduceMotion = Boolean(useReducedMotion());
  const isMounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );

  if (!isMounted) {
    return <div className="flex h-8 w-24" />;
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.3 }}
      className="inline-flex items-center overflow-clip rounded-full bg-background inset-ring-1 inset-ring-border"
      aria-label="Theme"
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          onChange={setTheme}
          reduceMotion={reduceMotion}
        />
      ))}
    </motion.div>
  );
};
