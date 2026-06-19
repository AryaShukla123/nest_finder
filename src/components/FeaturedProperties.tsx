import Link from "next/link";
import { getAllProperties } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import { IconArrowRight } from "@/components/icons";

export default function FeaturedProperties() {
  // First 6 properties stand in for a "featured / handpicked" rail.
  const properties = getAllProperties().slice(0, 6);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[13px] font-semibold tracking-wider uppercase text-primary mb-1.5">
              Handpicked for you
            </p>
            <h2 className="font-display font-bold text-ink text-[clamp(24px,3vw,34px)]">
              Featured Properties
            </h2>
          </div>
          <Link
            href="/listings"
            className="text-sm font-semibold text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all whitespace-nowrap"
          >
            View all <IconArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}