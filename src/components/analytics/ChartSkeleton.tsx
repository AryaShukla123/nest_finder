export default function ChartSkeleton({ height = 420 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-lg bg-gradient-to-r from-surface via-border/40 to-surface bg-[length:200%_100%] animate-[shimmer_1.6s_ease-in-out_infinite]"
      style={{ height }}
    />
  );
}
