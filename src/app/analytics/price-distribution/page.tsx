"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

  return (
    <>
      <Navbar activeLabel="Analytics" />
      <main className="max-w-container mx-auto px-6 pt-28 pb-20">
        <div className="mb-6">
          <Link 
            href="/analytics" 
            className="group inline-flex items-center gap-2 rounded-lg border-2 border-orange-500 bg-white px-4 py-2 text-sm font-semibold text-orange-500 shadow-sm transition-all hover:bg-orange-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="transition-transform group-hover:-translate-x-0.5"
            >
              <path d="M19 12H5"/>
              <path d="m12 19-7-7 7-7"/>
            </svg>
            Back to Analytics
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink mt-3 mb-2">Price Distribution Across Sectors</h1>
          <p className="text-muted max-w-2xl">
            Each box shows the middle 50% of listings in a sector (Q1–Q3), with the median line and
            whiskers marking the typical range. Red dots are statistical outliers.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-5 items-end">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Metric</label>
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
            <label className="block text-xs font-semibold text-muted mb-1">Sort by</label>
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
            <label className="block text-xs font-semibold text-muted mb-1">Show</label>
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
            <span className="text-xs text-muted pb-2">
              Showing {visible.length} of {data.length} sectors · scroll horizontally to see more
            </span>
          )}
        </div>

        {error && (
          <div className="h-[380px] flex items-center justify-center text-muted border border-border rounded-lg bg-surface">
            {error}
          </div>
        )}

        {!error && !data && (
          <div className="h-[380px] flex items-center justify-center text-muted border border-border rounded-lg bg-surface">
            Loading…
          </div>
        )}

        {data && <BoxplotChart data={visible} metric={metric} />}
      </main>
      <Footer />
    </>
  );
}
