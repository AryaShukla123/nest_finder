"use client";

import { useEffect, useMemo, useState } from "react";
import { BoxSelect } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import ChartCard from "@/components/analytics/ChartCard";
import ChartSkeleton from "@/components/analytics/ChartSkeleton";
import StatChip from "@/components/analytics/StatChip";
import BoxplotChart, { METRIC_LABEL, type SectorBoxplotEntry, type Metric } from "@/components/analytics/BoxplotChart";

type SortMode = "median_desc" | "median_asc" | "count_desc" | "alpha";
type ShowMode = "20" | "40" | "all";

export default function PriceDistributionPage() {
  const [data, setData] = useState<SectorBoxplotEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metric, setMetric] = useState<Metric>("price_per_sqft");
  const [sortMode, setSortMode] = useState<SortMode>("median_desc");
  const [showMode, setShowMode] = useState<ShowMode>("20");

  useEffect(() => {
    fetch("/data/sector_boxplot.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load price distribution data");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  const sorted = useMemo(() => {
    if (!data) return [];
    const copy = [...data];
    switch (sortMode) {
      case "median_desc":
        copy.sort((a, b) => b[metric].median - a[metric].median);
        break;
      case "median_asc":
        copy.sort((a, b) => a[metric].median - b[metric].median);
        break;
      case "count_desc":
        copy.sort((a, b) => b[metric].count - a[metric].count);
        break;
      case "alpha":
        copy.sort((a, b) => a.sector.localeCompare(b.sector));
        break;
    }
    return copy;
  }, [data, metric, sortMode]);

  const visible = useMemo(() => {
    if (showMode === "all") return sorted;
    return sorted.slice(0, Number(showMode));
  }, [sorted, showMode]);

  const highLow = useMemo(() => {
    if (!data || data.length === 0) return null;
    const byMedian = [...data].sort((a, b) => b[metric].median - a[metric].median);
    return { highest: byMedian[0], lowest: byMedian[byMedian.length - 1] };
  }, [data, metric]);

  return (
    <>
      <Navbar activeLabel="Analytics" />
      <main className="bg-surface min-h-screen">
        <div className="max-w-container mx-auto px-6 pt-28 pb-20">
          <AnalyticsHeader
            icon={BoxSelect}
            crumb="Price Distribution"
            title="Price Distribution Across Sectors"
            description="Each box shows the middle 50% of listings in a sector (Q1–Q3), with the median line and whiskers marking the typical range. Red dots are statistical outliers."
          />

          {highLow && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatChip label="Sectors" value={String(data?.length ?? 0)} />
              <StatChip
                label="Highest median"
                value={highLow.highest.sector}
                accent
              />
              <StatChip
                label="Lowest median"
                value={highLow.lowest.sector}
              />
              <StatChip label="Currently showing" value={`${visible.length} sectors`} />
            </div>
          )}

          <ChartCard>
            <div className="flex flex-wrap gap-4 mb-6 items-end">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Metric</label>
                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value as Metric)}
                  className="border border-border rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option value="price_per_sqft">{METRIC_LABEL.price_per_sqft}</option>
                  <option value="price">{METRIC_LABEL.price}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Sort by</label>
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="border border-border rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option value="median_desc">Highest median first</option>
                  <option value="median_asc">Lowest median first</option>
                  <option value="count_desc">Most listings first</option>
                  <option value="alpha">Sector name (A–Z)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Show</label>
                <select
                  value={showMode}
                  onChange={(e) => setShowMode(e.target.value as ShowMode)}
                  className="border border-border rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option value="20">Top 20 sectors</option>
                  <option value="40">Top 40 sectors</option>
                  <option value="all">All {sorted.length || ""} sectors</option>
                </select>
              </div>

              {data && (
                <span className="text-xs text-muted pb-2.5 ml-auto">
                  Scroll horizontally to see more sectors →
                </span>
              )}
            </div>

            {error && (
              <div className="h-[380px] flex items-center justify-center text-muted">{error}</div>
            )}
            {!error && !data && <ChartSkeleton height={380} />}
            {data && <BoxplotChart data={visible} metric={metric} />}
          </ChartCard>
        </div>
      </main>
      <Footer />
    </>
  );
}
