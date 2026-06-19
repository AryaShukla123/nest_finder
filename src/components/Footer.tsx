import Link from "next/link";
import {
  IconHome,
  IconFacebook,
  IconInstagram,
  IconTwitter,
  IconLinkedin,
} from "@/components/icons";

const FOOTER_COLS: { title: string; links: string[] }[] = [
  {
    title: "Properties",
    links: [
      "Apartments for Sale",
      "Apartments for Rent",
      "Independent Houses",
      "Villas & Bungalows",
      "New Projects",
      "Commercial Spaces",
    ],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Partnerships", "Blog", "Contact"],
  },
  {
    title: "Resources",
    links: [
      "EMI Calculator",
      "RERA Information",
      "Property Guide",
      "Market Trends",
      "Home Loans",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white/65 pt-16">
      <div className="max-w-container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-white/10">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="w-9 h-9 bg-primary rounded-[9px] flex items-center justify-center text-white text-base">
              <IconHome />
            </span>
            <span className="text-lg font-bold text-white tracking-tight">
              Nest<span className="text-primary">Finder</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed mt-4 mb-5 max-w-[280px]">
            India&apos;s most trusted real estate marketplace. Find your next
            home or investment with confidence.
          </p>
          <div className="flex gap-2.5">
            {[IconFacebook, IconInstagram, IconTwitter, IconLinkedin].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/[0.08] flex items-center justify-center text-sm text-white/65 hover:bg-primary hover:text-white transition-colors"
                >
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>

        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {col.title}
            </h5>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-container mx-auto px-6 flex items-center justify-between flex-wrap gap-3 py-5 text-center md:text-left">
        <p className="text-[13px]">
          © 2025 NestFinder Technologies Pvt. Ltd. All rights reserved.
        </p>
        <div className="flex gap-5 flex-wrap justify-center">
          {["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="text-[13px] text-white/45 hover:text-white transition-colors"
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>
    </footer>
  );
}