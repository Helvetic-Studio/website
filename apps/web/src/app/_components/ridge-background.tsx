import { RIDGE_CRESTS, RIDGE_POLYGONS, VIEWBOX } from "@/app/_lib/peaks";

const VIEWBOX_ATTRIBUTE = `0 0 ${VIEWBOX.width} ${VIEWBOX.height}`;

interface RidgeLayerProps {
  depth: "far" | "mid" | "near";
}

// Plain polygons, sharp vertices: a round join would stretch into an ellipse under
// preserveAspectRatio="none" and reshape on every resize. Each layer is lit from above — a vertical
// gradient (denser at the summits, thinning into the valley haze) and a pale crest line where the
// light catches the ridge. The crest is non-scaling, so it stays a hairline at 3.2× as well.
const RidgeLayer = ({ depth }: RidgeLayerProps) => {
  const gradientId = `ridge-${depth}-fill`;

  return (
    <div className={`ridge-layer ridge-${depth}`}>
      <svg viewBox={VIEWBOX_ATTRIBUTE} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="ridge-stop-top" />
            <stop offset="1" className="ridge-stop-bottom" />
          </linearGradient>
        </defs>
        <polygon points={RIDGE_POLYGONS[depth]} fill={`url(#${gradientId})`} />
        <polyline
          className="ridge-crest"
          points={RIDGE_CRESTS[depth]}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export const RidgeBackground = () => (
  <div className="ridge" aria-hidden="true">
    <div className="ridge-glow" />
    <RidgeLayer depth="far" />
    <RidgeLayer depth="mid" />
    <div className="ridge-mist" />
    <RidgeLayer depth="near" />
    <div className="ridge-fade" />
    <div className="ridge-scrim" />
  </div>
);
