"use client";

import { useMemo, useState } from "react";

interface SectorBox {
  q1: number;
  median: number;
  q3: number;
  whisker_low: number;
  whisker_high: number;
  outliers: number[];
  count: number;
}

interface SectorBoxplotEntry {
  sector: string;
  price: SectorBox;
  price_per_sqft: SectorBox;
}

type Metric = "price" | "price_per_sqft";

const METRIC_LABEL: Record<Metric, string> = {
  price: "Price (₹ Cr)",
  price_per_sqft: "Price per sqft (₹)",
};

const BOX_WIDTH = 34;
const GAP = 22;
const CHART_HEIGHT = 380;
const TOP_PAD = 20;
const BOTTOM_PAD = 56;

function formatValue(v: number, metric: Metric) {
  return metric === "price" ? `₹${v.toFixed(2)} Cr` : `₹${v.toLocaleString("en-IN")}`;
}

export default function BoxplotChart({
  data,
  metric,
}: {
  data: SectorBoxplotEntry[];
  metric: Metric;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const { min, max } = useMemo(() => {
    let mn = Infinity;
    let mx = -Infinity;
    data.forEach((d) => {
      const box = d[metric];
      mn = Math.min(mn, box.whisker_low, ...box.outliers);
      mx = Math.max(mx, box.whisker_high, ...box.outliers);
    });
    if (!isFinite(mn) || !isFinite(mx)) return { min: 0, max: 1 };
    const pad = (mx - mn) * 0.06;
    return { min: Math.max(0, mn - pad), max: mx + pad };
  }, [data, metric]);

  const plotHeight = CHART_HEIGHT - TOP_PAD - BOTTOM_PAD;
  const yToPx = (v: number) => TOP_PAD + plotHeight - ((v - min) / (max - min)) * plotHeight;

  const width = data.length * (BOX_WIDTH + GAP) + GAP;

  const ticks = useMemo(() => {
    const n = 5;
    return Array.from({ length: n + 1 }, (_, i) => min + ((max - min) * i) / n);
  }, [min, max]);

  return (
    <div className="relative">
      <div className="overflow-x-auto border border-border rounded-lg bg-white">
        <svg width={width + 60} height={CHART_HEIGHT} className="block">
          {/* gridlines + y axis labels */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={56}
                x2={width + 50}
                y1={yToPx(t)}
                y2={yToPx(t)}
                stroke="#E5E7EB"
                strokeWidth={1}
              />
              <text x={50} y={yToPx(t) + 4} textAnchor="end" fontSize={10} fill="#6B7280">
                {metric === "price" ? t.toFixed(1) : Math.round(t / 1000) + "k"}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const box = d[metric];
            const x = 56 + GAP + i * (BOX_WIDTH + GAP);
            const cx = x + BOX_WIDTH / 2;
            const isHovered = hovered === d.sector;

            return (
              <g
                key={d.sector}
                onMouseEnter={() => setHovered(d.sector)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                {/* whisker line */}
                <line
                  x1={cx}
                  x2={cx}
                  y1={yToPx(box.whisker_high)}
                  y2={yToPx(box.whisker_low)}
                  stroke="#1B4FFF"
                  strokeWidth={1.5}
                  opacity={isHovered ? 1 : 0.55}
                />
                {/* whisker caps */}
                <line x1={cx - 7} x2={cx + 7} y1={yToPx(box.whisker_high)} y2={yToPx(box.whisker_high)} stroke="#1B4FFF" strokeWidth={1.5} opacity={isHovered ? 1 : 0.55} />
                <line x1={cx - 7} x2={cx + 7} y1={yToPx(box.whisker_low)} y2={yToPx(box.whisker_low)} stroke="#1B4FFF" strokeWidth={1.5} opacity={isHovered ? 1 : 0.55} />

                {/* box (Q1-Q3) */}
                <rect
                  x={x}
                  y={yToPx(box.q3)}
                  width={BOX_WIDTH}
                  height={Math.max(1, yToPx(box.q1) - yToPx(box.q3))}
                  fill={isHovered ? "#1B4FFF" : "#93A9F5"}
                  fillOpacity={isHovered ? 0.35 : 0.25}
                  stroke="#1B4FFF"
                  strokeWidth={1.5}
                />

                {/* median line */}
                <line
                  x1={x}
                  x2={x + BOX_WIDTH}
                  y1={yToPx(box.median)}
                  y2={yToPx(box.median)}
                  stroke="#1B4FFF"
                  strokeWidth={2.5}
                />

                {/* outliers */}
                {box.outliers.map((o, oi) => (
                  <circle key={oi} cx={cx} cy={yToPx(o)} r={2.5} fill="#D32F2F" opacity={isHovered ? 1 : 0.5} />
                ))}

                {/* sector label */}
                <text
                  x={cx}
                  y={CHART_HEIGHT - BOTTOM_PAD + 14}
                  textAnchor="end"
                  fontSize={10}
                  fill={isHovered ? "#111827" : "#6B7280"}
                  fontWeight={isHovered ? 600 : 400}
                  transform={`rotate(-55, ${cx}, ${CHART_HEIGHT - BOTTOM_PAD + 14})`}
                >
                  {d.sector.replace("Sector ", "S-")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {hovered && (
        <div className="mt-3 inline-block bg-ink text-white text-xs rounded-lg px-4 py-3">
          {(() => {
            const d = data.find((e) => e.sector === hovered)!;
            const box = d[metric];
            return (
              <div className="space-y-0.5">
                <div className="font-semibold text-[13px] mb-1">{d.sector} · {box.count} listings</div>
                <div>Median: {formatValue(box.median, metric)}</div>
                <div>Q1 – Q3: {formatValue(box.q1, metric)} – {formatValue(box.q3, metric)}</div>
                <div>Range (excl. outliers): {formatValue(box.whisker_low, metric)} – {formatValue(box.whisker_high, metric)}</div>
                {box.outliers.length > 0 && <div>Outliers: {box.outliers.length}</div>}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export { METRIC_LABEL };
export type { SectorBoxplotEntry, Metric };
