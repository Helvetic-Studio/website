import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { ThemeProvider } from "./theme-provider";
import { ThemeSwitcher } from "./theme-switcher";

const renderThemeSwitcher = (
  props: Partial<ComponentProps<typeof ThemeProvider>> = {}
) =>
  render(
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      <ThemeSwitcher />
    </ThemeProvider>
  );

// next-themes still calls the legacy MediaQueryList aliases in jsdom.
const attachLegacyMediaQueryAliases = (
  mediaQueryList: object,
  subscribe: () => void,
  unsubscribe: () => void
) => {
  Reflect.set(mediaQueryList, "addListener", subscribe);
  Reflect.set(mediaQueryList, "removeListener", unsubscribe);
};

const createMatchMediaList = (query: string) => {
  const subscribe = vi.fn<() => void>();
  const unsubscribe = vi.fn<() => void>();
  const mediaQueryList = {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: subscribe,
    removeEventListener: unsubscribe,
    dispatchEvent: vi.fn<(event: Event) => boolean>(() => false),
  };

  attachLegacyMediaQueryAliases(mediaQueryList, subscribe, unsubscribe);

  return mediaQueryList;
};

const stubMatchMedia = () => {
  vi.stubGlobal(
    "matchMedia",
    vi
      .fn<(query: string) => ReturnType<typeof createMatchMediaList>>()
      .mockImplementation(createMatchMediaList)
  );
};

describe(ThemeSwitcher, () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    stubMatchMedia();
  });

  it("exposes system, light, and dark theme options", async () => {
    renderThemeSwitcher({ defaultTheme: "system", enableSystem: true });

    await expect(
      screen.findByRole("radio", { name: "Switch to system theme" })
    ).resolves.toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Switch to light theme" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Switch to dark theme" })
    ).toBeInTheDocument();
  });

  it("selects the dark theme when the dark option is chosen", async () => {
    const user = userEvent.setup();
    renderThemeSwitcher();

    const darkTheme = await screen.findByRole("radio", {
      name: "Switch to dark theme",
    });
    await user.click(darkTheme);

    expect(darkTheme).toBeChecked();
    expect(document.documentElement).toHaveClass("dark");
  });

  it("selects the light theme when the light option is chosen", async () => {
    const user = userEvent.setup();
    renderThemeSwitcher({ defaultTheme: "dark" });

    const lightTheme = await screen.findByRole("radio", {
      name: "Switch to light theme",
    });
    await user.click(lightTheme);

    expect(lightTheme).toBeChecked();
    expect(document.documentElement).toHaveClass("light");
  });
});
