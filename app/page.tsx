import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { NewInMarket } from "@/components/home/NewInMarket";
import {
  getFeaturedProperties,
  getMarketProperties,
  type FilterType,
} from "@/lib/supabase";

interface HomePageProps {
  searchParams: Promise<{ page?: string; filter?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));
  const rawFilter = params.filter ?? "All";
  const filter: FilterType =
    rawFilter === "Buy" || rawFilter === "Rent" ? rawFilter : "All";

  const [featuredProperties, { properties, totalCount }] = await Promise.all([
    getFeaturedProperties(),
    getMarketProperties(currentPage, filter),
  ]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection />
        <FeaturedCollections properties={featuredProperties} />
        <Suspense fallback={null}>
          <NewInMarket
            properties={properties}
            totalCount={totalCount}
            currentPage={currentPage}
            filter={filter}
          />
        </Suspense>
      </main>
    </>
  );
}

