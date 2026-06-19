"use client";

import { IconChevronLeft } from "@/components/icons";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  function go(p: number) {
    onPageChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageNumbers: (number | "ellipsis")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pageNumbers.push(i);
    } else if (i === page - 2 || i === page + 2) {
      pageNumbers.push("ellipsis");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button
        disabled={page === 1}
        onClick={() => go(page - 1)}
        className="w-[38px] h-[38px] flex items-center justify-center border-[1.5px] border-border rounded-lg text-text disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary hover:bg-primary-light transition-colors"
      >
        <IconChevronLeft />
      </button>

      {pageNumbers.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="text-muted px-1">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => go(p)}
            className={`w-[38px] h-[38px] flex items-center justify-center rounded-lg text-sm font-medium border-[1.5px] transition-colors ${
              p === page
                ? "bg-primary border-primary text-white font-bold"
                : "border-border text-text hover:border-primary hover:text-primary hover:bg-primary-light"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={page === totalPages}
        onClick={() => go(page + 1)}
        className="w-[38px] h-[38px] flex items-center justify-center border-[1.5px] border-border rounded-lg text-text disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary hover:bg-primary-light transition-colors rotate-180"
      >
        <IconChevronLeft />
      </button>
    </div>
  );
}