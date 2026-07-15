import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Leaflet touches `window`, so the map must be client-only with SSR disabled.
const SectorMap = dynamic(() => import("@/components/analytics/SectorMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] w-full rounded-lg border border-border bg-surface flex items-center justify-center text-muted">
      Loading map…
    </div>
  ),
});

export default function SpatialAnalysisPage() {
  return (
    <>
      <Navbar activeLabel="Analytics" />
      <main className="max-w-container mx-auto px-6 pt-28 pb-20">
        <div className="mb-6">
          <Link href="/analytics" className="text-sm text-primary font-medium hover:underline">
            ← Back to Analytics
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink mt-3 mb-2">Spatial Analysis</h1>
          <p className="text-muted max-w-2xl">
            Each sector is shaded by its average price per sqft — green sectors are relatively
            affordable, red sectors are the priciest. Hover or tap a sector for details.
          </p>
        </div>

        <SectorMap />

        <p className="text-xs text-muted mt-4">
          Currently showing Gurugram only. Sectors with no matching listing data are shown in grey.
        </p>
      </main>
      <Footer />
    </>
  );
}
