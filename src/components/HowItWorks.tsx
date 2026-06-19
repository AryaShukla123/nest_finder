import { IconSearch, IconCalendar, IconScale } from "@/components/icons";
import type { ComponentType } from "react";

const STEPS: { icon: ComponentType; step: string; title: string; desc: string }[] = [
  {
    icon: IconSearch,
    step: "01",
    title: "Search",
    desc: "Enter your city or locality and filter by budget, type, and BHK. Our smart engine surfaces the most relevant homes instantly.",
  },
  {
    icon: IconCalendar,
    step: "02",
    title: "Schedule a visit",
    desc: "Book a free site visit at your preferred time directly from the listing page — no back-and-forth calls needed.",
  },
  {
    icon: IconScale,
    step: "03",
    title: "Close the deal",
    desc: "Our legal and home-loan experts assist you from offer to registry, making the final step stress-free.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="mb-10 text-center">
          <p className="text-[13px] font-semibold tracking-wider uppercase text-primary mb-1.5">
            Simple steps
          </p>
          <h2 className="font-display font-bold text-ink text-[clamp(24px,3vw,34px)]">
            How NestFinder works
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-0">
          {STEPS.map((s, i) => (
            <div key={s.step} className="flex items-center md:contents">
              <div className="flex-1 bg-white border border-border rounded p-7 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="w-[52px] h-[52px] bg-primary-light rounded-[14px] flex items-center justify-center text-[22px] text-primary mb-4">
                  <s.icon />
                </div>
                <div className="text-[11px] font-bold tracking-wider uppercase text-muted mb-2">
                  {s.step}
                </div>
                <h3 className="text-[17px] font-bold text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex w-10 items-center justify-center text-lg text-primary flex-shrink-0">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}