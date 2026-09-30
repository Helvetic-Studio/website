import { RIDGE_CRESTS, RIDGE_POLYGONS, VIEWBOX } from "@/app/_lib/peaks";

const VIEWBOX_ATTRIBUTE = `0 0 ${VIEWBOX.width} ${VIEWBOX.height}`;

type Depth = "far" | "mid" | "near";

interface RidgeLayerProps {
  depth: Depth;
}

/**
 * The camera is one transform per layer: scale about the focus, written as
 * translate(focus · (1 − scale)) scale(scale) about the top-left corner. One property, one easing,
 * composited end to end — the pivot is never animated, so the flight cannot wobble. The layer
 * windows the 1600-unit viewBox to x 430 → 1230.
 */
const LAYER =
  "absolute bottom-0 left-[-53.75%] h-(--ridge-height) w-[200%] origin-top-left will-change-transform [transform:translate(calc(var(--focus-x-ridge)*(1_-_var(--layer-zoom))),calc(var(--focus-y)*(1_-_var(--layer-zoom))))_scale(var(--layer-zoom))] [transition:transform_var(--zoom-duration)_var(--layer-ease)] [&>svg]:block [&>svg]:size-full [&>svg]:overflow-visible";

// Each layer is lit from above: denser at the summit, thinning into the valley.
const DEPTHS: Record<Depth, string> = {
  far: "[--crest-opacity:0.5] [--layer-ease:var(--ease-far)] [--layer-zoom:var(--zoom-far)] [--stop-bottom:oklch(0.5684_0.2129_25.98/0.08)] [--stop-top:oklch(0.5684_0.2129_25.98/0.2)]",
  mid: "[--crest-opacity:0.7] [--layer-ease:var(--ease-mid)] [--layer-zoom:var(--zoom-mid)] [--stop-bottom:oklch(0.5684_0.2129_25.98/0.16)] [--stop-top:oklch(0.5684_0.2129_25.98/0.34)]",
  near: "[--crest-opacity:1] [--layer-ease:var(--ease-near)] [--layer-zoom:var(--zoom-near)] [--stop-bottom:oklch(0.5684_0.2129_25.98/0.3)] [--stop-top:oklch(0.5684_0.2129_25.98/0.56)]",
};

// The mist, glow and scrim fade with the camera, never scale.
const FADES_WITH_ZOOM =
  "[transition:opacity_var(--zoom-duration)_var(--zoom-ease)]";

// Plain polygons, sharp vertices: a round join would stretch into an ellipse under
// preserveAspectRatio="none" and reshape on every resize. Each layer is lit from above — a vertical
// gradient (denser at the summits, thinning into the valley haze) and a pale crest line where the
// light catches the ridge. The crest is non-scaling, so it stays a hairline at 3.2× as well.
const RidgeLayer = ({ depth }: RidgeLayerProps) => {
  const gradientId = `ridge-${depth}-fill`;

  return (
    <div
      data-slot="ridge-layer"
      data-depth={depth}
      className={`${LAYER} ${DEPTHS[depth]}`}
    >
      <svg viewBox={VIEWBOX_ATTRIBUTE} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="[stop-color:var(--stop-top)]" />
            <stop offset="1" className="[stop-color:var(--stop-bottom)]" />
          </linearGradient>
        </defs>
        <polygon points={RIDGE_POLYGONS[depth]} fill={`url(#${gradientId})`} />
        <polyline
          // Where the light catches the ridge. A screen-space hairline (non-scaling), so it stays
          // crisp at every zoom; round joins are safe: they are drawn after the stretch.
          className="fill-none opacity-(--crest-opacity) [stroke-linejoin:round] [stroke-width:1.25px] [stroke:oklch(1_0.01_40/0.62)]"
          points={RIDGE_CRESTS[depth]}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export const RidgeBackground = () => (
  <div
    className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    aria-hidden="true"
  >
    {/* Alpenglow: warm light low behind the range. It belongs to the view from the valley, so it
        goes with the mist when the camera flies in. */}
    <div
      className={`absolute inset-x-0 bottom-0 h-[calc(var(--ridge-height)*1.3)] bg-[radial-gradient(58%_46%_at_50%_64%,oklch(0.88_0.08_48/0.62)_0%,oklch(0.93_0.05_40/0.28)_48%,oklch(0.95_0.03_35/0)_78%)] opacity-(--mist-opacity) ${FADES_WITH_ZOOM}`}
    />
    <RidgeLayer depth="far" />
    <RidgeLayer depth="mid" />
    {/* Mist tracks the near layer's height, drifts, never scales, and fades out when zoomed. */}
    <div
      className={`absolute inset-x-0 bottom-0 h-(--ridge-height) opacity-(--mist-opacity) ${FADES_WITH_ZOOM} animate-[driftMist_26s_ease-in-out_infinite] motion-reduce:animate-none before:absolute before:-inset-x-[10%] before:top-[38%] before:h-[26%] before:bg-[linear-gradient(180deg,oklch(0.9868_0.0074_25/0)_0%,oklch(0.9868_0.0074_25/0.85)_50%,oklch(0.9868_0.0074_25/0)_100%)] before:blur-[14px] before:content-['']`}
    />
    <RidgeLayer depth="near" />
    <div className="absolute inset-x-0 bottom-0 h-[34vh] bg-[linear-gradient(180deg,oklch(0.9437_0.0219_21.01/0)_0%,oklch(0.9437_0.0219_21.01/0.55)_40%,oklch(0.9437_0.0219_21.01/0.9)_100%)]" />
    <div
      className={`absolute inset-0 bg-[linear-gradient(180deg,oklch(0.9829_0.0086_25/0.55)_0%,oklch(0.9829_0.0086_25/0.9)_55%,oklch(0.9829_0.0086_25/0.9)_100%)] opacity-(--scrim-opacity) ${FADES_WITH_ZOOM}`}
    />
  </div>
);
