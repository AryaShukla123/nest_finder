"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IconHome,
  IconMenu,
  IconClose,
} from "@/components/icons";

const NAV_LINKS = [
  { label: "Buy", href: "/listings" },
  { label: "Rent", href: "/listings" },
  { label: "New Projects", href: "#" },
  { label: "Insights", href: "/insights" },
  { label: "Analytics", href: "/analytics" },
  { label: "Price Prediction", href: "/predict" },
];

interface NavbarProps {
  /** Which nav link should render as active on this page */
  activeLabel?: string;
}

export default function Navbar({ activeLabel = "Buy" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[999] bg-white/96 backdrop-blur-md transition-shadow ${
        scrolled ? "border-b border-border shadow-sm" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-container mx-auto px-6 h-[68px] flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="w-9 h-9 bg-primary rounded-[9px] flex items-center justify-center text-white text-base">
            <IconHome />
          </span>
          <span className="text-lg font-bold text-ink tracking-tight">
            Nest<span className="text-primary">Finder</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1 flex-1">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                  link.label === activeLabel
                    ? "bg-primary-light text-primary"
                    : "text-text hover:bg-primary-light hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
          <button className="text-sm font-semibold text-primary border-[1.5px] border-primary rounded-lg px-4 py-1.5 flex items-center gap-1.5 hover:bg-primary-light transition-colors">
            Post Property
            <span className="text-[10px] font-bold bg-accent text-white px-1.5 py-0.5 rounded tracking-wide">
              Free
            </span>
          </button>
          <Link 
    href="/auth/signin" 
    className="text-sm font-semibold text-white bg-primary rounded-lg px-5 py-2 hover:bg-primary-dark transition-colors active:scale-[0.97] inline-block text-center"
  >
    Sign In
  </Link>
        </div>

        <button
          className="lg:hidden ml-auto p-1"
          aria-label="Open menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden px-6 pb-5 pt-3 border-t border-border">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block text-[15px] font-medium px-3 py-2.5 rounded-lg text-text hover:bg-primary-light hover:text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}