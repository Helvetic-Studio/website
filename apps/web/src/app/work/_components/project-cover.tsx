import type { Project } from "@/app/_lib/projects";

type CoverLayout = "site" | "shop" | "app";

/** The cover shows the kind of thing that was built, read from the project's lead service. */
const layoutOf = (project: Project): CoverLayout => {
  const [lead] = project.services;
  if (lead === "shops") {
    return "shop";
  }
  return lead === "applications" ? "app" : "site";
};

// Everything inside the cover is sized in container units, so the drawing scales with the card.
const SCREEN = "relative flex-1 text-ink";
const WORDMARK = "block leading-none font-[620] tracking-[-0.055em]";
const LINE =
  "block h-[1.4cqi] rounded-[1cqi] bg-[oklch(0.93_0.01_var(--cover-hue))]";

const SiteScreen = ({ project }: { project: Project }) => (
  <div className={`${SCREEN} px-[7cqi] py-[6cqi]`}>
    <span className="block text-[1.9cqi] font-semibold tracking-[0.14em] text-[oklch(0.5_0.13_var(--cover-hue))] uppercase">
      {project.client}
    </span>
    <span className={`${WORDMARK} mt-[1.6cqi] text-[6.4cqi]`}>
      {project.title}
    </span>
    <span className={`${LINE} mt-[3.4cqi] w-[62%]`} />
    <span className={`${LINE} mt-[1.6cqi] w-[42%]`} />
    <span className="mt-[4cqi] block h-[5cqi] w-[17cqi] rounded-full bg-[oklch(0.6_0.19_var(--cover-hue))]" />
  </div>
);

const ShopScreen = ({ project }: { project: Project }) => (
  <div className={`${SCREEN} px-[7cqi] py-[6cqi]`}>
    <span className={`${WORDMARK} text-[4.6cqi]`}>{project.title}</span>
    <span className="mt-[4cqi] grid grid-cols-3 gap-[2.4cqi] *:aspect-[4/5] *:rounded-[1.6cqi] *:[background:radial-gradient(circle_at_50%_42%,oklch(0.72_0.14_var(--cover-hue))_0_18%,transparent_19%),oklch(0.95_0.025_var(--cover-hue))]">
      <span />
      <span />
      <span />
    </span>
  </div>
);

/** The dashboard's bars, left to right. */
const BARS = [
  "h-[42%] opacity-45",
  "h-[70%] opacity-60",
  "h-[54%] opacity-50",
  "h-full",
  "h-[78%] opacity-70",
] as const;

const AppScreen = ({ project }: { project: Project }) => (
  <div className={`${SCREEN} grid grid-cols-[20%_minmax(0,1fr)]`}>
    <span className="flex flex-col gap-[2cqi] bg-[oklch(0.975_0.008_var(--cover-hue))] px-[3cqi] py-[5cqi] *:h-[1.4cqi] *:rounded-[1cqi] *:bg-[oklch(0.9_0.015_var(--cover-hue))] *:first:w-[70%] *:first:bg-[oklch(0.6_0.19_var(--cover-hue))]">
      <span />
      <span />
      <span />
    </span>
    <span className="flex flex-col px-[5cqi] pt-[5cqi]">
      <span className={`${WORDMARK} text-[4.4cqi]`}>{project.title}</span>
      <span className="mt-auto flex h-[20cqi] items-end gap-[2cqi] pb-[12cqi]">
        {BARS.map((bar) => (
          <span
            key={bar}
            className={`flex-1 rounded-t-[1cqi] bg-[oklch(0.6_0.19_var(--cover-hue)/0.85)] ${bar}`}
          />
        ))}
      </span>
    </span>
  </div>
);

const SCREENS = { site: SiteScreen, shop: ShopScreen, app: AppScreen } as const;

// TODO: placeholder art — replace with real screenshots via next/image once case studies exist.
/**
 * A browser window drawn with utilities, tinted by the project's hue (`--cover-hue`, set on the
 * card) and cropped by the cover's bottom-right edge like a product shot. Decorative: the card
 * names it.
 */
export const ProjectCover = ({ project }: { project: Project }) => {
  const Screen = SCREENS[layoutOf(project)];

  return (
    <div
      className="@container relative aspect-[16/10] overflow-hidden rounded-[calc(var(--radius-core)-8px)] [background:radial-gradient(80%_90%_at_12%_0%,oklch(0.985_0.012_var(--cover-hue))_0%,oklch(0.985_0.012_var(--cover-hue)/0)_60%),linear-gradient(155deg,oklch(0.95_0.03_var(--cover-hue))_0%,oklch(0.85_0.08_var(--cover-hue))_100%)]"
      aria-hidden="true"
    >
      <div className="absolute top-[14%] right-[-3%] bottom-[-10%] left-[11%] flex flex-col overflow-hidden rounded-t-[2.4cqi] bg-white shadow-[0_0_0_1px_oklch(1_0_0/0.7),0_6cqi_12cqi_-6cqi_oklch(0.32_0.1_var(--cover-hue)/0.45)]">
        <div className="flex h-[6.4cqi] items-center gap-[3cqi] bg-[oklch(0.975_0.006_var(--cover-hue))] px-[2.4cqi] shadow-[0_1px_0_oklch(0.9_0.012_var(--cover-hue))]">
          <span className="flex gap-[1cqi] *:size-[1.5cqi] *:rounded-full *:bg-[oklch(0.86_0.01_var(--cover-hue))]">
            <span />
            <span />
            <span />
          </span>
          <span className="rounded-[1.2cqi] bg-white px-[3cqi] py-[0.6cqi] text-[2.1cqi] tracking-normal text-ink-muted">
            {project.slug}.ch
          </span>
        </div>
        <Screen project={project} />
      </div>
    </div>
  );
};
