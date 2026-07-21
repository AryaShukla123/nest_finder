"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Lightbulb } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChartCard from "@/components/analytics/ChartCard";
import ChartSkeleton from "@/components/analytics/ChartSkeleton";
import ImpactBar from "@/components/analytics/ImpactBar";

interface InsightItem {
  label: string;
  pct: number;
  significant: boolean;
}

interface InsightCard {
  id: string;
  category: string;
  title: string;
  description: string;
  type: "steps" | "binary" | "elasticity";
  baseline?: string;
  elasticity?: number;
  items: InsightItem[];
}

interface SectorPremiumEntry {
  sector: string;
  pct: number;
}

interface InsightsData {
  meta: {
    n_listings: number;
    r_squared: number;
    baseline_sector: string;
    method: string;
  };
  cards: InsightCard[];
  sector_premium: {
    baseline_sector: string;
    top: SectorPremiumEntry[];
    bottom: SectorPremiumEntry[];
  };
}

const CATEGORY_ORDER = ["Layout", "Size", "Interior", "Condition", "Rooms"];

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/insights.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load insights data");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  const grouped = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, InsightCard[]>();
    for (const c of data.cards) {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    }
    return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({ category: c, cards: map.get(c)! }));
  }, [data]);

  const sectorMaxAbs = useMemo(() => {
    if (!data) return 100;
    const all = [...data.sector_premium.top, ...data.sector_premium.bottom].map((s) => Math.abs(s.pct));
    return Math.max(...all, 10);
  }, [data]);

  return (
    <>
      <Navbar activeLabel="Insights" />
      <main className="bg-surface min-h-screen">
        <div className="max-w-container mx-auto px-6 pt-28 pb-20">
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-4">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink font-medium">Insights</span>
          </nav>

          <div className="flex items-start gap-4 mb-8">
            <div className="w-11 h-11 rounded-[10px] bg-primary-light flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-primary" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-display text-[28px] md:text-3xl font-bold text-ink leading-tight mb-1.5">
                What Actually Moves the Price
              </h1>
              <p className="text-muted text-[15px] max-w-2xl">
                A feature-by-feature breakdown of how each property attribute affects price in
                Gurugram — holding everything else equal, so you can see the real effect of each
                change on its own.
              </p>
            </div>
          </div>

          {error && (
            <div className="h-[300px] flex items-center justify-center text-muted border border-border rounded-lg bg-white">
              {error}
            </div>
          )}

          {!error && !data && (
            <div className="space-y-5">
              <ChartSkeleton height={120} />
              <ChartSkeleton height={280} />
              <ChartSkeleton height={280} />
            </div>
          )}

          {data && (
            <>
              <div className="bg-white border border-border rounded-xl p-5 mb-8 flex flex-wrap gap-x-10 gap-y-3">
                <MetaStat label="Listings analyzed" value={data.meta.n_listings.toLocaleString("en-IN")} />
                <MetaStat label="Model fit (R²)" value={data.meta.r_squared.toFixed(2)} />
                <MetaStat label="Baseline sector" value={data.meta.baseline_sector} />
                <p className="text-xs text-muted max-w-md self-center">{data.meta.method}</p>
              </div>

              <div className="space-y-10">
                {grouped.map((group) => (
                  <section key={group.category}>
                    <h2 className="text-xs font-bold uppercase tracking-wide text-primary mb-3">
                      {group.category}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {group.cards.map((card) => (
                        <InsightCardView key={card.id} card={card} />
                      ))}
                    </div>
                  </section>
                ))}

                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wide text-primary mb-3">Location</h2>
                  <ChartCard>
                    <h3 className="font-semibold text-ink mb-1">Sector price premium</h3>
                    <p className="text-sm text-muted mb-5">
                      How much more (or less) an otherwise-identical flat costs, purely because of its
                      sector — relative to {data.sector_premium.baseline_sector}, the most-listed sector
                      in the dataset.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      <div>
                        <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
                          Highest premium
                        </div>
                        <div className="space-y-2.5">
                          {data.sector_premium.top.map((s) => (
                            <ImpactBar
                              key={s.sector}
                              label={s.sector}
                              pct={s.pct}
                              significant
                              maxAbs={sectorMaxAbs}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
                          Lowest premium
                        </div>
                        <div className="space-y-2.5">
                          {data.sector_premium.bottom.map((s) => (
                            <ImpactBar
                              key={s.sector}
                              label={s.sector}
                              pct={s.pct}
                              significant
                              maxAbs={sectorMaxAbs}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </ChartCard>
                </section>
              </div>

              <p className="text-xs text-muted mt-8 border-l-2 border-border pl-3">
                Note: "lift" isn't currently tracked as a field in this dataset, so it isn't included
                above. The room-level features available are study room, servant room, store room, and
                pooja room — all shown in the Rooms section. Effects marked "no effect" were not
                distinguishable from zero in this data and shouldn't be read as a real price penalty or
                premium.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-base font-bold text-ink">{value}</div>
    </div>
  );
}

function InsightCardView({ card }: { card: InsightCard }) {
  const maxAbs = Math.max(...card.items.map((i) => Math.abs(i.pct)), 5);

  return (
    <ChartCard>
      <h3 className="font-semibold text-ink mb-1">{card.title}</h3>
      <p className="text-sm text-muted mb-4">{card.description}</p>
      {card.baseline && (
        <div className="text-[11px] text-muted mb-3">
          Baseline: <span className="font-medium text-ink">{card.baseline}</span>
        </div>
      )}
      <div className="space-y-3">
        {card.items.map((item) => (
          <ImpactBar
            key={item.label}
            label={item.label}
            pct={item.pct}
            significant={item.significant}
            maxAbs={maxAbs}
          />
        ))}
      </div>
      {card.type === "elasticity" && card.elasticity !== undefined && (
        <p className="text-[11px] text-muted mt-4 pt-3 border-t border-border">
          Price rises roughly proportionally to area^{card.elasticity.toFixed(2)} — meaning a 10% bigger
          flat costs about {((Math.pow(1.1, card.elasticity) - 1) * 100).toFixed(1)}% more, other
          features equal.
        </p>
      )}
    </ChartCard>
  );
}
