"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconSearch, IconLocation, IconCheckCircle } from "@/components/icons";

const SEARCH_TABS = [
  { key: "buy", label: "Buy" },
  { key: "rent", label: "Rent" },
  { key: "new", label: "New Projects" },
  { key: "commercial", label: "Commercial" },
];

const SUGGESTIONS = [
  "Gomti Nagar, Lucknow",
  "Indira Nagar, Lucknow",
  "Hazratganj, Lucknow",
  "Bandra West, Mumbai",
  "Powai, Mumbai",
  "Koramangala, Bengaluru",
  "Whitefield, Bengaluru",
  "Gachibowli, Hyderabad",
  "Hinjewadi, Pune",
  "Sector 62, Noida",
  "Golf Course Road, Gurugram",
];

const POPULAR_CITIES = [
  "Lucknow",
  "Mumbai",
  "Noida",
  "Bengaluru",
  "Hyderabad",
  "Gurugram",
];

const STATS = [
  { num: "15L+", label: "Active Listings" },
  { num: "500+", label: "Cities Covered" },
  { num: "2Cr+", label: "Monthly Visitors" },
  { num: "98%", label: "Verified Listings" },
];

export default function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("buy");
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = query
    ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  function goToListings(searchValue?: string) {
    const params = new URLSearchParams();
    if (searchValue) params.set("q", searchValue);
    if (activeTab === "rent") params.set("type", "rent");
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden flex flex-col items-center pt-32 md:pt-36 bg-gradient-to-br from-primary-light via-sky-50 to-primary-light min-h-screen">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(27,79,255,0.08),transparent_70%)]" />
        <div className="absolute bottom-24 -left-20 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.07),transparent_70%)]" />
      </div>

      <div className="relative z-10 text-center max-w-[780px] px-6 w-full">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary bg-primary-light border border-primary/20 px-4 py-1.5 rounded-full mb-6">
          <span className="text-emerald-500">
            <IconCheckCircle className="w-[13px] h-[13px]" />
          </span>
          Trusted by 2 crore+ home seekers
        </p>

        <h1 className="font-display font-bold text-ink leading-[1.1] mb-4 text-[clamp(36px,6vw,64px)]">
          Find a home
          <br />
          <span className="text-primary relative inline-block">
            you&apos;ll love to live in
            <span className="absolute left-0 right-0 -bottom-1 h-1 bg-accent rounded-full" />
          </span>
        </h1>

        <p className="text-[17px] text-muted max-w-[520px] mx-auto mb-9 leading-relaxed">
          India&apos;s most complete property marketplace — buy, rent, or
          invest with confidence.
        </p>

        {/* Search box */}
        <div className="bg-white rounded-2xl shadow-lg text-left w-full">
          <div className="flex gap-1 px-3 pt-3 border-b border-border overflow-x-auto scrollbar-thin">
            {SEARCH_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-[13px] font-semibold rounded-t-lg px-4 py-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "text-primary bg-primary-light"
                    : "text-muted hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-3 p-3">
            <div className="relative flex-1 min-w-0">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                <IconSearch className="text-[15px]" />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(e) => e.key === "Enter" && goToListings(query)}
                placeholder="Search for locality, landmark, project or city…"
                className="w-full h-12 border-[1.5px] border-border rounded-[10px] pl-10 pr-3.5 text-sm text-ink outline-none focus:border-primary transition-colors"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-border rounded-[10px] shadow-md z-50">
                  {filteredSuggestions.map((s) => (
                    <div
                      key={s}
                      onClick={() => {
                        setQuery(s);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2.5 text-sm flex items-center gap-2.5 text-text hover:bg-primary-light hover:text-primary cursor-pointer"
                    >
                      <IconLocation className="text-muted text-[13px]" />
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 px-0 md:px-2">
              <select className="text-[13px] font-medium text-text bg-white border-[1.5px] border-border rounded-[10px] h-12 px-3 outline-none cursor-pointer focus:border-primary min-w-[130px]">
                <option>Property Type</option>
                <option>Flat / Apartment</option>
                <option>Independent House</option>
                <option>Villa</option>
                <option>Plot</option>
                <option>Studio</option>
              </select>
              <select className="text-[13px] font-medium text-text bg-white border-[1.5px] border-border rounded-[10px] h-12 px-3 outline-none cursor-pointer focus:border-primary min-w-[130px]">
                <option>Budget</option>
                <option>Under ₹30L</option>
                <option>₹30L – ₹60L</option>
                <option>₹60L – ₹1Cr</option>
                <option>₹1Cr – ₹2Cr</option>
                <option>Above ₹2Cr</option>
              </select>
            </div>

            <button
              onClick={() => goToListings(query)}
              className="text-[15px] font-bold text-white bg-primary rounded-[10px] h-12 px-7 flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors active:scale-[0.97] whitespace-nowrap"
            >
              <IconSearch />
              Search
            </button>
          </div>
        </div>

        {/* Popular tags */}
        <div className="flex flex-wrap items-center gap-2 mt-5 justify-center">
          <span className="text-[13px] text-muted font-medium">Popular:</span>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => goToListings(city)}
              className="text-[13px] font-medium text-primary bg-primary-light border border-primary/20 px-3.5 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 w-full max-w-[900px] bg-ink rounded-t-2xl mt-14 px-6 md:px-10 py-7 flex flex-wrap items-center justify-center gap-5">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            <div className="text-center px-4">
              <span className="block text-[26px] md:text-[28px] font-bold text-white tracking-tight">
                {stat.num}
              </span>
              <span className="block text-[13px] text-white/55 mt-0.5 whitespace-nowrap">
                {stat.label}
              </span>
            </div>
            {i < STATS.length - 1 && (
              <div className="w-px h-10 bg-white/15 hidden sm:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}