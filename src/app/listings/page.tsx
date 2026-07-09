"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllProperties } from "@/data/properties";
import { usePropertyFilters } from "@/lib/usePropertyFilters";
import {
  Property,
  PropertyFilters,
  PropertyType,
  Furnishing,
  PostedBy,
  SortOption,
} from "@/types/property";

// ─── data ────────────────────────────────────────────────────────────────────
const allProperties = getAllProperties();

const CITY_OPTIONS = [
  { value: "Lucknow", count: 12 },
  { value: "Mumbai", count: 8 },
  { value: "Bengaluru", count: 6 },
  { value: "Hyderabad", count: 4 },
  { value: "Pune", count: 4 },
  { value: "Delhi NCR", count: 5 },
  { value: "Noida", count: 3 },
  { value: "Gurugram", count: 3 },
];

const TYPE_OPTIONS: PropertyType[] = [
  "Apartment",
  "Independent House",
  "Villa",
  "Studio",
  "Plot",
];

const BHK_OPTIONS = ["1", "2", "3", "4", "4+"];
const FURNISH_OPTIONS: Furnishing[] = ["Furnished", "Semi-Furnished", "Unfurnished"];
const POSTED_OPTIONS: PostedBy[] = ["Owner", "Agent", "Builder"];
const BUDGET_PRESETS = [
  { label: "Under ₹30L", min: 0, max: 30 },
  { label: "₹30–60L", min: 30, max: 60 },
  { label: "₹60L–1Cr", min: 60, max: 100 },
  { label: "₹1–2Cr", min: 100, max: 200 },
  { label: "₹2Cr+", min: 200, max: 500 },
];

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmtBudget(v: number) {
  if (v >= 100) return `₹${(v / 100) % 1 === 0 ? v / 100 : (v / 100).toFixed(1)}Cr`;
  return `₹${v}L`;
}

function toggleArr<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

// ─── Suspense wrapper (required for useSearchParams in App Router) ────────────
export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-muted text-sm">
        Loading…
      </div>
    }>
      <ListingsInner />
    </Suspense>
  );
}

// ─── main component ───────────────────────────────────────────────────────────
function ListingsInner() {
  const params = useSearchParams();
  const initialSearch = params.get("q") ?? "";
  const initialType = params.get("type") === "rent" ? "rent" as const : null;

  const {
    filters, updateFilter, resetFilters,
    sort, setSort,
    page, setPage,
    totalPages, paginated, totalCount,
  } = usePropertyFilters(allProperties, {
    search: initialSearch,
    listingType: initialType,
  });

  const [activeTab, setActiveTab] = useState(initialType === "rent" ? "rent" : "buy");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [budgetPreset, setBudgetPreset] = useState<string | null>(null);

  function handleTab(tab: string) {
    setActiveTab(tab);
    if (tab === "buy") updateFilter("listingType", "buy");
    else if (tab === "rent") updateFilter("listingType", "rent");
    else updateFilter("listingType", null);
  }

  function goPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // active filter chip list
  const chips: { label: string; remove: () => void }[] = [];
  if (filters.listingType)
    chips.push({ label: filters.listingType === "buy" ? "For Sale" : "For Rent", remove: () => updateFilter("listingType", null) });
  filters.cities.forEach((c) =>
    chips.push({ label: c, remove: () => updateFilter("cities", filters.cities.filter((x) => x !== c)) })
  );
  if (filters.search.trim())
    chips.push({ label: `"${filters.search}"`, remove: () => updateFilter("search", "") });
  if (filters.budgetMinLac > 0 || filters.budgetMaxLac < 500)
    chips.push({
      label: `${fmtBudget(filters.budgetMinLac)} – ${filters.budgetMaxLac >= 500 ? "₹5Cr+" : fmtBudget(filters.budgetMaxLac)}`,
      remove: () => { updateFilter("budgetMinLac", 0); updateFilter("budgetMaxLac", 500); setBudgetPreset(null); },
    });

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-[68px] flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="w-9 h-9 bg-[#1B4FFF] rounded-[9px] flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.7 2 11h3v9h6v-6h2v6h6v-9h3L12 2.7z"/></svg>
            </span>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Nest<span className="text-[#1B4FFF]">Finder</span>
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {["Buy", "Rent", "New Projects", "Commercial", "Plot", "Agents"].map((l) => (
              <Link key={l} href={l === "Buy" || l === "Rent" ? "/listings" : "#"}
                className="text-sm font-medium px-3 py-1.5 rounded-md text-gray-600 hover:bg-blue-50 hover:text-[#1B4FFF] transition-colors">
                {l}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-2.5 ml-auto">
            <button className="text-sm font-semibold text-[#1B4FFF] border-[1.5px] border-[#1B4FFF] rounded-lg px-4 py-1.5 flex items-center gap-2 hover:bg-blue-50 transition-colors">
              Post Property
              <span className="text-[10px] font-bold bg-[#FF6B35] text-white px-1.5 py-0.5 rounded">Free</span>
            </button>
            <button className="text-sm font-semibold text-white bg-[#1B4FFF] rounded-lg px-5 py-2 hover:bg-[#1440CC] transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ── Page header (dark search bar) ── */}
      <div className="bg-gray-900 pt-[68px]">
        <div className="max-w-[1200px] mx-auto px-6 py-5">
          {/* Tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto">
            {["buy", "rent", "new", "commercial"].map((tab) => (
              <button key={tab} onClick={() => handleTab(tab)}
                className={`text-[13px] font-semibold rounded-md px-4 py-2 whitespace-nowrap transition-colors capitalize ${
                  activeTab === tab
                    ? "bg-[#1B4FFF] text-white"
                    : "text-white/55 hover:bg-white/10 hover:text-white"
                }`}>
                {tab === "buy" ? "Buy" : tab === "rent" ? "Rent" : tab === "new" ? "New Projects" : "Commercial"}
              </button>
            ))}
          </div>
          {/* Search bar */}
          <div className="flex items-center bg-white rounded-xl overflow-hidden">
            <span className="px-4 text-gray-400">
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className="w-5 h-5"><circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="M21 21l-4.3-4.3"/></svg>
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Search locality, project or city…"
              className="flex-1 h-12 outline-none text-sm text-gray-900"
            />
            <button className="h-12 px-8 bg-[#1B4FFF] text-white text-sm font-bold hover:bg-[#1440CC] transition-colors flex-shrink-0">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 flex gap-6 items-start">

        {/* Mobile filter backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Sidebar ── */}
        <aside className={`
          w-[270px] flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden
          lg:sticky lg:top-[84px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto
          fixed top-0 bottom-0 z-50 max-h-screen overflow-y-auto transition-all duration-200
          ${sidebarOpen ? "left-0" : "-left-[300px] lg:left-auto"}
        `}>
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[#1B4FFF]">
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className="w-4 h-4"><path strokeLinecap="round" d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M22 18h0"/><circle cx="16" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="6" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="18" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
              </span>
              Filters
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => { resetFilters(); setBudgetPreset(null); }} className="text-xs font-semibold text-[#FF6B35] hover:bg-orange-50 px-2 py-1 rounded transition-colors">
                Clear All
              </button>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600 text-xl leading-none px-1">×</button>
            </div>
          </div>

          {/* City */}
          <FilterSection title="City">
            <div className="flex flex-col gap-1">
              {CITY_OPTIONS.map((c) => (
                <label key={c.value} className="flex items-center gap-2.5 text-[13px] text-gray-700 cursor-pointer px-1.5 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  <input type="checkbox" checked={filters.cities.includes(c.value)}
                    onChange={() => updateFilter("cities", toggleArr(filters.cities, c.value))}
                    className="w-[15px] h-[15px] accent-[#1B4FFF]" />
                  {c.value}
                  <span className="ml-auto text-[11px] text-gray-400 bg-gray-100 rounded px-1.5">{c.count}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Budget */}
          <FilterSection title="Budget">
            <div className="text-[13px] font-semibold text-[#1B4FFF] text-center pb-2">
              {fmtBudget(filters.budgetMinLac)} – {filters.budgetMaxLac >= 500 ? "₹5Cr+" : fmtBudget(filters.budgetMaxLac)}
            </div>
            <div className="flex gap-1.5 flex-wrap mb-2">
              {BUDGET_PRESETS.map((p) => (
                <button key={p.label} onClick={() => {
                  updateFilter("budgetMinLac", p.min);
                  updateFilter("budgetMaxLac", p.max);
                  setBudgetPreset(p.label);
                }}
                  className={`text-[11px] font-medium rounded-full px-2.5 py-1 border transition-colors ${
                    budgetPreset === p.label
                      ? "bg-[#1B4FFF] text-white border-[#1B4FFF]"
                      : "text-[#1B4FFF] bg-blue-50 border-blue-200 hover:bg-[#1B4FFF] hover:text-white"
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Property Type */}
          <FilterSection title="Property Type">
            <div className="flex flex-col gap-1">
              {TYPE_OPTIONS.map((t) => (
                <label key={t} className="flex items-center gap-2.5 text-[13px] text-gray-700 cursor-pointer px-1.5 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  <input type="checkbox" checked={filters.types.includes(t)}
                    onChange={() => updateFilter("types", toggleArr(filters.types, t))}
                    className="w-[15px] h-[15px] accent-[#1B4FFF]" />
                  {t}
                </label>
              ))}
            </div>
          </FilterSection>

          {/* BHK */}
          <FilterSection title="BHK Type">
            <div className="flex flex-wrap gap-1.5">
              {BHK_OPTIONS.map((b) => (
                <button key={b} onClick={() => updateFilter("bhk", toggleArr(filters.bhk, b))}
                  className={`text-xs font-medium rounded-full px-3.5 py-1.5 border-[1.5px] transition-colors ${
                    filters.bhk.includes(b)
                      ? "text-[#1B4FFF] bg-blue-50 border-[#1B4FFF]"
                      : "text-gray-400 bg-gray-50 border-gray-200 hover:border-[#1B4FFF] hover:text-[#1B4FFF]"
                  }`}>
                  {b} BHK
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Furnishing */}
          <FilterSection title="Furnishing">
            <div className="flex flex-wrap gap-1.5">
              {FURNISH_OPTIONS.map((f) => (
                <button key={f} onClick={() => updateFilter("furnishing", toggleArr(filters.furnishing, f))}
                  className={`text-xs font-medium rounded-full px-3.5 py-1.5 border-[1.5px] transition-colors ${
                    filters.furnishing.includes(f)
                      ? "text-[#1B4FFF] bg-blue-50 border-[#1B4FFF]"
                      : "text-gray-400 bg-gray-50 border-gray-200 hover:border-[#1B4FFF] hover:text-[#1B4FFF]"
                  }`}>
                  {f === "Semi-Furnished" ? "Semi" : f}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Posted By */}
          <FilterSection title="Posted By">
            <div className="flex flex-col gap-1">
              {POSTED_OPTIONS.map((p) => (
                <label key={p} className="flex items-center gap-2.5 text-[13px] text-gray-700 cursor-pointer px-1.5 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  <input type="checkbox" checked={filters.postedBy.includes(p)}
                    onChange={() => updateFilter("postedBy", toggleArr(filters.postedBy, p))}
                    className="w-[15px] h-[15px] accent-[#1B4FFF]" />
                  {p === "Agent" ? "Agent / Broker" : p}
                </label>
              ))}
            </div>
          </FilterSection>

          <div className="px-4 pt-2 pb-4">
            <button onClick={() => setSidebarOpen(false)}
              className="w-full h-11 bg-[#1B4FFF] text-white text-sm font-bold rounded-xl hover:bg-[#1440CC] transition-colors">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* ── Results ── */}
        <main className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <p className="text-[15px] font-semibold text-gray-900">
              <span className="text-[#1B4FFF]">{totalCount.toLocaleString()}</span> properties found
              {filters.cities.length === 1 && <span className="font-normal text-gray-500"> in {filters.cities[0]}</span>}
              {filters.cities.length > 1 && <span className="font-normal text-gray-500"> across {filters.cities.length} cities</span>}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Sort */}
              <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
                className="hidden sm:block text-[13px] font-medium text-gray-700 border-[1.5px] border-gray-200 rounded-lg px-3 py-2 outline-none cursor-pointer hover:border-[#1B4FFF] transition-colors bg-white">
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="area-desc">Area: Largest First</option>
                <option value="newest">Newest First</option>
              </select>
              {/* View toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setView("grid")}
                  className={`w-9 h-9 flex items-center justify-center text-sm transition-colors ${view === "grid" ? "bg-[#1B4FFF] text-white" : "text-gray-400 hover:text-[#1B4FFF]"}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>
                </button>
                <button onClick={() => setView("list")}
                  className={`w-9 h-9 flex items-center justify-center text-sm transition-colors border-l border-gray-200 ${view === "list" ? "bg-[#1B4FFF] text-white" : "text-gray-400 hover:text-[#1B4FFF]"}`}>
                  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className="w-4 h-4"><path strokeLinecap="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
                </button>
              </div>
              {/* Mobile filter button */}
              <button onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-1.5 text-[13px] font-semibold text-[#1B4FFF] bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-2 hover:bg-[#1B4FFF] hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className="w-4 h-4"><path strokeLinecap="round" d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14"/><circle cx="16" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="6" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="18" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                Filters
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {chips.map((chip, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs font-medium text-[#1B4FFF] bg-blue-50 border border-blue-200 rounded-full pl-3 pr-1 py-1">
                  {chip.label}
                  <button onClick={chip.remove} className="w-4 h-4 rounded-full bg-[#1B4FFF] text-white flex items-center justify-center hover:bg-[#1440CC] transition-colors">
                    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} fill="none" className="w-2.5 h-2.5"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18"/></svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* No results */}
          {totalCount === 0 ? (
            <div className="text-center py-24">
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} fill="none" className="w-14 h-14 text-gray-300 mx-auto mb-4"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M8 15s1.5-2 4-2 4 2 4 2M9 9h.01M15 9h.01"/></svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
              <p className="text-sm text-gray-500 mb-6">Try adjusting your filters or search in a different area.</p>
              <button onClick={() => { resetFilters(); setBudgetPreset(null); }}
                className="text-sm font-semibold text-white bg-[#1B4FFF] rounded-lg px-6 py-2.5 hover:bg-[#1440CC] transition-colors">
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Property grid / list */
            <div className={view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              : "flex flex-col gap-4"
            }>
              {paginated.map((p) => (
                <PropertyCard key={p.id} property={p} layout={view} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
              <PaginationBtn disabled={page === 1} onClick={() => goPage(page - 1)}>
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6"/></svg>
              </PaginationBtn>
              {buildPageNums(page, totalPages).map((n, i) =>
                n === "..." ? (
                  <span key={`e${i}`} className="text-gray-400 px-1">…</span>
                ) : (
                  <PaginationBtn key={n} active={n === page} onClick={() => goPage(n as number)}>
                    {n}
                  </PaginationBtn>
                )
              )}
              <PaginationBtn disabled={page === totalPages} onClick={() => goPage(page + 1)}>
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6"/></svg>
              </PaginationBtn>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── sub-components ────────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100">
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-[13px] font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
        {title}
        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none"
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "" : "-rotate-90"}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function PropertyCard({ property: p, layout }: { property: Property; layout: "grid" | "list" }) {
  const [saved, setSaved] = useState(false);
  const daysLabel = p.daysAgo === 0 ? "Today" : p.daysAgo === 1 ? "1 day ago" : `${p.daysAgo} days ago`;
  const isRow = layout === "list";

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden group cursor-pointer transition-all hover:shadow-lg ${
      isRow ? "flex flex-row" : "flex flex-col hover:-translate-y-0.5"
    }`}>
      {/* Image */}
      <div className={`relative overflow-hidden bg-gray-100 flex-shrink-0 ${isRow ? "w-56 h-48" : "aspect-[4/3]"}`}>
        <Image src={p.img} alt={p.title} fill sizes="400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {/* Listing type badge */}
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ${
          p.listingType === "buy" ? "bg-[#1B4FFF] text-white" : "bg-emerald-600 text-white"
        }`}>
          {p.listingType === "buy" ? "For Sale" : "For Rent"}
        </span>
        {/* Featured badge */}
        {p.featured && (
          <span className="absolute top-2.5 right-10 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md bg-purple-600 text-white">
            Featured
          </span>
        )}
        {/* Wishlist */}
        <button onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-colors ${
            saved ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}>
          <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="M12 21s-7.5-4.6-10-9.3C.5 8.3 2 4.8 5.4 4.1 8 3.5 10 5 12 7c2-2 4-3.5 6.6-2.9C22 4.8 23.5 8.3 22 11.7 19.5 16.4 12 21 12 21z"/>
          </svg>
        </button>
        {/* Days ago */}
        <span className="absolute bottom-2 left-2 text-[10px] bg-black/55 text-white px-1.5 py-0.5 rounded">
          {daysLabel}
        </span>
        {/* RERA */}
        {p.rera && (
          <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="text-emerald-400 text-[9px]">✓</span> RERA
          </span>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-1 ${isRow ? "flex-row" : "flex-col"}`}>
        <div className="p-4 flex-1">
          <p className="text-[20px] font-bold text-gray-900 leading-tight mb-0.5">
            {p.priceLabel} <span className="text-xs font-normal text-gray-400">{p.priceNote}</span>
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-1 truncate">{p.title}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 flex-shrink-0 text-gray-400">
              <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
            </svg>
            {p.locality}, {p.city}
          </p>
          {p.bhk > 0 ? (
            <div className="flex gap-4 flex-wrap pt-3 border-t border-gray-100">
              <span className="flex items-center gap-1.5 text-xs text-gray-600">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#1B4FFF]"><path d="M3 7v11h2v-3h14v3h2v-7a3 3 0 0 0-3-3h-6v3H8a1 1 0 0 0-1 1v-1H5V7H3zm9 3h6a1 1 0 0 1 1 1v2H8v-2a1 1 0 0 1 1-1h3z"/></svg>
                {p.bhk} BHK
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-600">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#1B4FFF]"><path d="M7 2a2 2 0 0 0-2 2v5H4a1 1 0 0 0-1 1v2a6 6 0 0 0 4 5.65V20h2v-2h6v2h2v-2.35A6 6 0 0 0 21 12v-2a1 1 0 0 0-1-1H7V4a.5.5 0 0 1 .5-.5c.2 0 .35.1.45.27l1.4 2.4 1.7-1L9.7 1.8A2.5 2.5 0 0 0 7.5 0 2.5 2.5 0 0 0 5 2.5V4h2V2z"/></svg>
                {p.baths} Bath
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-600">
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className="w-3.5 h-3.5 text-[#1B4FFF]"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                {p.area.toLocaleString()} sq.ft
              </span>
            </div>
          ) : (
            <div className="flex gap-4 pt-3 border-t border-gray-100">
              <span className="flex items-center gap-1.5 text-xs text-gray-600">
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className="w-3.5 h-3.5 text-[#1B4FFF]"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                {p.area.toLocaleString()} sq.ft Plot
              </span>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className={`flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100 ${
          isRow ? "flex-col gap-2 justify-center border-l border-t-0 min-w-[120px]" : ""
        }`}>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1B4FFF] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
              {p.agentInitials}
            </div>
            <span className="text-[11px] text-gray-400 truncate max-w-[100px]">{p.agent}</span>
          </div>
          <button className="text-[11px] font-semibold text-[#1B4FFF] bg-blue-50 rounded-lg px-3 py-1.5 hover:bg-[#1B4FFF] hover:text-white transition-colors whitespace-nowrap">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

function PaginationBtn({
  children, onClick, disabled = false, active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active
          ? "bg-[#1B4FFF] border-[#1B4FFF] text-white font-bold"
          : "border-gray-200 text-gray-600 hover:border-[#1B4FFF] hover:text-[#1B4FFF] bg-white"
      }`}>
      {children}
    </button>
  );
}

function buildPageNums(page: number, total: number): (number | "...")[] {
  const nums: (number | "...")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= page - 1 && i <= page + 1)) nums.push(i);
    else if (i === page - 2 || i === page + 2) nums.push("...");
  }
  return nums;
}
