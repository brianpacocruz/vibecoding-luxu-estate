"use client";

import { FeaturedPropertyCard } from "@/components/ui/FeaturedPropertyCard";
import type { Property } from "@/lib/mockData";
import { useLocale } from "@/lib/locale-context";

interface FeaturedCollectionsProps {
  properties: Property[];
}

export function FeaturedCollections({ properties }: FeaturedCollectionsProps) {
  const { t } = useLocale();

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">
            {t.featuredCollections.title}
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            {t.featuredCollections.subtitle}
          </p>
        </div>
        <a
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
          href="#"
        >
          {t.featuredCollections.viewAll} <span className="material-icons text-sm">arrow_forward</span>
        </a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {properties.map((prop) => (
          <FeaturedPropertyCard key={prop.id} property={prop} />
        ))}
      </div>
    </section>
  );
}
