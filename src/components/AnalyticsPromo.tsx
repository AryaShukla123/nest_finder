import Link from "next/link";

export default function AnalyticsPromo() {
  return (
    <section className="max-w-container mx-auto px-6 py-14">
      <div className="rounded-xl bg-ink text-white p-8 md:p-10 flex items-center justify-between gap-6 flex-wrap">
        <div className="max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-wide text-primary-light/80 bg-white/10 rounded px-2 py-1">
            New
          </span>
          <h2 className="font-display font-bold text-2xl md:text-[28px] mt-3 mb-2">
            See Gurugram priced sector-by-sector
          </h2>
          <p className="text-white/70 text-[15px]">
            Our new Market Analytics tool maps average prices across every sector, so you know
            exactly where your budget fits before you start touring flats.
          </p>
        </div>
        <Link
          href="/analytics/spatial"
          className="flex-shrink-0 text-[15px] font-bold text-ink bg-white rounded-[10px] px-7 py-3 hover:bg-white/90 transition-colors active:scale-[0.97]"
        >
          Explore the Map
        </Link>
      </div>
    </section>
  );
}
