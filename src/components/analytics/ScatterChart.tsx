"use client";

import { useMemo, useState } from "react";

interface ScatterPoint {
  sector: string;
  price: number;
  area: number;
  bhk: number;
  type: string;
  society: string | null;
}

const BHK_COLORS: Record<number, string> = {
  1: "#F59E0B",
  2: "#1B4FFF",
  3: "#16A34A",
  4: "#D32F2F",
  5: "#9333EA",
};
const OTHER_COLOR = "#6B7280";

function colorForBhk(bhk: number) {
  return BHK_COLORS[bhk] ?? OTHER_COLOR;
}

function percentile(sorted: number[], p: number) {
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

const WIDTH = 780;
const HEIGHT = 460;
const PAD_LEFT = 64;
const PAD_BOTTOM = 48;
const PAD_TOP = 16;
const PAD_RIGHT = 20;

export default function ScatterChart({ points }: { points: ScatterPoint[] }) {
  const [hovered, setHovered] = useState<ScatterPoint | null>(null);

  const { xDomain, yDomain, visible, excludedCount } = useMemo(() => {
    if (points.length === 0) {
      return { xDomain: [0, 1] as [number, number], yDomain: [0, 1] as [number, number], visible: [], excludedCount: 0 };
    }
    const areas = [...points.map((p) => p.area)].sort((a, b) => a - b);
    const prices = [...points.map((p) => p.price)].sort((a, b) => a - b);
    const xMax = percentile(areas, 0.98);
    const yMax = percentile(prices, 0.98);
    const xDomain: [number, number] = [0, xMax * 1.05];
    const yDomain: [number, number] = [0, yMax * 1.08];
    const vis = points.filter((p) => p.area <= xDomain[1] && p.price <= yDomain[1]);
    return { xDomain, yDomain, visible: vis, excludedCount: points.length - vis.length };
  }, [points]);

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const xToPx = (v: number) => PAD_LEFT + (v / xDomain[1]) * plotW;
  const yToPx = (v: number) => PAD_TOP + plotH - (v / yDomain[1]) * plotH;

  const xTicks = useMemo(() => Array.from({ length: 6 }, (_, i) => (xDomain[1] * i) / 5), [xDomain]);
  const yTicks = useMemo(() => Array.from({ length: 6 }, (_, i) => (yDomain[1] * i) / 5), [yDomain]);

  const bhkPresent = useMemo(() => {
    const s = new Set(points.map((p) => p.bhk));
    return Array.from(s).sort((a, b) => a - b);
  }, [points]);

  return (
    <div>
      <div className="overflow-x-auto border border-border rounded-lg bg-white">
        <svg width={WIDTH} height={HEIGHT} className="block">
          {/* gridlines */}
          {yTicks.map((t, i) => (
            <g key={`y${i}`}>
              <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={yToPx(t)} y2={yToPx(t)} stroke="#E5E7EB" strokeWidth={1} />
              <text x={PAD_LEFT - 8} y={yToPx(t) + 4} textAnchor="end" fontSize={10} fill="#6B7280">
                ₹{t.toFixed(1)}Cr
              </text>
            </g>
          ))}
          {xTicks.map((t, i) => (
            <g key={`x${i}`}>
              <line x1={xToPx(t)} x2={xToPx(t)} y1={PAD_TOP} y2={HEIGHT - PAD_BOTTOM} stroke="#F3F4F6" strokeWidth={1} />
              <text x={xToPx(t)} y={HEIGHT - PAD_BOTTOM + 18} textAnchor="middle" fontSize={10} fill="#6B7280">
                {Math.round(t)}
              </text>
            </g>
          ))}

          {/* axis labels */}
          <text x={PAD_LEFT + plotW / 2} y={HEIGHT - 6} textAnchor="middle" fontSize={11} fill="#374151" fontWeight={600}>
            Built-up Area (sqft)
          </text>
          <text
            x={-(PAD_TOP + plotH / 2)}
            y={16}
            textAnchor="middle"
            fontSize={11}
            fill="#374151"
            fontWeight={600}
            transform="rotate(-90)"
          >
            Price (₹ Crore)
          </text>

          {/* points */}
          {visible.map((p, i) => {
            const isHovered = hovered === p;
            return (
              <circle
                key={i}
                cx={xToPx(p.area)}
                cy={yToPx(p.price)}
                r={isHovered ? 6 : 4}
                fill={colorForBhk(p.bhk)}
                fillOpacity={isHovered ? 0.95 : 0.55}
                stroke={isHovered ? "#111827" : "none"}
                strokeWidth={isHovered ? 1.5 : 0}
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered((h) => (h === p ? null : h))}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        <div className="flex items-center gap-4 flex-wrap">
          {bhkPresent.map((bhk) => (
            <div key={bhk} className="flex items-center gap-1.5 text-xs text-muted">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorForBhk(bhk) }} />
              {bhk} BHK
            </div>
          ))}
        </div>
        {excludedCount > 0 && (
          <span className="text-xs text-muted">
            {excludedCount} extreme outlier{excludedCount === 1 ? "" : "s"} outside chart range hidden
          </span>
        )}
      </div>

      {hovered && (
        <div className="mt-3 inline-block bg-ink text-white text-xs rounded-lg px-4 py-3">
          <div className="font-semibold text-[13px] mb-1">
            {hovered.society ?? "Unnamed society"} · {hovered.sector}
          </div>
          <div>{hovered.bhk} BHK {hovered.type}</div>
          <div>{hovered.area.toLocaleString("en-IN")} sqft · ₹{hovered.price.toFixed(2)} Cr</div>
        </div>
      )}
    </div>
  );
}

export type { ScatterPoint };
