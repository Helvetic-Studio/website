import type { ReactNode } from "react";

import { RIDGE_POLYGONS, VIEWBOX } from "@/app/_lib/peaks";

export interface ClosingPanelProps {
  /** Red for the site's moment of decision; ink for a quieter, personal close. */
  tone: "red" | "ink";
  id: string;
  title: string;
  text: string;
  eyebrow?: string;
  /** The buttons. */
  children: ReactNode;
}

/**
 * The close of a content page: one solid surface in a bezel, with the home range standing in its
 * lower edge — the way back to every door. Rises into view with the page's Reveal.
 */
export const ClosingPanel = ({
  tone,
  id,
  title,
  text,
  eyebrow,
  children,
}: ClosingPanelProps) => (
  <section className="cta-panel bezel" aria-labelledby={id} data-reveal>
    <div className={`cta-core cta-core-${tone}`}>
      <svg
        className="cta-ridge"
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points={RIDGE_POLYGONS.mid} className="cta-ridge-back" />
        <polygon points={RIDGE_POLYGONS.near} className="cta-ridge-front" />
      </svg>
      {eyebrow === undefined ? null : (
        <p className="eyebrow cta-eyebrow">{eyebrow}</p>
      )}
      <h2 id={id} className="cta-title">
        {title}
      </h2>
      <p className="cta-text">{text}</p>
      <div className="cta-actions">{children}</div>
    </div>
  </section>
);
