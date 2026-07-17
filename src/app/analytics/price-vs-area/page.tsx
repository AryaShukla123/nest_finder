"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScatterChart, { type ScatterPoint } from "@/components/analytics/ScatterChart";

const ALL_SECTORS = "__all__";

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
          <h1 className="font-display text-3xl font-bold text-ink mt-3 mb-2">Price vs. Built-up Area</h1>
          <p className="text-muted max-w-2xl">
            Each dot is one listing, colored by configuration. Use the filter to zoom into a single
            sector or compare against all of Gurugram.
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-muted mb-1">Sector</label>
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

        {error && (
          <div className="h-[460px] flex items-center justify-center text-muted border border-border rounded-lg bg-surface">
            {error}
          </div>
        )}

        {!error && !points && (
          <div className="h-[460px] flex items-center justify-center text-muted border border-border rounded-lg bg-surface">
            Loading…
          </div>
        )}

        {points && filtered.length === 0 && (
          <div className="h-[460px] flex items-center justify-center text-muted border border-border rounded-lg bg-surface">
            No listings found for this sector.
          </div>
        )}

        {points && filtered.length > 0 && (
          <>
            <p className="text-xs text-muted mb-3">{filtered.length} listings shown</p>
            <ScatterChart points={filtered} />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
