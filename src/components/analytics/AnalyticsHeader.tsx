import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface AnalyticsHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  crumb: string;
}

export default function AnalyticsHeader({ icon: Icon, title, description, crumb }: AnalyticsHeaderProps) {
  return (
    <div className="mb-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-4">
        <Link href="/" className="hover:text-ink transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/analytics" className="hover:text-ink transition-colors">
          Analytics
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-ink font-medium">{crumb}</span>
      </nav>

      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-[10px] bg-primary-light flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
        </div>
        <div>
          <h1 className="font-display text-[28px] md:text-3xl font-bold text-ink leading-tight mb-1.5">
            {title}
          </h1>
          <p className="text-muted text-[15px] max-w-2xl">{description}</p>
        </div>
      </div>
    </div>
  );
}
