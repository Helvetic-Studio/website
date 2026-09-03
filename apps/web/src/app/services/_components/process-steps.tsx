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

/** The same four steps whatever the service: the answer to "what happens after I get in touch?". */
export const ProcessSteps = () => (
  <section className="process" aria-labelledby="process-title">
    <p className="page-eyebrow">
      <span className="brand-dot" aria-hidden="true" />
      How a project runs
    </p>
    <h2 id="process-title" className="section-title">
      Four steps. No surprises.
    </h2>
    <ol className="process-steps">
      {STEPS.map((step, index) => (
        <li key={step.title} className="process-step">
          <span className="process-step-number" aria-hidden="true">
            {numeral(index + 1)}
          </span>
          <h3 className="process-step-title">{step.title}</h3>
          <p className="process-step-text">{step.text}</p>
        </li>
      ))}
    </ol>
  </section>
);
