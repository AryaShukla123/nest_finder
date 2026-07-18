"use client";

import { useEffect, useMemo, useState } from "react";
import { ScatterChart as ScatterIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import ChartCard from "@/components/analytics/ChartCard";
import ChartSkeleton from "@/components/analytics/ChartSkeleton";
import StatChip from "@/components/analytics/StatChip";
import ScatterChart, { type ScatterPoint } from "@/components/analytics/ScatterChart";

const ALL_SECTORS = "__all__";

function median(nums: number[]) {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export default function PriceVsAreaPage() {
  const [points, setPoints] = useState<ScatterPoint[] | null>(null);
  const [sectors, setSectors] = useState<string[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>(ALL_SECTORS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/scatter_data.json").then((r) => {
        if (!r.ok) throw new Error("Failed to load scatter data");
        return r.json();
      }),
      fetch("/data/sector_list.json").then((r) => {
        if (!r.ok) throw new Error("Failed to load sector list");
        return r.json();
      }),
    ])
      .then(([pts, secs]) => {
        setPoints(pts);
        setSectors(secs);
      })
      .catch((e) => setError(e.message));
  }, []);

  const filtered = useMemo(() => {
    if (!points) return [];
    if (selectedSector === ALL_SECTORS) return points;
    return points.filter((p) => p.sector === selectedSector);
  }, [points, selectedSector]);

  const stats = useMemo(() => {
    if (filtered.length === 0) return null;
    return {
      medianPrice: median(filtered.map((p) => p.price)),
      medianArea: median(filtered.map((p) => p.area)),
    };
  }, [filtered]);

  return (
    <>
      <Navbar activeLabel="Analytics" />
      <main className="bg-surface min-h-screen">
        <div className="max-w-container mx-auto px-6 pt-28 pb-20">
          <AnalyticsHeader
            icon={ScatterIcon}
            crumb="Price vs. Built-up Area"
            title="Price vs. Built-up Area"
            description="Each dot is one listing, colored by configuration. Use the filter to zoom into a single sector or compare against all of Gurugram."
          />

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatChip label="Listings shown" value={String(filtered.length)} />
              <StatChip label="Median price" value={`₹${stats.medianPrice.toFixed(2)} Cr`} accent />
              <StatChip label="Median area" value={`${Math.round(stats.medianArea).toLocaleString("en-IN")} sqft`} accent />
              <StatChip
                label="Scope"
                value={selectedSector === ALL_SECTORS ? "All Gurugram" : selectedSector}
              />
            </div>
          )}

          <ChartCard>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-muted mb-1.5">Sector</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="border border-border rounded-md px-3 py-2 text-sm bg-white min-w-[220px]"
              >
                <option value={ALL_SECTORS}>All Gurugram ({points?.length ?? 0} listings)</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="h-[460px] flex items-center justify-center text-muted">{error}</div>}
            {!error && !points && <ChartSkeleton height={460} />}
            {points && filtered.length === 0 && (
              <div className="h-[460px] flex items-center justify-center text-muted">
                No listings found for this sector.
              </div>
            )}
            {points && filtered.length > 0 && <ScatterChart points={filtered} />}
          </ChartCard>
        </div>
      </main>
      <Footer />
    </>
  );
}
