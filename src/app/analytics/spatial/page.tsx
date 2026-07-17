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
          <Link 
  href="/analytics" 
  className="group inline-flex items-center gap-2 rounded-lg border-2 border-orange-500 bg-white px-4 py-2 text-sm font-semibold text-orange-500 shadow-sm transition-all hover:bg-orange-50"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="transition-transform group-hover:-translate-x-0.5"
  >
    <path d="M19 12H5"/>
    <path d="m12 19-7-7 7-7"/>
  </svg>
  Back to Analytics
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
