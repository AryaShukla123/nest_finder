import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MODULES = [
  {
    href: "/analytics/spatial",
    title: "Spatial Analysis",
    description: "See how average prices vary sector-by-sector on an interactive Gurugram map.",
    live: true,
  },
  {
    href: "/analytics/price-distribution",
    title: "Price Distribution",
    description: "Boxplot view of price spread across sectors.",
    live: true,
  },
  {
    href: "/analytics/price-vs-area",
    title: "Price vs. Built-up Area",
    description: "Scatter plot of price against square footage, filterable by sector.",
    live: true,
  },
  {
    href: "#",
    title: "Room Configuration",
    description: "Pie chart breakdown of 1BHK / 2BHK / 3BHK+ share by sector.",
    live: false,
  },
];

export default function AnalyticsHomePage() {
  return (
    <>
      <Navbar activeLabel="Analytics" />
      <main className="max-w-container mx-auto px-6 pt-28 pb-20">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Market Analytics</h1>
          <p className="text-muted max-w-2xl">
            Explore Gurugram real estate trends across sectors — currently built from live listing data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {MODULES.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              aria-disabled={!m.live}
              className={`block rounded-lg border border-border p-6 transition-all ${
                m.live
                  ? "hover:shadow-md hover:border-primary bg-white"
                  : "bg-surface cursor-not-allowed opacity-60 pointer-events-none"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-ink text-lg">{m.title}</h2>
                {!m.live && (
                  <span className="text-[11px] font-semibold text-muted bg-border rounded px-2 py-0.5">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">{m.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
