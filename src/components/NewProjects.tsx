import Image from "next/image";
import { IconBuilding, IconLocation, IconHome, IconCalendar, IconArrowRight } from "@/components/icons";

const PROJECTS = [
  {
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    tag: "Under Construction",
    name: "Skyline Residences",
    developer: "Godrej Properties",
    location: "Gomti Nagar, Lucknow",
    configs: "2, 3 & 4 BHK",
    possession: "Dec 2026",
    price: "₹72 Lac*",
    priceNote: "onwards",
  },
  {
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    tag: "New Launch",
    name: "Prestige Heights",
    developer: "Prestige Group",
    location: "Shaheed Path, Lucknow",
    configs: "3 & 4 BHK",
    possession: "Mar 2027",
    price: "₹1.1 Cr*",
    priceNote: "onwards",
  },
  {
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    tag: "Ready to Move",
    name: "Emerald Enclave",
    developer: "DLF Limited",
    location: "Aliganj, Lucknow",
    configs: "2 & 3 BHK",
    possession: "Ready",
    price: "₹58 Lac*",
    priceNote: "onwards",
  },
];

export default function NewProjects() {
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-container mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[13px] font-semibold tracking-wider uppercase text-primary mb-1.5">
              Launch deals available
            </p>
            <h2 className="font-display font-bold text-ink text-[clamp(24px,3vw,34px)]">
              New Projects
            </h2>
          </div>
          <a
            href="#"
            className="text-sm font-semibold text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all whitespace-nowrap"
          >
            View all <IconArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <div
              key={p.name}
              className="bg-white rounded border border-border overflow-hidden flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative w-full h-[200px] bg-surface">
                <Image src={p.img} alt={p.name} fill sizes="400px" className="object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wide text-accent bg-accent-light inline-block px-2.5 py-1 rounded mb-2.5 self-start">
                  {p.tag}
                </span>
                <h3 className="text-[17px] font-bold text-ink mb-1">{p.name}</h3>
                <p className="text-[13px] text-muted mb-3 flex items-center gap-1.5">
                  <IconBuilding className="w-3.5 h-3.5 flex-shrink-0" /> {p.developer}
                </p>
                <div className="flex gap-4 flex-wrap mb-4">
                  <span className="flex items-center gap-1.5 text-[13px] text-text">
                    <IconLocation className="text-primary w-3.5 h-3.5 flex-shrink-0" /> {p.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] text-text">
                    <IconHome className="text-primary w-3.5 h-3.5 flex-shrink-0" /> {p.configs}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] text-text">
                    <IconCalendar className="text-primary w-3.5 h-3.5 flex-shrink-0" /> Possession: {p.possession}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3.5 border-t border-border mt-auto">
                  <div className="text-lg font-bold text-ink">
                    {p.price} <small className="text-xs font-normal text-muted">{p.priceNote}</small>
                  </div>
                  <button className="text-[13px] font-semibold text-white bg-primary rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}