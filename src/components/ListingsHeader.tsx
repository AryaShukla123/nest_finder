"use client";

import Link from "next/link";
import { ListingType } from "@/types/property";
import { IconSearch } from "@/components/icons";

const TABS: { key: ListingType | "new"; label: string }[] = [
  { key: "buy", label: "Buy" },
  { key: "rent", label: "Rent" },
  { key: "new", label: "New Projects" },
];

const NAV_LINKS = [
  { href: "/insights", label: "Insights" },
  { href: "/analytics", label: "Analytics" },
  { href: "/predict", label: "Price Prediction" },
];

interface ListingsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  search: string;
  setSearch: (s: string) => void;
}

export default function ListingsHeader({
  activeTab,
  setActiveTab,
  search,
  setSearch,
}: ListingsHeaderProps) {
  return (
    <div className="bg-ink pt-[calc(68px+20px)] pb-5">
      <div className="max-w-container mx-auto px-6">
        <div className="flex items-center gap-1 mb-3 overflow-x-auto scrollbar-thin">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-[13px] font-semibold rounded-md px-4 py-1.5 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "text-white/55 hover:bg-white/[0.12] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <span className="w-px h-4 bg-white/15 mx-1.5 flex-shrink-0" />

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-semibold rounded-md px-4 py-1.5 transition-colors whitespace-nowrap text-white/55 hover:bg-white/[0.12] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center bg-white rounded-[10px] overflow-hidden">
          <span className="px-3.5 text-muted text-[15px]">
            <IconSearch />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search locality, project or city…"
            className="flex-1 h-12 border-none outline-none text-sm text-ink pr-3"
          />
          <button className="h-12 px-7 bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors flex-shrink-0">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}