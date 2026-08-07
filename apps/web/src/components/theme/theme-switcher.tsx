"use client";

import {
  Moon02Icon,
  Sun03Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import type { JSX } from "react";
import { useSyncExternalStore } from "react";

interface ThemeOptionProps {
  icon: JSX.Element;
  value: string;
  isActive: boolean;
  onChange: (value: string) => void;
}

const ThemeOption = ({ icon, value, isActive, onChange }: ThemeOptionProps) => (
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

    {isActive ? (
      <motion.span
        layoutId="theme-option"
        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
        className="absolute inset-0 rounded-full border"
      />
    ) : null}
  </label>
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

// Client-only gate without useEffect+setState (blocked by react-compiler).
// Store never updates, so subscribe returns a no-op unsubscribe.
const unsubscribeFromNothing = (): undefined => undefined;
const subscribeToNothing = (_onStoreChange: () => void): (() => void) =>
  unsubscribeFromNothing;

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
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
        />
      ))}
    </motion.div>
  );
};
