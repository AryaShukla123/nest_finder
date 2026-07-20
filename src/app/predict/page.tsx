"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Wand2, Home as HomeIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { estimatePriceRange, type PredictionInput, type PredictionListing, type PredictionResult } from "@/lib/predict";

const AGE_OPTIONS = ["New Property", "Relatively New", "Moderately Old", "Old Property", "Under Construction"];
const FURNISHING_OPTIONS = [
  { value: 0, label: "Unfurnished" },
  { value: 1, label: "Semi-Furnished" },
  { value: 2, label: "Furnished" },
];
const LUXURY_TIERS = [
  { value: 22, label: "Basic" },
  { value: 68, label: "Standard" },
  { value: 133, label: "Premium" },
];
const BALCONY_OPTIONS = [
  { value: 0, label: "0" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "3+" },
];

const DEFAULT_INPUT: Omit<PredictionInput, "sector"> = {
  property_type: "flat",
  bedRoom: 2,
  bathroom: 2,
  balcony: 2,
  floorNum: 4,
  agePossession: "Relatively New",
  built_up_area: 1200,
  furnishing_type: 1,
  luxury_score: 68,
  study_room: 0,
  servant_room: 0,
  store_room: 0,
  pooja_room: 0,
};

export default function PredictPage() {
  const [dataset, setDataset] = useState<PredictionListing[] | null>(null);
  const [sectors, setSectors] = useState<string[]>([]);
  const [form, setForm] = useState<PredictionInput>({ sector: "", ...DEFAULT_INPUT });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/prediction_dataset.json").then((r) => {
        if (!r.ok) throw new Error("Failed to load prediction data");
        return r.json();
      }),
      fetch("/data/sector_list.json").then((r) => {
        if (!r.ok) throw new Error("Failed to load sector list");
        return r.json();
      }),
    ])
      .then(([ds, secs]) => {
        setDataset(ds);
        setSectors(secs);
        setForm((f) => ({ ...f, sector: secs[0] }));
      })
      .catch((e) => setError(e.message));
  }, []);

  const canSubmit = useMemo(() => !!dataset && !!form.sector && form.built_up_area > 0, [dataset, form]);

  function update<K extends keyof PredictionInput>(key: K, value: PredictionInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dataset || !canSubmit) return;
    setResult(estimatePriceRange(form, dataset));
  }

  return (
    <>
      <Navbar activeLabel="Price Prediction" />
      <main className="bg-surface min-h-screen">
        <div className="max-w-container mx-auto px-6 pt-28 pb-20">
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-4">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink font-medium">Price Prediction</span>
          </nav>

          <div className="flex items-start gap-4 mb-10">
            <div className="w-11 h-11 rounded-[10px] bg-accent-light flex items-center justify-center flex-shrink-0">
              <Wand2 className="w-5 h-5 text-accent" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-display text-[28px] md:text-3xl font-bold text-ink leading-tight mb-1.5">
                Price Prediction
              </h1>
              <p className="text-muted text-[15px] max-w-2xl">
                Answer a few questions about the flat you're picturing and we'll estimate a realistic
                price range for it, based on similar listings in that sector.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-3 bg-white border border-border rounded-xl shadow-sm p-6 space-y-6"
            >
              <FormSection number={1} title="Location & type">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Sector">
                    <select
                      value={form.sector}
                      onChange={(e) => update("sector", e.target.value)}
                      className="input"
                      required
                    >
                      {sectors.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Property Type">
                    <select
                      value={form.property_type}
                      onChange={(e) => update("property_type", e.target.value)}
                      className="input"
                    >
                      <option value="flat">Flat / Apartment</option>
                      <option value="house">Independent House</option>
                    </select>
                  </Field>
                </div>
              </FormSection>

              <FormSection number={2} title="Size & layout">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Bedrooms (BHK)">
                    <select
                      value={form.bedRoom}
                      onChange={(e) => update("bedRoom", Number(e.target.value))}
                      className="input"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} BHK
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Bathrooms">
                    <select
                      value={form.bathroom}
                      onChange={(e) => update("bathroom", Number(e.target.value))}
                      className="input"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Balconies">
                    <select
                      value={form.balcony}
                      onChange={(e) => update("balcony", Number(e.target.value))}
                      className="input"
                    >
                      {BALCONY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Floor number">
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={form.floorNum}
                      onChange={(e) => update("floorNum", Number(e.target.value))}
                      className="input"
                    />
                  </Field>

                  <Field label="Built-up area (sqft)" className="sm:col-span-2">
                    <input
                      type="number"
                      min={100}
                      max={15000}
                      value={form.built_up_area}
                      onChange={(e) => update("built_up_area", Number(e.target.value))}
                      className="input"
                      required
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection number={3} title="Condition & style">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Age / Possession">
                    <select
                      value={form.agePossession}
                      onChange={(e) => update("agePossession", e.target.value)}
                      className="input"
                    >
                      {AGE_OPTIONS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Furnishing">
                    <select
                      value={form.furnishing_type}
                      onChange={(e) => update("furnishing_type", Number(e.target.value))}
                      className="input"
                    >
                      {FURNISHING_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Luxury / amenities tier" className="sm:col-span-2">
                    <select
                      value={form.luxury_score}
                      onChange={(e) => update("luxury_score", Number(e.target.value))}
                      className="input"
                    >
                      {LUXURY_TIERS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </FormSection>

              <FormSection number={4} title="Additional rooms">
                <div className="flex flex-wrap gap-4">
                  <Checkbox label="Study room" checked={!!form.study_room} onChange={(v) => update("study_room", v ? 1 : 0)} />
                  <Checkbox label="Servant room" checked={!!form.servant_room} onChange={(v) => update("servant_room", v ? 1 : 0)} />
                  <Checkbox label="Store room" checked={!!form.store_room} onChange={(v) => update("store_room", v ? 1 : 0)} />
                  <Checkbox label="Pooja room" checked={!!form.pooja_room} onChange={(v) => update("pooja_room", v ? 1 : 0)} />
                </div>
              </FormSection>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full bg-accent text-white font-semibold rounded-[10px] py-3 hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dataset ? "Estimate price range" : "Loading data…"}
              </button>
            </form>

            {/* result */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 space-y-4">
                {!result && (
                  <div className="bg-white border border-border rounded-xl shadow-sm p-8 text-center">
                    <HomeIcon className="w-8 h-8 text-border mx-auto mb-3" />
                    <p className="text-sm text-muted">
                      Fill in the form and submit to see your estimated price range.
                    </p>
                  </div>
                )}

                {result && (
                  <div className="bg-ink text-white rounded-xl p-6">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60 mb-2">
                      Estimated price range
                    </div>
                    <div className="text-3xl font-bold mb-1">
                      ₹{result.low.toFixed(2)} – {result.high.toFixed(2)} Cr
                    </div>
                    <div className="text-sm text-white/70 mb-4">
                      Most likely around <span className="font-semibold text-white">₹{result.median.toFixed(2)} Cr</span>
                    </div>

                    {/* range bar */}
                    <div className="h-2 rounded-full bg-white/15 relative mb-1">
                      <div className="absolute inset-y-0 left-[15%] right-[15%] bg-white/50 rounded-full" />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white"
                        style={{ left: "50%" }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-white/50">
                      <span>Lower</span>
                      <span>Typical</span>
                      <span>Higher</span>
                    </div>

                    <div className="border-t border-white/15 mt-5 pt-4 space-y-1.5 text-sm text-white/80">
                      <div>
                        Based on <span className="font-semibold text-white">{result.compCount}</span> closest-matching
                        listings
                      </div>
                      {result.sectorMedianPsf && (
                        <div>
                          {form.sector} median: ₹{result.sectorMedianPsf.toLocaleString("en-IN")}/sqft
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {result && result.topComps.length > 0 && (
                  <div className="bg-white border border-border rounded-xl shadow-sm p-5">
                    <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
                      Similar listings used
                    </div>
                    <div className="space-y-3">
                      {result.topComps.slice(0, 5).map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-sm gap-3">
                          <div className="min-w-0">
                            <div className="font-medium text-ink truncate">
                              {c.society ?? "Unnamed society"}
                            </div>
                            <div className="text-xs text-muted">
                              {c.sector} · {c.bedRoom} BHK · {c.built_up_area.toLocaleString("en-IN")} sqft
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-ink whitespace-nowrap">
                            ₹{c.price.toFixed(2)} Cr
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style jsx global>{`
        .input {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          background: white;
          width: 100%;
        }
        .input:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.12);
        }
      `}</style>
    </>
  );
}

function FormSection({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-accent-light/60 rounded-lg p-4 sm:p-5 border border-accent/10">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <span className="text-xs font-semibold text-ink uppercase tracking-wide">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold text-muted mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
      />
      {label}
    </label>
  );
}
