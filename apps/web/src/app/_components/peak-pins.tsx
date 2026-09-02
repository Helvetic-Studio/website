import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import type { Cairn, Gateway } from "@/app/_lib/peaks";
import { PEAKS, pinPosition } from "@/app/_lib/peaks";

const ENTRANCE_DELAY_MS = 200;
const ENTRANCE_STAGGER_MS = 90;

const GATEWAY_ICONS: Record<string, ReactNode> = {
  "/services": (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
    </svg>
  ),
  "/work": (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" opacity="0.35" />
    </svg>
  ),
  "/about": (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="9" cy="12" r="5.5" />
      <circle cx="15" cy="12" r="5.5" />
    </svg>
  ),
  "/contact": (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 7 12 13.2 20.5 7" />
    </svg>
  ),
};

const GATEWAY_ORDER = new Map(
  PEAKS.filter((peak) => peak.kind === "gateway").map((peak, index) => [
    peak,
    index,
  ])
);

const positionStyle = (summit: { x: number; y: number }): CSSProperties => {
  const { left, top } = pinPosition(summit);
  return { left: `${left}%`, top: `${top}%` };
};

interface GatewayPinProps {
  gateway: Gateway;
  order: number;
}

// The visible label is the accessible name. The whole ~72×95px column is the target.
const GatewayPin = ({ gateway, order }: GatewayPinProps) => {
  const entrance: CSSProperties & Record<"--pin-delay", string> = {
    "--pin-delay": `${ENTRANCE_DELAY_MS + order * ENTRANCE_STAGGER_MS}ms`,
  };

  return (
    <div className="pin" style={positionStyle(gateway)}>
      <div className="pin-body">
        <Link href={gateway.route} className="pin-gateway" style={entrance}>
          <span className="pin-dot" />
          <span className="pin-stem" />
          <span className="pin-disc">{GATEWAY_ICONS[gateway.route]}</span>
          <span className="pin-label">{gateway.label}</span>
        </Link>
      </div>
    </div>
  );
};

// TODO: confirm the cairn treatment by eye — specified but never rendered during planning.
const CairnPin = ({ cairn }: { cairn: Cairn }) => (
  <div className="pin" style={positionStyle(cairn)} aria-hidden="true">
    <div className="pin-body pin-body-cairn">
      <span className="pin-cairn" />
    </div>
  </div>
);

export const PeakPins = () => (
  <nav aria-label="Site sections" className="pins">
    {PEAKS.map((peak) =>
      peak.kind === "cairn" ? (
        <CairnPin key={`cairn-${peak.x}`} cairn={peak} />
      ) : (
        <GatewayPin
          key={peak.route}
          gateway={peak}
          order={GATEWAY_ORDER.get(peak) ?? 0}
        />
      )
    )}
  </nav>
);
