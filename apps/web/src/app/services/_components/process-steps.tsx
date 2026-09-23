import type { CSSProperties } from "react";

// TODO: first-draft copy — confirm "fixed price" and the live preview promise
const STEPS = [
  {
    title: "Discover",
    text: "A call and a short workshop: goals, audience, content. You get a clear scope and a fixed price.",
  },
  {
    title: "Design",
    text: "Wireframes first, then the visual design. Nothing gets built before you've approved it.",
  },
  {
    title: "Build",
    text: "Fast, accessible, tested in real browsers. You follow progress on a live preview link.",
  },
  {
    title: "Launch & care",
    text: "We launch, measure and keep improving — or hand over cleanly to your team.",
  },
] as const;

const numeral = (position: number) => String(position).padStart(2, "0");

type StepStyle = CSSProperties & Record<"--step", string>;

/**
 * The track draws at a constant speed from the first waypoint to the last (see `.process-track`),
 * so waypoint n is reached at n / (steps − 1) of the draw; it is set down right then.
 */
const TRACK_DRAW_MS = 1200;
const WAYPOINT_MS = TRACK_DRAW_MS / (STEPS.length - 1);
const TEXT_LAG_MS = 90;

/**
 * The same four steps whatever the service: the answer to "what happens after I get in touch?".
 * A route along a track, drawn as the section scrolls in, with one waypoint per step.
 */
export const ProcessSteps = () => (
  <section className="process" aria-labelledby="process-title">
    <div className="section-head" data-reveal>
      <p className="eyebrow">
        <span className="brand-dot" aria-hidden="true" />
        How a project runs
      </p>
      <h2 id="process-title" className="section-title">
        Four steps. No surprises.
      </h2>
    </div>
    <div className="process-route">
      <div className="process-track" aria-hidden="true">
        <span className="process-track-ink" data-reveal="draw" />
      </div>
      <ol className="process-steps">
        {STEPS.map((step, index) => {
          const style: StepStyle = { "--step": String(index) };
          return (
            <li key={step.title} className="process-step" style={style}>
              <span
                className="process-node"
                aria-hidden="true"
                data-reveal="pop"
                data-reveal-delay={index * WAYPOINT_MS}
              >
                {numeral(index + 1)}
              </span>
              <div
                data-reveal
                data-reveal-delay={index * WAYPOINT_MS + TEXT_LAG_MS}
              >
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-text">{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  </section>
);
