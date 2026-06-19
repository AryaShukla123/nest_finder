"use client";

import { useState } from "react";
import Image from "next/image";
import { Property } from "@/types/property";
import {
  IconLocation,
  IconBed,
  IconBath,
  IconArea,
  IconHeart,
  IconCheckCircle,
} from "@/components/icons";

const BADGE_STYLES: Record<string, string> = {
  buy: "bg-primary text-white",
  rent: "bg-emerald-600 text-white",
};
const BADGE_LABEL: Record<string, string> = {
  buy: "For Sale",
  rent: "For Rent",
};

interface PropertyCardProps {
  property: Property;
  /** "grid" (default card) or "row" (horizontal list-view layout) */
  layout?: "grid" | "row";
}

export default function PropertyCard({
  property: p,
  layout = "grid",
}: PropertyCardProps) {
  const [saved, setSaved] = useState(false);

  const daysLabel =
    p.daysAgo === 0 ? "Today" : p.daysAgo === 1 ? "1 day ago" : `${p.daysAgo} days ago`;

  const isRow = layout === "row";

  return (
    <div
      className={`bg-white rounded border border-border overflow-hidden transition-all hover:shadow-lg group cursor-pointer ${
        isRow ? "flex flex-row max-h-[200px]" : "flex flex-col hover:-translate-y-1"
      }`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-surface flex-shrink-0 ${
          isRow ? "w-60 h-full" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={p.img}
          alt={p.title}
          fill
          sizes={isRow ? "240px" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span
          className={`absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded ${BADGE_STYLES[p.listingType]}`}
        >
          {BADGE_LABEL[p.listingType]}
        </span>

        {p.featured && (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded bg-purple-600 text-white">
            Featured
          </span>
        )}

        <button
          aria-label="Save property"
          onClick={(e) => {
            e.stopPropagation();
            setSaved((s) => !s);
          }}
          className={`absolute ${
            p.featured ? "top-11" : "top-2.5"
          } right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[14px] transition-colors ${
            saved ? "text-red-500" : "text-muted hover:text-red-500"
          }`}
        >
          <IconHeart filled={saved} />
        </button>

        <span className="absolute bottom-2 left-2 text-[10px] bg-black/55 text-white/90 px-1.5 py-0.5 rounded">
          {daysLabel}
        </span>

        {p.rera && (
          <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="text-emerald-400">
              <IconCheckCircle className="w-[9px] h-[9px]" />
            </span>
            RERA
          </span>
        )}
      </div>

      {/* Body + footer */}
      <div className={isRow ? "flex flex-1" : "flex flex-col flex-1"}>
        <div className={`p-3.5 flex-1 ${isRow ? "flex flex-col justify-center" : ""}`}>
          <p className="text-[19px] font-bold text-ink mb-0.5">
            {p.priceLabel}{" "}
            <span className="text-xs font-normal text-muted">{p.priceNote}</span>
          </p>
          <p className="text-sm font-semibold text-ink mb-1 truncate">{p.title}</p>
          <p className="text-xs text-muted flex items-center gap-1 mb-3">
            <IconLocation className="w-2.5 h-2.5 flex-shrink-0" />
            {p.locality}, {p.city}
          </p>

          <div className="flex gap-3.5 flex-wrap pt-3 border-t border-border">
            {p.bhk > 0 ? (
              <>
                <span className="flex items-center gap-1 text-xs text-text">
                  <IconBed className="text-primary" /> {p.bhk} BHK
                </span>
                <span className="flex items-center gap-1 text-xs text-text">
                  <IconBath className="text-primary" /> {p.baths} Bath
                </span>
                <span className="flex items-center gap-1 text-xs text-text">
                  <IconArea className="text-primary" /> {p.area.toLocaleString()} sq.ft
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1 text-xs text-text">
                <IconArea className="text-primary" /> {p.area.toLocaleString()} sq.ft Plot
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex items-center justify-between px-3.5 py-2.5 border-t border-border bg-surface ${
            isRow ? "flex-col gap-2 justify-center border-l border-t-0 min-w-[130px]" : ""
          }`}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-[26px] h-[26px] rounded-full bg-primary-light text-primary text-[10px] font-bold flex items-center justify-center">
              {p.agentInitials}
            </div>
            <span className="text-[11px] text-muted">{p.agent}</span>
          </div>
          <button className="text-[11px] font-semibold text-primary bg-primary-light rounded px-2.5 py-1.5 hover:bg-primary hover:text-white transition-colors">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}