import type { ReactNode } from "react";

export default function ChartCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-border rounded-xl shadow-sm p-6 ${className}`}>{children}</div>
  );
}
