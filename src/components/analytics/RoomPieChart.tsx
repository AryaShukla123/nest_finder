"use client";

import { useMemo, useState } from "react";

interface BreakdownSlice {
  label: string;
  count: number;
}

const COLORS: Record<string, string> = {
  "1 BHK": "#F59E0B",
  "2 BHK": "#1B4FFF",
  "3+ BHK": "#16A34A",
};

const SIZE = 280;
const CENTER = SIZE / 2;
const R_OUTER = 120;
const R_INNER = 62;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(cx, cy, rOuter, endAngle);
  const outerEnd = polarToCartesian(cx, cy, rOuter, startAngle);
  const innerStart = polarToCartesian(cx, cy, rInner, endAngle);
  const innerEnd = polarToCartesian(cx, cy, rInner, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

export default function RoomPieChart({ breakdown, total }: { breakdown: BreakdownSlice[]; total: number }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const slices = useMemo(() => {
    let angle = 0;
    return breakdown
      .filter((b) => b.count > 0)
      .map((b) => {
        const pct = total > 0 ? b.count / total : 0;
        const startAngle = angle;
        const endAngle = angle + pct * 360;
        angle = endAngle;
        return { ...b, pct, startAngle, endAngle };
      });
  }, [breakdown, total]);

  if (total === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-muted border border-border rounded-lg bg-surface">
        No listings for this selection.
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <svg width={SIZE} height={SIZE} className="flex-shrink-0">
        {slices.map((s) => {
          const isHovered = hovered === s.label;
          return (
            <path
              key={s.label}
              d={arcPath(CENTER, CENTER, isHovered ? R_OUTER + 6 : R_OUTER, R_INNER, s.startAngle, s.endAngle)}
              fill={COLORS[s.label] ?? "#6B7280"}
              fillOpacity={isHovered ? 1 : 0.85}
              stroke="#fff"
              strokeWidth={2}
              onMouseEnter={() => setHovered(s.label)}
              onMouseLeave={() => setHovered((h) => (h === s.label ? null : h))}
              style={{ cursor: "pointer", transition: "all 0.15s ease" }}
            />
          );
        })}
        <text x={CENTER} y={CENTER - 4} textAnchor="middle" fontSize={22} fontWeight={700} fill="#111827">
          {total}
        </text>
        <text x={CENTER} y={CENTER + 16} textAnchor="middle" fontSize={11} fill="#6B7280">
          listings
        </text>
      </svg>

      <div className="space-y-3 min-w-[200px]">
        {slices.map((s) => (
          <div
            key={s.label}
            onMouseEnter={() => setHovered(s.label)}
            onMouseLeave={() => setHovered((h) => (h === s.label ? null : h))}
            className={`flex items-center justify-between gap-6 rounded-md px-3 py-2 transition-colors cursor-pointer ${
              hovered === s.label ? "bg-surface" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[s.label] ?? "#6B7280" }} />
              <span className="text-sm font-medium text-ink">{s.label}</span>
            </div>
            <div className="text-sm text-muted whitespace-nowrap">
              {s.count} · {(s.pct * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { BreakdownSlice };
