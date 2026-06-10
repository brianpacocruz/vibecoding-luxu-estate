import Link from "next/link";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { PaginationControls } from "@/components/home/PaginationControls";
import type { Property } from "@/lib/mockData";
import type { FilterType } from "@/lib/supabase";

interface NewInMarketProps {
  properties: Property[];
  totalCount: number;
  currentPage: number;
  filter: FilterType;
}

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "All", value: "All" },
  { label: "Buy", value: "Buy" },
  { label: "Rent", value: "Rent" },
];

export function NewInMarket({
  properties,
  totalCount,
  currentPage,
  filter,
}: NewInMarketProps) {
  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">
            New in Market
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            Fresh opportunities added this week.{" "}
            <span className="text-mosque font-medium">{totalCount}</span>{" "}
            properties found.
          </p>
        </div>
        <div className="hidden md:flex bg-white p-1 rounded-lg">
          {FILTER_OPTIONS.map(({ label, value }) => (
            <Link
              key={value}
              href={`?filter=${value}&page=1`}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === value
                  ? "bg-nordic-dark text-white shadow-sm"
                  : "text-nordic-muted hover:text-nordic-dark"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.length === 0 ? (
          <div className="col-span-full text-center py-16 text-nordic-muted">
            <span className="material-icons text-4xl mb-3 block opacity-40">
              search_off
            </span>
            <p>No properties found for this filter.</p>
          </div>
        ) : (
          properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))
        )}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalCount={totalCount}
        filter={filter}
      />
    </section>
  );
}
