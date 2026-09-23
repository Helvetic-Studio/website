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

const SiteScreen = ({ project }: { project: Project }) => (
  <div className="cover-screen cover-screen-site">
    <span className="cover-kicker">{project.client}</span>
    <span className="cover-wordmark">{project.title}</span>
    <span className="cover-line" />
    <span className="cover-line cover-line-short" />
    <span className="cover-pill" />
  </div>
);

const ShopScreen = ({ project }: { project: Project }) => (
  <div className="cover-screen cover-screen-shop">
    <span className="cover-wordmark">{project.title}</span>
    <span className="cover-products">
      <span />
      <span />
      <span />
    </span>
  </div>
);

const AppScreen = ({ project }: { project: Project }) => (
  <div className="cover-screen cover-screen-app">
    <span className="cover-sidebar">
      <span />
      <span />
      <span />
    </span>
    <span className="cover-dashboard">
      <span className="cover-wordmark">{project.title}</span>
      <span className="cover-bars">
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    </span>
  </div>
);

const SCREENS = { site: SiteScreen, shop: ShopScreen, app: AppScreen } as const;

// TODO: placeholder art — replace with real screenshots via next/image once case studies exist.
/** A browser window drawn in CSS, tinted by the project's hue. Decorative: the card names it. */
export const ProjectCover = ({ project }: { project: Project }) => {
  const Screen = SCREENS[layoutOf(project)];

  return (
    <div className="project-cover" aria-hidden="true">
      <div className="cover-window">
        <div className="cover-chrome">
          <span className="cover-lights">
            <span />
            <span />
            <span />
          </span>
          <span className="cover-address">{project.slug}.ch</span>
        </div>
        <Screen project={project} />
      </div>
    </div>
  );
};
