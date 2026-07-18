interface StatChipProps {
  label: string;
  value: string;
  accent?: boolean;
}

export default function StatChip({ label, value, accent }: StatChipProps) {
  return (
    <div className="rounded-lg border border-border bg-white px-4 py-3 min-w-[140px]">
      <div className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-lg font-bold ${accent ? "text-primary" : "text-ink"}`}>{value}</div>
    </div>
  );
}
