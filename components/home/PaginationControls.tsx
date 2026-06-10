"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { PROPERTIES_PER_PAGE, type FilterType } from "@/lib/supabase";

interface PaginationControlsProps {
  currentPage: number;
  totalCount: number;
  filter: FilterType;
}

export function PaginationControls({
  currentPage,
  totalCount,
  filter,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCount / PROPERTIES_PER_PAGE);

  const createUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      return `?${params.toString()}`;
    },
    [searchParams]
  );

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Prev */}
      <button
        onClick={() => router.push(createUrl(currentPage - 1))}
        disabled={currentPage === 1}
        className="pagination-btn"
        aria-label="Previous page"
      >
        <span className="material-icons text-lg">chevron_left</span>
      </button>

      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => router.push(createUrl(page))}
          className={`pagination-page ${
            page === currentPage ? "pagination-page--active" : ""
          }`}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => router.push(createUrl(currentPage + 1))}
        disabled={currentPage === totalPages}
        className="pagination-btn"
        aria-label="Next page"
      >
        <span className="material-icons text-lg">chevron_right</span>
      </button>
    </div>
  );
}
