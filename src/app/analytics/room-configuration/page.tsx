"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart as PieIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import ChartCard from "@/components/analytics/ChartCard";
import ChartSkeleton from "@/components/analytics/ChartSkeleton";
import StatChip from "@/components/analytics/StatChip";
import RoomPieChart, { type BreakdownSlice } from "@/components/analytics/RoomPieChart";

const ALL_SECTORS = "All Gurugram";

interface SectorDist {
  total: number;
  breakdown: BreakdownSlice[];
}

export default function RoomConfigurationPage() {
  const [data, setData] = useState<Record<string, SectorDist> | null>(null);
  const [sectors, setSectors] = useState<string[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>(ALL_SECTORS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/room_distribution.json").then((r) => {
        if (!r.ok) throw new Error("Failed to load room distribution data");
        return r.json();
      }),
      fetch("/data/sector_list.json").then((r) => {
        if (!r.ok) throw new Error("Failed to load sector list");
        return r.json();
      }),
    ])
      .then(([dist, secs]) => {
        setData(dist);
        setSectors(secs);
      })
      .catch((e) => setError(e.message));
  }, []);

  const current = useMemo(() => {
    if (!data) return null;
    return data[selectedSector] ?? null;
  }, [data, selectedSector]);

  const dominant = useMemo(() => {
    if (!current || current.total === 0) return null;
    return [...current.breakdown].sort((a, b) => b.count - a.count)[0];
  }, [current]);

  return (
    <>
      <Navbar activeLabel="Analytics" />
      <main className="bg-surface min-h-screen">
        <div className="max-w-container mx-auto px-6 pt-28 pb-20">
          <AnalyticsHeader
            icon={PieIcon}
            crumb="Room Configuration"
            title="Room Configuration"
            description="Share of 1BHK, 2BHK, and 3BHK+ listings — pick a sector to see its specific mix, or view all of Gurugram together."
          />

          {current && dominant && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatChip label="Listings" value={String(current.total)} />
              <StatChip label="Most common" value={dominant.label} accent />
              <StatChip
                label="Share"
                value={`${((dominant.count / current.total) * 100).toFixed(0)}%`}
                accent
              />
              <StatChip label="Scope" value={selectedSector} />
            </div>
          )}

          <ChartCard>
            <div className="mb-8">
              <label className="block text-xs font-semibold text-muted mb-1.5">Sector</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="border border-border rounded-md px-3 py-2 text-sm bg-white min-w-[220px]"
              >
                <option value={ALL_SECTORS}>{ALL_SECTORS} ({data?.[ALL_SECTORS]?.total ?? 0} listings)</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="h-[280px] flex items-center justify-center text-muted">{error}</div>}
            {!error && !data && <ChartSkeleton height={280} />}
            {current && <RoomPieChart breakdown={current.breakdown} total={current.total} />}
          </ChartCard>
        </div>
      </main>
      <Footer />
    </>
  );
}
