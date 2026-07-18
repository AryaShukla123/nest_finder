"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Map, BoxSelect, ScatterChart as ScatterIcon, PieChart, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatChip from "@/components/analytics/StatChip";

interface Summary {
  total_listings: number;
  sector_count: number;
  avg_price_per_sqft: number;
  avg_price: number;
  most_expensive_sector: string;
  most_expensive_psf: number;
  cheapest_sector: string;
  cheapest_psf: number;
}

const MODULES = [
  {
    href: "/analytics/spatial",
    title: "Spatial Analysis",
    description: "Interactive Gurugram map, shaded by average price per sector.",
    icon: Map,
  },
  {
    href: "/analytics/price-distribution",
    title: "Price Distribution",
    description: "Boxplot view of price spread across sectors.",
    icon: BoxSelect,
  },
  {
    href: "/analytics/price-vs-area",
    title: "Price vs. Built-up Area",
    description: "Scatter plot of price against square footage, filterable by sector.",
    icon: ScatterIcon,
  },
  {
    href: "/analytics/room-configuration",
    title: "Room Configuration",
    description: "Pie chart breakdown of 1BHK / 2BHK / 3BHK+ share by sector.",
    icon: PieChart,
  },
];

export default function AnalyticsHomePage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/data/analytics_summary.json")
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar activeLabel="Analytics" />
      <main className="bg-surface min-h-screen">
        <div className="max-w-container mx-auto px-6 pt-28 pb-20">
          <div className="mb-10">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-primary bg-primary-light rounded-full px-3 py-1 mb-4">
              <Sparkles className="w-3 h-3" />
              Gurugram · Live listing data
            </div>
            <h1 className="font-display text-3xl md:text-[34px] font-bold text-ink mb-2">Market Analytics</h1>
            <p className="text-muted max-w-2xl text-[15px]">
              Explore how price, size, and configuration vary across Gurugram's sectors — built
              directly from current listing data.
            </p>
          </div>

          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              <StatChip label="Listings analyzed" value={summary.total_listings.toLocaleString("en-IN")} />
              <StatChip label="Sectors covered" value={String(summary.sector_count)} />
              <StatChip label="Avg. price / sqft" value={`₹${summary.avg_price_per_sqft.toLocaleString("en-IN")}`} accent />
              <StatChip label="Avg. price" value={`₹${summary.avg_price} Cr`} accent />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {MODULES.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.title}
                  href={m.href}
                  className="group block rounded-xl border border-border p-6 bg-white transition-all hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-[10px] bg-primary-light flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <ArrowRight className="w-4 h-4 text-border group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h2 className="font-semibold text-ink text-[17px] mb-1.5">{m.title}</h2>
                  <p className="text-sm text-muted leading-relaxed">{m.description}</p>
                </Link>
              );
            })}
          </div>

          {summary && (
            <div className="mt-10 rounded-xl border border-border bg-white p-6 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
              <div>
                <div className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1">Priciest sector</div>
                <div className="text-ink font-semibold">
                  {summary.most_expensive_sector}
                  <span className="text-muted font-normal"> · ₹{summary.most_expensive_psf.toLocaleString("en-IN")}/sqft</span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border" />
              <div>
                <div className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1">Most affordable sector</div>
                <div className="text-ink font-semibold">
                  {summary.cheapest_sector}
                  <span className="text-muted font-normal"> · ₹{summary.cheapest_psf.toLocaleString("en-IN")}/sqft</span>
                </div>
              </div>
              <Link
                href="/analytics/spatial"
                className="sm:ml-auto text-sm font-semibold text-primary hover:underline whitespace-nowrap"
              >
                See it on the map →
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
