import { RIDGE_POLYGONS, VIEWBOX } from "@/app/_lib/peaks";

const VIEWBOX_ATTRIBUTE = `0 0 ${VIEWBOX.width} ${VIEWBOX.height}`;

interface RidgeLayerProps {
  depth: "far" | "mid" | "near";
}

// Plain polygons, sharp vertices: a round join would stretch into an ellipse under
// preserveAspectRatio="none" and reshape on every resize.
const RidgeLayer = ({ depth }: RidgeLayerProps) => (
  <div className={`ridge-layer ridge-${depth}`}>
    <svg viewBox={VIEWBOX_ATTRIBUTE} preserveAspectRatio="none">
      <polygon points={RIDGE_POLYGONS[depth]} />
    </svg>
  </div>
);

export const RidgeBackground = () => (
  <div className="ridge" aria-hidden="true">
    <RidgeLayer depth="far" />
    <RidgeLayer depth="mid" />
    <div className="ridge-mist" />
    <RidgeLayer depth="near" />
    <div className="ridge-fade" />
    <div className="ridge-scrim" />
  </div>
);
