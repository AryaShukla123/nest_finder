"use client";

import { useState } from "react";
import { PropertyFilters, PropertyType, Furnishing, PostedBy } from "@/types/property";
import { IconSliders, IconChevronDown, IconSearch } from "@/components/icons";

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

const TYPE_OPTIONS: { value: PropertyType; count: number }[] = [
  { value: "Apartment", count: 18 },
  { value: "Independent House", count: 7 },
  { value: "Villa", count: 3 },
  { value: "Studio", count: 2 },
  { value: "Plot", count: 4 },
];

const BHK_OPTIONS = ["1", "2", "3", "4", "4+"];
const FURNISH_OPTIONS: Furnishing[] = ["Furnished", "Semi-Furnished", "Unfurnished"];
const POSTED_OPTIONS: PostedBy[] = ["Owner", "Agent", "Builder"];
const AMENITY_OPTIONS = [
  "Lift",
  "Parking",
  "Gym",
  "Swimming Pool",
  "Security",
  "Power Backup",
  "Club House",
];

const BUDGET_PRESETS = [
  { label: "Under ₹30L", min: 0, max: 30 },
  { label: "₹30–60L", min: 30, max: 60 },
  { label: "₹60L–1Cr", min: 60, max: 100 },
  { label: "₹1–2Cr", min: 100, max: 200 },
  { label: "₹2Cr+", min: 200, max: 500 },
];

function formatBudget(valLac: number) {
  if (valLac >= 100) {
    const cr = valLac / 100;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)}Cr`;
  }
  return `₹${valLac}L`;
}

interface FilterGroupProps {
  title: string;
  groupKey: string;
  collapsed: Set<string>;
  toggle: (key: string) => void;
  children: React.ReactNode;
}

function FilterGroup({ title, groupKey, collapsed, toggle, children }: FilterGroupProps) {
  const isCollapsed = collapsed.has(groupKey);
  return (
    <div className="border-b border-border">
      <div
        onClick={() => toggle(groupKey)}
        className="flex items-center justify-between px-4 py-3.5 text-[13px] font-semibold text-ink cursor-pointer hover:bg-surface transition-colors select-none"
      >
        <span>{title}</span>
        <span
          className={`text-[10px] text-muted transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
        >
          <IconChevronDown />
        </span>
      </div>
      {!isCollapsed && <div className="px-4 pb-3.5">{children}</div>}
    </div>
  );
}

interface FilterSidebarProps {
  filters: PropertyFilters;
  updateFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
  resetFilters: () => void;
  open: boolean;
  onClose: () => void;
}

export default function FilterSidebar({
  filters,
  updateFilter,
  resetFilters,
  open,
  onClose,
}: FilterSidebarProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [citySearch, setCitySearch] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [activeBudgetPreset, setActiveBudgetPreset] = useState<string | null>(null);

  function toggleCollapse(key: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function toggleArrayValue<T extends string>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  function handleReset() {
    resetFilters();
    setAmenities([]);
    setActiveBudgetPreset(null);
    setCitySearch("");
  }

  const visibleCities = CITY_OPTIONS.filter((c) =>
    c.value.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <aside
      className={`
        bg-white border border-border rounded pb-4 w-[270px] flex-shrink-0
        max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin
        lg:sticky lg:top-[84px] lg:left-auto lg:translate-x-0
        fixed top-0 z-[1000] h-full transition-transform duration-200
        ${open ? "translate-x-0 left-0" : "-translate-x-full left-0 lg:translate-x-0"}
      `}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-border sticky top-0 bg-white z-[2]">
        <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
          <span className="text-primary">
            <IconSliders className="text-sm" />
          </span>
          Filters
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-accent hover:bg-accent-light px-2 py-1 rounded transition-colors"
          >
            Clear All
          </button>
          <button onClick={onClose} className="lg:hidden text-muted text-lg leading-none">
            ×
          </button>
        </div>
      </div>

      <FilterGroup title="City" groupKey="city" collapsed={collapsed} toggle={toggleCollapse}>
        <div className="flex items-center gap-2 border border-border rounded-md px-2.5 py-1.5 mb-2.5">
          <span className="text-muted text-xs">
            <IconSearch />
          </span>
          <input
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search city…"
            className="text-xs outline-none bg-transparent w-full"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          {visibleCities.map((c) => (
            <label
              key={c.value}
              className="flex items-center gap-2 text-[13px] text-text cursor-pointer px-1.5 py-1 rounded-md hover:bg-primary-light"
            >
              <input
                type="checkbox"
                checked={filters.cities.includes(c.value)}
                onChange={() =>
                  updateFilter("cities", toggleArrayValue(filters.cities, c.value))
                }
                className="accent-primary w-[15px] h-[15px]"
              />
              {c.value}
              <span className="ml-auto text-[11px] text-muted bg-surface rounded px-1.5">
                {c.count}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Budget" groupKey="budget" collapsed={collapsed} toggle={toggleCollapse}>
        <div className="text-[13px] font-semibold text-primary text-center py-1.5 mb-1">
          {formatBudget(filters.budgetMinLac)} –{" "}
          {filters.budgetMaxLac >= 500 ? "₹5Cr+" : formatBudget(filters.budgetMaxLac)}
        </div>
        <div className="relative h-6 mb-3.5">
          <input
            type="range"
            className="range-slider absolute w-full h-1 top-1/2 -translate-y-1/2 bg-primary-light rounded"
            min={0}
            max={500}
            step={5}
            value={filters.budgetMinLac}
            onChange={(e) => updateFilter("budgetMinLac", Number(e.target.value))}
          />
          <input
            type="range"
            className="range-slider absolute w-full h-1 top-1/2 -translate-y-1/2 bg-transparent rounded"
            min={0}
            max={500}
            step={5}
            value={filters.budgetMaxLac}
            onChange={(e) => updateFilter("budgetMaxLac", Number(e.target.value))}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {BUDGET_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                updateFilter("budgetMinLac", preset.min);
                updateFilter("budgetMaxLac", preset.max);
                setActiveBudgetPreset(preset.label);
              }}
              className={`text-[11px] font-medium rounded-full px-2.5 py-1 border transition-colors ${
                activeBudgetPreset === preset.label
                  ? "bg-primary text-white border-primary"
                  : "text-primary bg-primary-light border-primary/20 hover:bg-primary hover:text-white"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Property Type" groupKey="type" collapsed={collapsed} toggle={toggleCollapse}>
        <div className="flex flex-col gap-1.5">
          {TYPE_OPTIONS.map((t) => (
            <label
              key={t.value}
              className="flex items-center gap-2 text-[13px] text-text cursor-pointer px-1.5 py-1 rounded-md hover:bg-primary-light"
            >
              <input
                type="checkbox"
                checked={filters.types.includes(t.value)}
                onChange={() => updateFilter("types", toggleArrayValue(filters.types, t.value))}
                className="accent-primary w-[15px] h-[15px]"
              />
              {t.value}
              <span className="ml-auto text-[11px] text-muted bg-surface rounded px-1.5">
                {t.count}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="BHK Type" groupKey="bhk" collapsed={collapsed} toggle={toggleCollapse}>
        <div className="flex flex-wrap gap-1.5">
          {BHK_OPTIONS.map((b) => (
            <button
              key={b}
              onClick={() => updateFilter("bhk", toggleArrayValue(filters.bhk, b))}
              className={`text-xs font-medium rounded-full px-3.5 py-1.5 border-[1.5px] transition-colors ${
                filters.bhk.includes(b)
                  ? "text-primary bg-primary-light border-primary"
                  : "text-muted bg-surface border-border"
              }`}
            >
              {b} BHK
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Furnishing" groupKey="furnish" collapsed={collapsed} toggle={toggleCollapse}>
        <div className="flex flex-wrap gap-1.5">
          {FURNISH_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => updateFilter("furnishing", toggleArrayValue(filters.furnishing, f))}
              className={`text-xs font-medium rounded-full px-3.5 py-1.5 border-[1.5px] transition-colors ${
                filters.furnishing.includes(f)
                  ? "text-primary bg-primary-light border-primary"
                  : "text-muted bg-surface border-border"
              }`}
            >
              {f === "Semi-Furnished" ? "Semi" : f}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Posted By" groupKey="posted" collapsed={collapsed} toggle={toggleCollapse}>
        <div className="flex flex-col gap-1.5">
          {POSTED_OPTIONS.map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 text-[13px] text-text cursor-pointer px-1.5 py-1 rounded-md hover:bg-primary-light"
            >
              <input
                type="checkbox"
                checked={filters.postedBy.includes(p)}
                onChange={() => updateFilter("postedBy", toggleArrayValue(filters.postedBy, p))}
                className="accent-primary w-[15px] h-[15px]"
              />
              {p === "Agent" ? "Agent / Broker" : p}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Amenities" groupKey="amenities" collapsed={collapsed} toggle={toggleCollapse}>
        <div className="flex flex-col gap-1.5">
          {AMENITY_OPTIONS.map((a) => (
            <label
              key={a}
              className="flex items-center gap-2 text-[13px] text-text cursor-pointer px-1.5 py-1 rounded-md hover:bg-primary-light"
            >
              <input
                type="checkbox"
                checked={amenities.includes(a)}
                onChange={() => setAmenities((prev) => toggleArrayValue(prev, a))}
                className="accent-primary w-[15px] h-[15px]"
              />
              {a}
            </label>
          ))}
        </div>
      </FilterGroup>

      <button
        onClick={onClose}
        className="w-[calc(100%-32px)] mx-4 mt-3.5 h-11 bg-primary text-white text-sm font-bold rounded-[10px] hover:bg-primary-dark transition-colors"
      >
        Apply Filters
      </button>
    </aside>
  );
}