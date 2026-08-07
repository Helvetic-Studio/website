import * as React from "react";

/** Viewport width (px) at which the layout is treated as mobile. */
const MOBILE_BREAKPOINT = 768;

/**
 * Subscribe to whether the viewport is below the mobile breakpoint (`768px`).
 *
 * Returns `false` during SSR / before the first layout measurement so server
 * and first client paint stay aligned; updates on `matchMedia` changes.
 *
 * @returns `true` when `window.innerWidth` is less than {@link MOBILE_BREAKPOINT}.
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(() =>
    typeof window === "undefined"
      ? undefined
      : window.innerWidth < MOBILE_BREAKPOINT
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return isMobile ?? false;
};
