import type {
  AppScreen,
  Project,
  RowTone,
  ShopScreen,
  SiteScreen,
} from "@/app/_lib/projects";

/*
 * The first screen of what was built, drawn with utilities. Everything is sized in container units
 * of the window (`cqi`), so the drawing scales with the tile. The client's own accent comes in as
 * `--accent-hue` (set on the cover). Each screen runs on past the window's lower edge: hovering the
 * tile scrolls it, as if someone were reading the page.
 */

const ACCENT_BG = "bg-[oklch(0.52_0.15_var(--accent-hue))] text-white";
const ACCENT_TEXT = "text-[oklch(0.5_0.15_var(--accent-hue))]";
const TINT = "bg-[oklch(0.968_0.016_var(--accent-hue))]";
const PILL = `inline-flex items-center rounded-full px-[3cqi] py-[1.5cqi] text-[2.1cqi] leading-none font-semibold whitespace-nowrap`;

/** The client's wordmark: a small square in their accent, and the name. */
const Wordmark = ({ project }: { project: Project }) => (
  <span className="flex items-center gap-[1.4cqi] text-[2.8cqi] leading-none font-[650] tracking-[-0.04em] whitespace-nowrap">
    <span
      className={`size-[3cqi] rounded-[0.8cqi] ${ACCENT_BG}`}
      aria-hidden="true"
    />
    {project.title}
  </span>
);

const TopBar = ({
  project,
  nav,
  end,
}: {
  project: Project;
  nav: readonly string[];
  end?: string;
}) => (
  <span className="flex items-center justify-between gap-[3cqi]">
    <Wordmark project={project} />
    <span className="flex items-center gap-[3cqi] text-[2.1cqi] whitespace-nowrap text-ink-muted">
      {nav.map((item) => (
        <span key={item}>{item}</span>
      ))}
      {end === undefined ? null : (
        <span className={`${PILL} ${TINT} ${ACCENT_TEXT}`}>{end}</span>
      )}
    </span>
  </span>
);

const Site = ({
  project,
  screen,
}: {
  project: Project;
  screen: SiteScreen;
}) => (
  <span className="block px-[5cqi] pt-[3.6cqi]">
    <TopBar project={project} nav={screen.nav} />
    <span className="mt-[9cqi] block max-w-[84%] text-[6.4cqi] leading-[1.02] font-semibold tracking-[-0.05em] text-balance">
      {screen.headline}
    </span>
    <span className="mt-[2.8cqi] block max-w-[64%] text-[2.5cqi] leading-[1.5] text-ink-muted">
      {screen.text}
    </span>
    <span className="mt-[4.4cqi] flex items-center gap-[3.4cqi]">
      <span className={`${PILL} ${ACCENT_BG}`}>{screen.action}</span>
      <span className="text-[2.1cqi] font-semibold">Mehr erfahren →</span>
    </span>
    <span className="mt-[10cqi] grid grid-cols-3 gap-[2cqi]">
      {screen.features.map((feature) => (
        <span
          key={feature}
          className={`flex h-[19cqi] flex-col justify-between rounded-[1.8cqi] p-[2.6cqi] ${TINT}`}
        >
          <span
            className={`size-[3.4cqi] rounded-full ${ACCENT_BG} opacity-85`}
          />
          <span className="text-[2.3cqi] leading-tight font-semibold">
            {feature}
          </span>
        </span>
      ))}
    </span>
  </span>
);

/** A bicycle, drawn in the client's accent: the shop sells nothing else. */
const Bicycle = () => (
  <svg
    viewBox="0 0 100 62"
    className={`w-[78%] ${ACCENT_TEXT}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="22" cy="42" r="16" />
    <circle cx="78" cy="42" r="16" />
    <path d="M22 42 L45 42 L37 19 Z M37 19 L68 21 L45 42 M68 21 L78 42 M31 15 L43 15 M66 13 L73 13 L68 21" />
  </svg>
);

const Shop = ({
  project,
  screen,
}: {
  project: Project;
  screen: ShopScreen;
}) => (
  <span className="block px-[5cqi] pt-[3.6cqi]">
    <TopBar project={project} nav={screen.nav} end="Warenkorb · 2" />
    <span className="mt-[7cqi] block text-[5.6cqi] leading-[1.02] font-semibold tracking-[-0.05em]">
      {screen.headline}
    </span>
    <span className="mt-[4cqi] grid grid-cols-3 gap-[2.4cqi]">
      {screen.products.map((product) => (
        <span key={product.name} className="block">
          <span
            className={`grid aspect-[4/5] place-items-center rounded-[1.8cqi] ${TINT}`}
          >
            <Bicycle />
          </span>
          <span className="mt-[1.8cqi] block text-[2.3cqi] leading-tight font-semibold">
            {product.name}
          </span>
          <span className="mt-[0.6cqi] block text-[2.1cqi] text-ink-muted tabular-nums">
            {product.price}
          </span>
        </span>
      ))}
    </span>
    <span className="mt-[5cqi] flex items-center justify-between rounded-[1.8cqi] bg-ink px-[3cqi] py-[2.4cqi] text-white">
      <span className="text-[2.2cqi] font-semibold">
        Abholen in {project.town} oder liefern lassen
      </span>
      <span className={`${PILL} bg-white text-ink`}>{screen.action}</span>
    </span>
  </span>
);

const TONES: Record<RowTone, string> = {
  done: "bg-[oklch(0.94_0.05_150)] text-[oklch(0.42_0.11_150)]",
  busy: "bg-[oklch(0.95_0.06_80)] text-[oklch(0.48_0.11_65)]",
  open: `${TINT} ${ACCENT_TEXT}`,
};

const App = ({ project, screen }: { project: Project; screen: AppScreen }) => (
  <span className="grid min-h-full grid-cols-[24%_minmax(0,1fr)]">
    <span
      className={`flex flex-col gap-[1cqi] px-[2.6cqi] pt-[3.6cqi] ${TINT}`}
    >
      <span className="mb-[4cqi] [&>span]:text-[2.3cqi]">
        <Wordmark project={project} />
      </span>
      {screen.nav.map((item, index) => (
        <span
          key={item}
          className={`rounded-[1.2cqi] px-[1.8cqi] py-[1.4cqi] text-[2.1cqi] ${index === 1 ? `bg-white font-semibold ${ACCENT_TEXT}` : "text-ink-muted"}`}
        >
          {item}
        </span>
      ))}
    </span>
    <span className="block px-[4cqi] pt-[4.4cqi]">
      <span className="flex items-center justify-between gap-[2cqi]">
        <span className="text-[4.4cqi] leading-none font-semibold tracking-[-0.045em] whitespace-nowrap">
          {screen.headline}
        </span>
        <span className={`${PILL} ${ACCENT_BG}`}>+ {screen.action}</span>
      </span>
      <span className="mt-[4cqi] grid grid-cols-3 gap-[2cqi]">
        {screen.stats.map((stat) => (
          <span
            key={stat.label}
            className={`block rounded-[1.6cqi] px-[2.4cqi] py-[2cqi] ${TINT}`}
          >
            <span className="block text-[4.4cqi] leading-none font-semibold tracking-[-0.04em] tabular-nums">
              {stat.value}
            </span>
            <span className="mt-[1cqi] block text-[1.9cqi] text-ink-muted">
              {stat.label}
            </span>
          </span>
        ))}
      </span>
      <span className="mt-[2.4cqi] block">
        {screen.rows.map((row) => (
          <span
            key={`${row.label}-${row.date}`}
            className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-[2.4cqi] py-[2.3cqi] text-[2.2cqi] not-last:shadow-[0_1px_0_oklch(0.92_0.006_var(--accent-hue))]"
          >
            <span className="truncate font-medium">{row.label}</span>
            <span className="text-ink-muted tabular-nums">{row.date}</span>
            <span
              className={`rounded-full px-[1.8cqi] py-[0.9cqi] text-[1.9cqi] font-semibold ${TONES[row.tone]}`}
            >
              {row.status}
            </span>
          </span>
        ))}
      </span>
    </span>
  </span>
);

/** The screen for the project's kind of build. */
export const ProjectScreen = ({ project }: { project: Project }) => {
  const { screen } = project;
  if (screen.kind === "shop") {
    return <Shop project={project} screen={screen} />;
  }
  if (screen.kind === "app") {
    return <App project={project} screen={screen} />;
  }
  return <Site project={project} screen={screen} />;
};
