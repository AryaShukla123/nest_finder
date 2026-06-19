// Lightweight inline SVG icons. Centralizing these avoids pulling in
// a full icon font (Font Awesome) just for ~20 glyphs, and keeps every
// icon tree-shakeable and themeable via currentColor.

type IconProps = { className?: string };

const base = "w-[1em] h-[1em]";

export function IconHome({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.7 2 11h3v9h6v-6h2v6h6v-9h3L12 2.7z" />
    </svg>
  );
}

export function IconMenu({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconClose({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconSearch({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function IconLocation({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

export function IconCheckCircle({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 14.4-4.2-4.2 1.4-1.4 2.8 2.8 6-6 1.4 1.4-7.4 7.4z" />
    </svg>
  );
}

export function IconBed({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M3 7v11h2v-3h14v3h2v-7a3 3 0 0 0-3-3h-6v3H8a1 1 0 0 0-1 1v-1H5V7H3zm9 3h6a1 1 0 0 1 1 1v2H8v-2a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function IconBath({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 2a2 2 0 0 0-2 2v5H4a1 1 0 0 0-1 1v2a6 6 0 0 0 4 5.65V20h2v-2h6v2h2v-2.35A6 6 0 0 0 21 12v-2a1 1 0 0 0-1-1H7V4a.5.5 0 0 1 .5-.5c.2 0 .35.1.45.27l1.4 2.4 1.7-1L9.7 1.8A2.5 2.5 0 0 0 7.5 0 2.5 2.5 0 0 0 5 2.5V4h2V2z" />
    </svg>
  );
}

export function IconArea({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M8 3v4M3 8h4" />
    </svg>
  );
}

export function IconHeart({ className = base, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      className={className}
      aria-hidden
    >
      <path d="M12 21s-7.5-4.6-10-9.3C.5 8.3 2 4.8 5.4 4.1 8 3.5 10 5 12 7c2-2 4-3.5 6.6-2.9C22 4.8 23.5 8.3 22 11.7 19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export function IconArrowRight({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconChevronDown({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconChevronLeft({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function IconSliders({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <path strokeLinecap="round" d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M22 18h0" />
      <circle cx="16" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGrid({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

export function IconList({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <path strokeLinecap="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

export function IconBuilding({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16h2v-9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v9h1v2H3v-2h1zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm4-8h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm6 0h2v2h-2v-2zm0-4h2v2h-2v-2z" />
    </svg>
  );
}

export function IconCalendar({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path strokeLinecap="round" d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconShield({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3zm-1 14.4-3.4-3.4 1.4-1.4 2 2 4.6-4.6 1.4 1.4-6 6z" />
    </svg>
  );
}

export function IconCash({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" d="M6 6v.01M18 18v.01" />
    </svg>
  );
}

export function IconScale({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M5 7l-3 6a3 3 0 0 0 6 0l-3-6zm14 0l-3 6a3 3 0 0 0 6 0l-3-6zM5 7h14M8 21h8" />
    </svg>
  );
}

export function IconHeadset({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <path d="M4 13a8 8 0 1 1 16 0" />
      <rect x="2" y="13" width="4" height="6" rx="1" />
      <rect x="18" y="13" width="4" height="6" rx="1" />
      <path strokeLinecap="round" d="M20 19a4 4 0 0 1-4 4h-2" />
    </svg>
  );
}

export function IconStar({ className = base, filled = true }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      className={className}
      aria-hidden
    >
      <path d="M12 2l3.1 6.6 7.1.8-5.3 4.9 1.5 7-6.4-3.7-6.4 3.7 1.5-7-5.3-4.9 7.1-.8L12 2z" />
    </svg>
  );
}

export function IconXMark({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} fill="none" className={className} aria-hidden>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconSad({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M8 15s1.5-2 4-2 4 2 4 2M9 9h.01M15 9h.01" />
    </svg>
  );
}

export function IconFacebook({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.6.7-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

export function IconInstagram({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c2.7 0 3.1 0 4.1.1 1.1 0 1.8.2 2.5.5.6.2 1.1.6 1.6 1.1.5.5.8 1 1.1 1.6.3.6.5 1.4.5 2.5.1 1 .1 1.4.1 4.1s0 3.1-.1 4.1c0 1.1-.2 1.8-.5 2.5-.2.6-.6 1.1-1.1 1.6-.5.5-1 .8-1.6 1.1-.6.3-1.4.5-2.5.5-1 .1-1.4.1-4.1.1s-3.1 0-4.1-.1c-1.1 0-1.8-.2-2.5-.5-.6-.2-1.1-.6-1.6-1.1-.5-.5-.8-1-1.1-1.6-.3-.6-.5-1.4-.5-2.5C2 15.1 2 14.7 2 12s0-3.1.1-4.1c0-1.1.2-1.8.5-2.5.2-.6.6-1.1 1.1-1.6.5-.5 1-.8 1.6-1.1.6-.3 1.4-.5 2.5-.5C8.9 2 9.3 2 12 2zm0 1.8c-2.6 0-3 0-4 .1-.9 0-1.4.2-1.7.3-.4.2-.7.4-1 .7-.3.3-.5.6-.7 1-.1.3-.3.8-.3 1.7-.1 1-.1 1.4-.1 4s0 3 .1 4c0 .9.2 1.4.3 1.7.2.4.4.7.7 1 .3.3.6.5 1 .7.3.1.8.3 1.7.3 1 .1 1.4.1 4 .1s3 0 4-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.4 1-.7.3-.3.5-.6.7-1 .1-.3.3-.8.3-1.7.1-1 .1-1.4.1-4s0-3-.1-4c0-.9-.2-1.4-.3-1.7a2.6 2.6 0 0 0-.7-1 2.6 2.6 0 0 0-1-.7c-.3-.1-.8-.3-1.7-.3-1-.1-1.4-.1-4-.1zm0 3.5a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8zm5.9-3.6a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
    </svg>
  );
}

export function IconTwitter({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.9 3H22l-7 8 7.6 10h-6L11.6 14 5 21H2l7.5-8.5L2 3h6.1l4.6 6.3L18.9 3z" />
    </svg>
  );
}

export function IconLinkedin({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9.7h4v10.8H3V9.7zm6.5 0H13v1.5h.05c.5-.9 1.7-1.8 3.5-1.8 3.7 0 4.4 2.4 4.4 5.6v6.5h-4v-5.8c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v5.9h-4V9.7z" />
    </svg>
  );
}