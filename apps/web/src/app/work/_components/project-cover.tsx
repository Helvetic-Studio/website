import Image from "next/image";
import type { CSSProperties } from "react";

import type { Project } from "@/app/_lib/projects";
import { ProjectScreen } from "@/app/work/_components/project-screens";
import { PLACES } from "@/app/work/_lib/places";
import type { TileSize } from "@/app/work/_lib/tiles";

export interface ProjectCoverProps {
  project: Project;
  size: TileSize;
  /** The first tile is the largest thing on the page: its photograph loads first. */
  lead: boolean;
}

// One height per size, so the two tiles of a pair line up; below lg every tile is full width.
const FRAME: Record<TileSize, string> = {
  full: "h-[clamp(440px,46vw,620px)]",
  wide: "h-[clamp(400px,38vw,520px)]",
  narrow: "h-[clamp(400px,38vw,520px)]",
};

const WINDOW: Record<TileSize, string> = {
  full: "top-[14%] right-[5%] w-[50%] max-lg:right-[7%] max-lg:w-[86%]",
  wide: "top-[17%] right-[9%] w-[82%]",
  narrow: "top-[17%] right-[7%] w-[86%]",
};

const SIZES: Record<TileSize, string> = {
  full: "(min-width: 1160px) 1120px, 100vw",
  wide: "(min-width: 1024px) 640px, 100vw",
  narrow: "(min-width: 1024px) 460px, 100vw",
};

type CoverVariables = Record<"--accent-hue", string>;

// TODO: placeholder art — replace the drawn window with a real screenshot once case studies exist.
/**
 * The work, standing in its place: a photograph of where the client works, and in front of it the
 * first screen of what was built, in a browser window cropped by the frame's lower edge. The
 * photograph is the client's surroundings, captioned as such; the window is drawn (see
 * ProjectScreen) and decorative, since the tile names the project.
 */
export const ProjectCover = ({ project, size, lead }: ProjectCoverProps) => {
  const place = PLACES[project.place];
  const style: CSSProperties & CoverVariables = {
    "--accent-hue": String(project.accentHue),
  };

  return (
    <div
      className={`relative isolate overflow-hidden rounded-[calc(var(--radius-core)-8px)] bg-[oklch(0.86_0.03_40)] ${FRAME[size]} max-lg:aspect-[4/3] max-lg:h-auto max-md:aspect-[4/5]`}
      style={style}
    >
      <Image
        src={place.photo}
        alt={place.alt}
        fill
        sizes={SIZES[size]}
        placeholder="blur"
        preload={lead}
        className="-z-10 object-cover [transition:scale_1400ms_var(--ease-out)] motion-safe:pointer-fine:group-hover/tile:scale-[1.04]"
      />
      <p className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-[7px] text-[13px] leading-none font-medium text-ink max-md:top-3 max-md:left-3">
        {place.caption}
      </p>
      <div
        data-ui
        aria-hidden="true"
        className={`@container absolute bottom-[-6%] flex flex-col overflow-hidden rounded-t-[12px] bg-white text-ink shadow-[0_0_0_1px_oklch(0.2_0.02_30/0.08),0_36px_70px_-34px_oklch(0.18_0.04_30/0.7)] [transition:translate_800ms_var(--ease-out)] motion-safe:pointer-fine:group-hover/tile:-translate-y-2 ${WINDOW[size]}`}
      >
        <div className="flex h-[6cqi] shrink-0 items-center gap-[3cqi] bg-[oklch(0.975_0.004_60)] px-[2.4cqi] shadow-[0_1px_0_oklch(0.92_0.006_60)]">
          <span className="flex gap-[1cqi] *:size-[1.5cqi] *:rounded-full *:bg-[oklch(0.86_0.008_60)]">
            <span />
            <span />
            <span />
          </span>
          <span className="rounded-[1.2cqi] bg-white px-[3cqi] py-[0.7cqi] text-[2cqi] text-ink-muted">
            {project.slug}.ch
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="pb-[12cqi] [transition:translate_1600ms_var(--ease-in-out)] motion-safe:pointer-fine:group-hover/tile:-translate-y-[16cqi]">
            <ProjectScreen project={project} />
          </div>
        </div>
      </div>
    </div>
  );
};
