"use client";

import { useMemo, useState } from "react";
import { Property, PropertyFilters, SortOption } from "@/types/property";

const DEFAULT_FILTERS: PropertyFilters = {
  cities: [],
  types: [],
  bhk: ["1", "2", "3", "4", "4+"],
  furnishing: ["Furnished", "Semi-Furnished", "Unfurnished"],
  postedBy: ["Owner", "Agent", "Builder"],
  budgetMinLac: 0,
  budgetMaxLac: 500,
  listingType: null,
  search: "",
};

const PER_PAGE = 9;

export function usePropertyFilters(
  allProperties: Property[],
  initial?: Partial<PropertyFilters>
) {
  const [filters, setFilters] = useState<PropertyFilters>({
    ...DEFAULT_FILTERS,
    ...initial,
  });
  const [sort, setSort] = useState<SortOption>("relevance");
  const [page, setPage] = useState(1);

  function updateFilter<K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setSort("relevance");
    setPage(1);
  }

  const filtered = useMemo(() => {
    let results = allProperties.filter((p) => {
      if (filters.cities.length && !filters.cities.includes(p.city))
        return false;
      if (filters.types.length && !filters.types.includes(p.type))
        return false;
      if (filters.bhk.length && p.bhk > 0) {
        const match = filters.bhk.some((v) =>
          v === "4+" ? p.bhk > 4 : p.bhk === parseInt(v, 10)
        );
        if (!match) return false;
      }
      if (
        filters.furnishing.length &&
        !filters.furnishing.includes(p.furnishing)
      )
        return false;
      if (filters.postedBy.length && !filters.postedBy.includes(p.postedBy))
        return false;
      if (filters.listingType && p.listingType !== filters.listingType)
        return false;
      if (filters.search.trim()) {
        const hay = `${p.title} ${p.locality} ${p.city} ${p.society}`.toLowerCase();
        if (!hay.includes(filters.search.toLowerCase().trim())) return false;
      }
      return true;
    });

    results = [...results].sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "area-desc": return b.area - a.area;
        case "newest": return a.daysAgo - b.daysAgo;
        default: return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return results;
  }, [allProperties, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return {
    filters,
    updateFilter,
    resetFilters,
    sort,
    setSort,
    page,
    setPage,
    totalPages,
    paginated,
    totalCount: filtered.length,
  };
}
