import { IconStar } from "@/components/icons";

const TESTIMONIALS = [
  {
    rating: 5,
    text: "Found our 3BHK in Gomti Nagar within two weeks. The verified listings made shortlisting so much easier — no wasted trips.",
    name: "Arjun Khanna",
    city: "Lucknow",
    initials: "AK",
  },
  {
    rating: 5,
    text: "The home loan assistance feature saved us weeks of running around banks. Got pre-approved in 3 days and closed the deal smoothly.",
    name: "Sunita Pillai",
    city: "Bengaluru",
    initials: "SP",
  },
  {
    rating: 4,
    text: "Browsed 200+ properties in Pune without leaving the couch. The virtual tours are excellent. Finalised a 2BHK in Wakad with zero stress.",
    name: "Rahul Mehta",
    city: "Pune",
    initials: "RM",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="mb-10 text-center">
          <p className="text-[13px] font-semibold tracking-wider uppercase text-primary mb-1.5">
            Real stories
          </p>
          <h2 className="font-display font-bold text-ink text-[clamp(24px,3vw,34px)]">
            Homebuyers trust NestFinder
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="relative bg-surface border border-border rounded p-7"
            >
              <span className="absolute top-4 right-6 font-display text-7xl text-primary/10 leading-none select-none">
                &rdquo;
              </span>
              <div className="flex gap-0.5 text-amber-500 mb-3.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} filled={i < t.rating} className="w-3.5 h-3.5" />
                ))}
              </div>
              <p className="text-sm text-text leading-relaxed mb-5">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-muted mt-0.5">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}