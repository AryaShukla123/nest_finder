"use client";

import { PropertyFilters } from "@/types/property";
import { IconXMark } from "@/components/icons";

interface ActiveFilterTagsProps {
  filters: PropertyFilters;
  updateFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
}

export default function ActiveFilterTags({ filters, updateFilter }: ActiveFilterTagsProps) {
  const tags: { label: string; onRemove: () => void }[] = [];

  if (filters.listingType) {
    tags.push({
      label: filters.listingType === "buy" ? "For Sale" : "For Rent",
      onRemove: () => updateFilter("listingType", null),
    });
  }

  if (filters.cities.length > 0 && filters.cities.length < 8) {
    filters.cities.forEach((city) => {
      tags.push({
        label: city,
        onRemove: () => updateFilter("cities", filters.cities.filter((c) => c !== city)),
      });
    });
  }

  if (filters.search.trim()) {
    tags.push({
      label: `"${filters.search.trim()}"`,
      onRemove: () => updateFilter("search", ""),
    });
  }

  if (filters.budgetMinLac > 0 || filters.budgetMaxLac < 500) {
    const min = filters.budgetMinLac >= 100 ? `₹${filters.budgetMinLac / 100}Cr` : `₹${filters.budgetMinLac}L`;
    const max = filters.budgetMaxLac >= 500 ? "₹5Cr+" : filters.budgetMaxLac >= 100 ? `₹${filters.budgetMaxLac / 100}Cr` : `₹${filters.budgetMaxLac}L`;
    tags.push({
      label: `${min} – ${max}`,
      onRemove: () => {
        updateFilter("budgetMinLac", 0);
        updateFilter("budgetMaxLac", 500);
      },
    });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary-light border border-primary/20 rounded-full pl-3 pr-1 py-1"
        >
          {tag.label}
          <button
            onClick={tag.onRemove}
            aria-label="Remove filter"
            className="w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center"
          >
            <IconXMark className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
    </div>
  );
}