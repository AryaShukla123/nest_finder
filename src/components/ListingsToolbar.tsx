"use client";

import { SortOption } from "@/types/property";
import { IconGrid, IconList, IconSliders } from "@/components/icons";

interface ListingsToolbarProps {
  resultsCount: number;
  cities: string[];
  sort: SortOption;
  setSort: (s: SortOption) => void;
  view: "grid" | "list";
  setView: (v: "grid" | "list") => void;
  onOpenMobileFilters: () => void;
}

export default function ListingsToolbar({
  resultsCount,
  cities,
  sort,
  setSort,
  view,
  setView,
  onOpenMobileFilters,
}: ListingsToolbarProps) {
  const locationLabel =
    cities.length === 1
      ? `in ${cities[0]}`
      : cities.length > 1
        ? `across ${cities.length} cities`
        : "across India";

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
      <div className="text-[15px] font-semibold text-ink">
        <span className="text-primary">{resultsCount.toLocaleString()}</span> properties found{" "}
        <span className="font-normal text-muted">{locationLabel}</span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="hidden sm:flex items-center gap-2">
          <label className="text-[13px] text-muted font-medium flex items-center gap-1.5 whitespace-nowrap">
            Sort:
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-[13px] font-medium text-ink border-[1.5px] border-border rounded-lg px-2.5 py-1.5 pr-7 outline-none cursor-pointer focus:border-primary bg-white"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="area-desc">Area: Largest First</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setView("grid")}
            title="Grid View"
            className={`w-9 h-9 flex items-center justify-center border-[1.5px] rounded-lg text-sm transition-colors ${
              view === "grid"
                ? "bg-primary border-primary text-white"
                : "border-border text-muted bg-white"
            }`}
          >
            <IconGrid />
          </button>
          <button
            onClick={() => setView("list")}
            title="List View"
            className={`w-9 h-9 flex items-center justify-center border-[1.5px] rounded-lg text-sm transition-colors ${
              view === "list"
                ? "bg-primary border-primary text-white"
                : "border-border text-muted bg-white"
            }`}
          >
            <IconList />
          </button>
        </div>

        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-1.5 text-[13px] font-semibold text-primary bg-primary-light border border-primary/20 rounded-lg px-3.5 py-1.5 hover:bg-primary hover:text-white transition-colors"
        >
          <IconSliders /> Filters
        </button>
      </div>
    </div>
  );
}