import { createClient } from "@supabase/supabase-js";
import type { Property } from "./mockData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ──────────────────────────────────────────────
// Types that map Supabase snake_case → camelCase
// ──────────────────────────────────────────────
interface PropertyRow {
  id: string;
  title: string;
  location: string;
  price: number;
  price_suffix: string | null;
  beds: number;
  baths: number;
  area: number;
  image_alt: string;
  status: Property["status"];
  is_featured: boolean;
  created_at: string;
  slug: string;
  images: string[];
  lat: number | null;
  lng: number | null;
}

function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: row.price,
    priceSuffix: row.price_suffix === "/mo" ? "/mo" : undefined,
    beds: row.beds,
    baths: row.baths,
    area: row.area,
    imageAlt: row.image_alt,
    status: row.status,
    isFeatured: row.is_featured,
    slug: row.slug,
    images: row.images,
    lat: row.lat,
    lng: row.lng,
  };
}

// ──────────────────────────────────────────────
// Queries
// ──────────────────────────────────────────────
export const PROPERTIES_PER_PAGE = 8;

export type FilterType = "All" | "Buy" | "Rent";

const STATUS_MAP: Record<FilterType, string[]> = {
  All: [],
  Buy: ["FOR SALE", "Exclusive", "New Arrival"],
  Rent: ["FOR RENT"],
};

export interface SearchOptions {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  type?: string;
}

/**
 * Fetch paginated non-featured properties for the "New in Market" section.
 */
export async function getMarketProperties(
  page: number,
  filter: FilterType,
  options?: SearchOptions
): Promise<{ properties: Property[]; totalCount: number }> {
  const from = (page - 1) * PROPERTIES_PER_PAGE;
  const to = from + PROPERTIES_PER_PAGE - 1;

  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("is_featured", false)
    .order("created_at", { ascending: true });

  const statuses = STATUS_MAP[filter];
  if (statuses && statuses.length > 0) {
    query = query.in("status", statuses);
  }

  if (options) {
    if (options.q) {
      query = query.or(`title.ilike.%${options.q}%,location.ilike.%${options.q}%`);
    }
    if (options.minPrice) {
      query = query.gte("price", options.minPrice);
    }
    if (options.maxPrice) {
      query = query.lte("price", options.maxPrice);
    }
    if (options.beds) {
      query = query.gte("beds", options.beds);
    }
    if (options.baths) {
      query = query.gte("baths", options.baths);
    }
    if (options.type && options.type !== "All" && options.type !== "Any Type") {
      query = query.ilike("title", `%${options.type}%`);
    }
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("Supabase error:", error.message);
    return { properties: [], totalCount: 0 };
  }

  return {
    properties: (data as PropertyRow[]).map(rowToProperty),
    totalCount: count ?? 0,
  };
}

/**
 * Fetch the 2 featured properties for the "Featured Collections" section.
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .order("id", { ascending: true })
    .limit(2);

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }

  return (data as PropertyRow[]).map(rowToProperty);
}

/**
 * Fetch a single property by its slug.
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }

  return data ? rowToProperty(data as PropertyRow) : null;
}
