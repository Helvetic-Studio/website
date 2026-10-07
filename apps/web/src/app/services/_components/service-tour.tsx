"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

import { BEZEL, BEZEL_CORE, FOCUS_RING } from "@/app/_components/styles";
import { SERVICES } from "@/app/_lib/services";
import { ServiceChapter } from "@/app/services/_components/service-chapter";
import { ServiceScene } from "@/app/services/_components/service-scenes";
import {
  chapterInView,
  numeral,
  sceneStateFor,
} from "@/app/services/_lib/tour";

/**
 * The chapter being read is the one crossing a line through the middle of the viewport (a root
 * squeezed to zero height there). The chapters touch, so the line is always in one of them; before
 * the first reaches it, the first is the one on stage.
 */
const useChapterInView = (root: RefObject<HTMLElement | null>): number => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const chapters = root.current?.querySelectorAll("[data-chapter]") ?? [];
    const observer = new IntersectionObserver(
      (entries) => {
        const chapter = chapterInView(entries);
        if (chapter !== null) {
          setActive(chapter);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    for (const chapter of chapters) {
      observer.observe(chapter);
    }
    return () => {
      observer.disconnect();
    };
  }, [root]);

  return active;
};

/**
 * One scene on stage, the rest waiting on the side they will come from. The leaving scene goes
 * quickly; the arriving one follows a beat later, slower, through a touch of blur so the two read
 * as one picture changing. Transitions, not keyframes: a fast scroll retargets them mid-way.
 * Hidden scenes are `invisible` once out, so the stage only paints the one on show.
 */
const SCENE_LAYER =
  "group/scene absolute inset-0 transition-[opacity,translate,filter,visibility] duration-[280ms] ease-out data-[state=active]:z-1 data-[state=active]:delay-[60ms] data-[state=active]:duration-[560ms] data-[state=after]:invisible data-[state=after]:opacity-0 data-[state=before]:invisible data-[state=before]:opacity-0 motion-safe:data-[state=after]:translate-y-[3%] motion-safe:data-[state=after]:blur-[4px] motion-safe:data-[state=before]:-translate-y-[3%] motion-safe:data-[state=before]:blur-[4px]";

/** The route through the five: passed segments stay inked, the current one is red, the rest wait. */
const TourProgress = ({ active }: { active: number }) => (
  <nav
    aria-label="Services on this page"
    className="mt-3 grid grid-cols-5 gap-1.5"
  >
    {SERVICES.map((service, index) => {
      const state = sceneStateFor(index, active);
      return (
        <a
          key={service.slug}
          href={`#${service.slug}`}
          aria-label={service.title}
          aria-current={state === "active" ? "true" : undefined}
          data-state={state}
          className={`group/step flex min-h-11 flex-col justify-center gap-2 rounded-[10px] px-1.5 [-webkit-tap-highlight-color:transparent] ${FOCUS_RING}`}
        >
          <span className="relative block h-0.5 overflow-hidden rounded-full bg-[oklch(0.42_0.06_28/0.13)] transition-colors duration-200 ease-[ease] pointer-fine:group-hover/step:bg-[oklch(0.42_0.06_28/0.3)]">
            <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-brand transition-[scale,opacity] duration-[600ms] ease-out group-data-[state=active]/step:scale-x-100 group-data-[state=before]/step:scale-x-100 group-data-[state=before]/step:opacity-35 motion-reduce:transition-[opacity]" />
          </span>
          <span className="text-[12px] font-semibold text-ink-muted tabular-nums transition-colors duration-200 ease-[ease] group-data-[state=active]/step:text-brand-text">
            {numeral(index + 1)}
          </span>
        </a>
      );
    })}
  </nav>
);

/**
 * Beside the chapters on a wide screen: the service being read, drawn, held in view while its
 * words scroll past. Vertically centred in tall windows, under the navigation in short ones.
 */
const TourStage = ({ active }: { active: number }) => (
  <div className="max-lg:hidden">
    <div className="sticky top-[clamp(104px,calc(50dvh-290px),176px)]">
      <div className={BEZEL} data-reveal>
        <div
          className={`${BEZEL_CORE} relative aspect-[10/9] overflow-hidden`}
          aria-hidden="true"
        >
          {SERVICES.map((service, index) => (
            <div
              key={service.slug}
              className={SCENE_LAYER}
              data-state={sceneStateFor(index, active)}
            >
              <ServiceScene slug={service.slug} />
            </div>
          ))}
        </div>
      </div>
      <TourProgress active={active} />
    </div>
  </div>
);

/**
 * The five services, one chapter each, in the order they are sold. On a wide screen the chapters
 * scroll past a stage that shows the one being read; narrower, each chapter carries its own
 * drawing above its words.
 */
export const ServiceTour = () => {
  const root = useRef<HTMLDivElement>(null);
  const active = useChapterInView(root);

  return (
    <div
      ref={root}
      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] gap-[clamp(48px,6vw,96px)] max-lg:grid-cols-1"
    >
      <div>
        {SERVICES.map((service, index) => (
          <ServiceChapter
            key={service.slug}
            service={service}
            index={index}
            active={index === active}
          />
        ))}
      </div>
      <TourStage active={active} />
    </div>
  );
};
