"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProperties } from "@/data/properties";
import { Property } from "@/types/property";

// ─── helpers ──────────────────────────────────────────────────────────────────
function formatEMI(principal: number, ratePercent: number, tenureYears: number) {
  const r = ratePercent / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return Math.round(principal / n);
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} Lac`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const AMENITY_ICONS: Record<string, string> = {
  Lift: "🛗",
  Parking: "🚗",
  Gym: "🏋️",
  "Swimming Pool": "🏊",
  Security: "🔒",
  "Power Backup": "⚡",
  "Club House": "🏛️",
};

// Extra mock images for the gallery (reuse property img + unsplash variants)
const GALLERY_EXTRAS = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const allProperties = getAllProperties();
  const property = allProperties.find((p) => p.id === parseInt(params.id, 10));

  if (!property) notFound();

  const gallery = [property.img, ...GALLERY_EXTRAS].slice(0, 5);
  const similar = allProperties
    .filter((p) => p.city === property.city && p.id !== property.id)
    .slice(0, 3);

  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // EMI calculator state
  const loanDefault = Math.round(property.listingType === "buy" ? property.price * 0.8 : 2000000);
  const [loanAmt, setLoanAmt] = useState(loanDefault);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const emi = formatEMI(loanAmt, rate, tenure);
  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - loanAmt;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-[68px] flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="w-9 h-9 bg-[#1B4FFF] rounded-[9px] flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.7 2 11h3v9h6v-6h2v6h6v-9h3L12 2.7z" /></svg>
            </span>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Nest<span className="text-[#1B4FFF]">Finder</span>
            </span>
          </Link>
          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 text-sm text-gray-400 flex-1">
            <Link href="/" className="hover:text-[#1B4FFF] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/listings" className="hover:text-[#1B4FFF] transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-gray-700 truncate max-w-[200px]">{property.title}</span>
          </div>
          <div className="hidden lg:flex items-center gap-2.5 ml-auto flex-shrink-0">
            <button className="text-sm font-semibold text-[#1B4FFF] border-[1.5px] border-[#1B4FFF] rounded-lg px-4 py-1.5 flex items-center gap-2 hover:bg-blue-50 transition-colors">
              Post Property
              <span className="text-[10px] font-bold bg-[#FF6B35] text-white px-1.5 py-0.5 rounded">Free</span>
            </button>
            <button className="text-sm font-semibold text-white bg-[#1B4FFF] rounded-lg px-5 py-2 hover:bg-[#1440CC] transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-[68px]">

        {/* ── Gallery ── */}
        <div className="bg-gray-900">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4">
            {/* Main image */}
            <div className="relative w-full h-[300px] md:h-[480px] rounded-xl overflow-hidden mb-3">
              <Image
                src={gallery[activeImg]}
                alt={property.title}
                fill
                sizes="1200px"
                className="object-cover transition-opacity duration-300"
                priority
              />
              {/* Image counter */}
              <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                {activeImg + 1} / {gallery.length}
              </span>
              {/* Prev/Next arrows */}
              <button
                onClick={() => setActiveImg((i) => (i - 1 + gallery.length) % gallery.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" /></svg>
              </button>
              <button
                onClick={() => setActiveImg((i) => (i + 1) % gallery.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative flex-shrink-0 w-20 h-14 md:w-28 md:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImg === i ? "border-[#1B4FFF]" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill sizes="112px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-8">

          {/* ── Left column ── */}
          <div className="flex-1 min-w-0">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md ${
                    property.listingType === "buy" ? "bg-[#1B4FFF] text-white" : "bg-emerald-600 text-white"
                  }`}>
                    {property.listingType === "buy" ? "For Sale" : "For Rent"}
                  </span>
                  {property.rera && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                      ✓ RERA Verified
                    </span>
                  )}
                  {property.featured && (
                    <span className="text-[11px] font-bold text-purple-600 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{property.title}</h1>
                <p className="text-gray-500 flex items-center gap-1.5 text-sm">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#1B4FFF] flex-shrink-0">
                    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  {property.locality}, {property.city}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setSaved((s) => !s)}
                  className={`w-10 h-10 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                    saved ? "border-red-300 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                    <path d="M12 21s-7.5-4.6-10-9.3C.5 8.3 2 4.8 5.4 4.1 8 3.5 10 5 12 7c2-2 4-3.5 6.6-2.9C22 4.8 23.5 8.3 22 11.7 19.5 16.4 12 21 12 21z" />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full border-[1.5px] border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1B4FFF] hover:text-[#1B4FFF] transition-colors">
                  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684 6.632 3.316m-6.632-6 6.632-3.316m0 0a3 3 0 1 0 0-2.684 3 3 0 0 0 0 2.684zm0 9.316a3 3 0 1 0 5.368 2.684 3 3 0 0 0-5.368-2.684z" /></svg>
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-6">
              <p className="text-3xl font-bold text-gray-900">
                {property.priceLabel}
                <span className="text-base font-normal text-gray-400 ml-2">{property.priceNote}</span>
              </p>
              {property.listingType === "buy" && (
                <p className="text-sm text-gray-500 mt-1">
                  EMI starts at <span className="font-semibold text-[#1B4FFF]">{formatINR(formatEMI(property.price * 0.8, 8.5, 20))}/month</span>
                </p>
              )}
            </div>

            {/* Key details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {[
                { label: "BHK", value: property.bhk > 0 ? `${property.bhk} BHK` : "N/A", icon: "🛏️" },
                { label: "Area", value: `${property.area.toLocaleString()} sq.ft`, icon: "📐" },
                { label: "Baths", value: property.baths > 0 ? `${property.baths} Baths` : "N/A", icon: "🚿" },
                { label: "Floor", value: property.floor, icon: "🏢" },
                { label: "Furnishing", value: property.furnishing, icon: "🛋️" },
                { label: "Society", value: property.society, icon: "🏘️" },
                { label: "Type", value: property.type, icon: "🏠" },
                { label: "Posted By", value: property.postedBy, icon: "👤" },
                { label: "Listed", value: property.daysAgo === 0 ? "Today" : `${property.daysAgo}d ago`, icon: "📅" },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                    <span>{item.icon}</span> {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About this property</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                This {property.bhk > 0 ? `${property.bhk} BHK` : ""} {property.type.toLowerCase()} is located in the heart of {property.locality}, {property.city} — one of the most sought-after residential areas in the region. Spread across {property.area.toLocaleString()} sq.ft, the property offers a perfect blend of modern architecture and functional living spaces.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm mt-3">
                The property is part of <strong>{property.society}</strong>, a premium residential project with world-class amenities. It is {property.furnishing.toLowerCase()}, making it ideal for {property.listingType === "rent" ? "immediate move-in" : "a family looking to settle in"}. Floor: {property.floor}. Listed by a trusted {property.postedBy.toLowerCase()}.
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-3">
                      <span className="text-xl">{AMENITY_ICONS[a] ?? "✅"}</span>
                      <span className="text-sm font-medium text-gray-700">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EMI Calculator */}
            {property.listingType === "buy" && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">EMI Calculator</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      {/* Loan amount */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
                          <span className="text-sm font-bold text-[#1B4FFF]">{formatINR(loanAmt)}</span>
                        </div>
                        <input type="range" min={500000} max={50000000} step={100000}
                          value={loanAmt} onChange={(e) => setLoanAmt(Number(e.target.value))}
                          className="w-full h-1.5 bg-blue-100 rounded-full appearance-none cursor-pointer accent-[#1B4FFF]" />
                        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                          <span>₹5L</span><span>₹5Cr</span>
                        </div>
                      </div>
                      {/* Interest rate */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-700">Interest Rate</label>
                          <span className="text-sm font-bold text-[#1B4FFF]">{rate}% p.a.</span>
                        </div>
                        <input type="range" min={5} max={20} step={0.1}
                          value={rate} onChange={(e) => setRate(Number(e.target.value))}
                          className="w-full h-1.5 bg-blue-100 rounded-full appearance-none cursor-pointer accent-[#1B4FFF]" />
                        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                          <span>5%</span><span>20%</span>
                        </div>
                      </div>
                      {/* Tenure */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-700">Tenure</label>
                          <span className="text-sm font-bold text-[#1B4FFF]">{tenure} years</span>
                        </div>
                        <input type="range" min={1} max={30} step={1}
                          value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                          className="w-full h-1.5 bg-blue-100 rounded-full appearance-none cursor-pointer accent-[#1B4FFF]" />
                        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                          <span>1 yr</span><span>30 yrs</span>
                        </div>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-center">
                      <p className="text-sm text-gray-500 mb-1">Monthly EMI</p>
                      <p className="text-4xl font-bold text-[#1B4FFF] mb-5">{formatINR(emi)}</p>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Principal Amount</span>
                          <span className="font-semibold text-gray-800">{formatINR(loanAmt)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Interest</span>
                          <span className="font-semibold text-gray-800">{formatINR(totalInterest)}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-3 flex justify-between text-sm">
                          <span className="text-gray-500">Total Payment</span>
                          <span className="font-bold text-gray-900">{formatINR(totalPayment)}</span>
                        </div>
                      </div>
                      <button className="mt-5 w-full py-2.5 bg-[#1B4FFF] text-white text-sm font-bold rounded-xl hover:bg-[#1440CC] transition-colors">
                        Check Loan Eligibility
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Similar properties */}
            {similar.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Properties in {property.city}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similar.map((p) => (
                    <Link key={p.id} href={`/property/${p.id}`}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 block">
                      <div className="relative h-40">
                        <Image src={p.img} alt={p.title} fill sizes="300px" className="object-cover" />
                        <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          p.listingType === "buy" ? "bg-[#1B4FFF] text-white" : "bg-emerald-600 text-white"
                        }`}>{p.listingType === "buy" ? "For Sale" : "For Rent"}</span>
                      </div>
                      <div className="p-3.5">
                        <p className="text-base font-bold text-gray-900">{p.priceLabel} <span className="text-xs font-normal text-gray-400">{p.priceNote}</span></p>
                        <p className="text-sm font-medium text-gray-700 truncate">{p.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.locality}, {p.city}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column — Agent card (sticky) ── */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="sticky top-[84px]">
              {/* Agent card */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md mb-4">
                <div className="bg-[#1B4FFF] px-5 py-4 text-white">
                  <p className="text-sm opacity-80 mb-0.5">Contact Agent</p>
                  <p className="text-xl font-bold">{property.priceLabel}</p>
                  <p className="text-sm opacity-70">{property.priceNote}</p>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1B4FFF] text-lg font-bold flex items-center justify-center flex-shrink-0">
                      {property.agentInitials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{property.agent}</p>
                      <p className="text-xs text-gray-400">{property.postedBy} · {property.society}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-[#1B4FFF] text-white font-bold rounded-xl hover:bg-[#1440CC] transition-colors flex items-center justify-center gap-2">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" /></svg>
                      Call Agent
                    </button>
                    <button className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.527 5.855L.057 23.5a.5.5 0 0 0 .614.637l5.828-1.527A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>
                      WhatsApp
                    </button>
                    <button className="w-full py-3 border-[1.5px] border-[#1B4FFF] text-[#1B4FFF] font-bold rounded-xl hover:bg-blue-50 transition-colors">
                      Send Enquiry
                    </button>
                  </div>
                </div>
              </div>

              {/* Schedule visit */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📅</span> Schedule a Visit
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {["Today", "Tomorrow", "This Week"].map((d) => (
                    <button key={d} className="text-xs font-medium py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-[#1B4FFF] hover:text-[#1B4FFF] hover:bg-blue-50 transition-colors">
                      {d}
                    </button>
                  ))}
                </div>
                <button className="w-full py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-700 transition-colors">
                  Book Free Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky bottom bar (shows on scroll) ── */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 ${
        scrolled ? "translate-y-0" : "translate-y-full"
      }`}>
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-bold text-gray-900">{property.priceLabel} <span className="text-sm font-normal text-gray-400">{property.priceNote}</span></p>
            <p className="text-xs text-gray-500">{property.title} · {property.locality}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="px-5 py-2.5 border-[1.5px] border-[#1B4FFF] text-[#1B4FFF] text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors">
              Call
            </button>
            <button className="px-5 py-2.5 bg-[#1B4FFF] text-white text-sm font-bold rounded-xl hover:bg-[#1440CC] transition-colors">
              Enquire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
