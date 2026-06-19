import { IconShield, IconCash, IconScale, IconHeadset } from "@/components/icons";
import type { ComponentType } from "react";

const SERVICES: { icon: ComponentType; title: string; desc: string }[] = [
  {
    icon: IconShield,
    title: "Verified Listings",
    desc: "Every property is physically inspected and RERA-checked before it goes live.",
  },
  {
    icon: IconCash,
    title: "Home Loan Assistance",
    desc: "Compare rates from 15+ banks and get pre-approved in minutes.",
  },
  {
    icon: IconScale,
    title: "Legal Support",
    desc: "Our in-house legal team reviews agreements and guides registry formalities.",
  },
  {
    icon: IconHeadset,
    title: "24/7 Expert Help",
    desc: "Chat or call a property expert any time — in Hindi or English.",
  },
];

export function ServicesBanner() {
  return (
    <section className="bg-primary py-12">
      <div className="max-w-container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {SERVICES.map((s) => (
          <div key={s.title} className="flex items-start gap-4 text-white/90">
            <span className="w-12 h-12 flex-shrink-0 mt-0.5 bg-white/15 rounded-xl flex items-center justify-center text-[26px] text-white">
              <s.icon />
            </span>
            <div>
              <h4 className="text-[15px] font-bold text-white mb-1">{s.title}</h4>
              <p className="text-[13px] text-white/70 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CtaStrip() {
  return (
    <section className="bg-surface py-16 border-y border-border">
      <div className="max-w-container mx-auto px-6 flex items-center justify-between gap-6 flex-wrap text-center md:text-left">
        <div>
          <h2 className="font-display font-bold text-ink text-[28px] mb-1.5">
            Ready to list your property?
          </h2>
          <p className="text-[15px] text-muted">
            Post your property for free and connect with serious buyers today.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center flex-shrink-0">
          <button className="text-[15px] font-bold text-white bg-primary rounded-[10px] px-7 py-3 hover:bg-primary-dark transition-colors active:scale-[0.97]">
            Post for Free
          </button>
          <button className="text-[15px] font-bold text-primary bg-white border-[1.5px] border-primary rounded-[10px] px-7 py-3 hover:bg-primary-light transition-colors">
            Talk to an Agent
          </button>
        </div>
      </div>
    </section>
  );
}