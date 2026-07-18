import dynamic from "next/dynamic";
import { Map } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import ChartCard from "@/components/analytics/ChartCard";
import ChartSkeleton from "@/components/analytics/ChartSkeleton";

// Leaflet touches `window`, so the map must be client-only with SSR disabled.
const SectorMap = dynamic(() => import("@/components/analytics/SectorMap"), {
  ssr: false,
  loading: () => <ChartSkeleton height={560} />,
});

export default function SpatialAnalysisPage() {
  return (
    <>
      <Navbar activeLabel="Analytics" />
      <main className="bg-surface min-h-screen">
        <div className="max-w-container mx-auto px-6 pt-28 pb-20">
          <AnalyticsHeader
            icon={Map}
            crumb="Spatial Analysis"
            title="Spatial Analysis"
            description="Each sector is shaded by its average price per sqft — green sectors are relatively affordable, red sectors are the priciest. Hover or tap a sector for details."
          />

          <ChartCard className="!p-3 sm:!p-4">
            <SectorMap />
          </ChartCard>

          <p className="text-xs text-muted mt-4">
            Currently showing Gurugram only. Sectors with no matching listing data are shown in grey.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
