"use client";

interface ImpactBarProps {
  label: string;
  pct: number;
  significant: boolean;
  maxAbs: number;
}

export default function ImpactBar({ label, pct, significant, maxAbs }: ImpactBarProps) {
  const isPositive = pct >= 0;
  const widthPct = Math.min(100, (Math.abs(pct) / Math.max(maxAbs, 1)) * 100);
  const color = !significant ? "#9CA3AF" : isPositive ? "#16A34A" : "#D32F2F";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-ink w-[168px] flex-shrink-0">{label}</span>
      <div className="flex-1 h-6 bg-surface rounded-md relative overflow-hidden">
        <div
          className="h-full rounded-md transition-all"
          style={{
            width: `${widthPct}%`,
            backgroundColor: color,
            opacity: significant ? 0.85 : 0.4,
          }}
        />
      </div>
      <span
        className="text-sm font-semibold w-[92px] text-right flex-shrink-0"
        style={{ color: significant ? color : "#9CA3AF" }}
      >
        {significant ? `${isPositive ? "+" : ""}${pct.toFixed(1)}%` : "~ no effect"}
      </span>
    </div>
  );
}
