// A radial diagram of a paddock rotation: the herd occupies one paddock while
// the others rest. This is the literal mechanism the course teaches (and the
// thing the "Charts" tool behind the paywall lets a farmer plan for their own
// land), so it earns the spot as the page's one signature element.

const PADDOCK_COUNT = 8;
const CURRENT_INDEX = 2; // 0-indexed — the paddock the herd is in right now
const CX = 170;
const CY = 170;
const R_OUTER = 150;
const R_INNER = 96;
const GAP_DEG = 2.2;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function donutSegmentPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number
) {
  const outerStart = polarToCartesian(cx, cy, rOuter, startDeg);
  const outerEnd = polarToCartesian(cx, cy, rOuter, endDeg);
  const innerStart = polarToCartesian(cx, cy, rInner, endDeg);
  const innerEnd = polarToCartesian(cx, cy, rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

// distance (in segments, going backwards) from the current paddock —
// used to fade recently-grazed paddocks from "just left" to "long rested"
function recoveryShade(distanceBack: number) {
  if (distanceBack === 0) return "#9A3324"; // redoxide — herd is here today
  if (distanceBack <= 2) return "#C9A656"; // veldgold — recently grazed, just resting
  return "#5C7A52"; // healed — well into its rest
}

export function RotationRing() {
  const segmentDeg = 360 / PADDOCK_COUNT;

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <svg viewBox="0 0 340 340" className="w-full" role="img" aria-label="Diagram of an 8-paddock grazing rotation, with the herd currently in one paddock while the rest recover">
        {Array.from({ length: PADDOCK_COUNT }).map((_, i) => {
          const start = i * segmentDeg + GAP_DEG / 2;
          const end = (i + 1) * segmentDeg - GAP_DEG / 2;
          const distanceBack = (i - CURRENT_INDEX + PADDOCK_COUNT) % PADDOCK_COUNT;
          const isCurrent = i === CURRENT_INDEX;

          return (
            <path
              key={i}
              d={donutSegmentPath(CX, CY, R_OUTER, R_INNER, start, end)}
              fill={recoveryShade(distanceBack)}
              opacity={isCurrent ? 1 : 0.85}
              className={isCurrent ? "animate-pulse" : undefined}
              style={{ animationDuration: "3s" }}
            />
          );
        })}

        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          className="fill-soil font-mono text-[34px] font-medium"
        >
          14
        </text>
        <text
          x={CX}
          y={CY + 20}
          textAnchor="middle"
          className="fill-soil/60 font-body text-[11px] uppercase tracking-wide"
        >
          days into rest
        </text>
      </svg>

      <div className="mt-4 flex items-center justify-center gap-5 font-mono text-[11px] uppercase tracking-wide text-soil/60">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-redoxide" /> grazing today
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-veldgold" /> just rested
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-healed" /> long rested
        </span>
      </div>
    </div>
  );
}
