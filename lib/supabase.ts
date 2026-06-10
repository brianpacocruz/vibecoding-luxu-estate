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
  image_url: string;
  image_alt: string;
  status: Property["status"];
  is_featured: boolean;
  created_at: string;
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
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    status: row.status,
    isFeatured: row.is_featured,
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

/**
 * Fetch paginated non-featured properties for the "New in Market" section.
 */
export async function getMarketProperties(
  page: number,
  filter: FilterType
): Promise<{ properties: Property[]; totalCount: number }> {
  const from = (page - 1) * PROPERTIES_PER_PAGE;
  const to = from + PROPERTIES_PER_PAGE - 1;

  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("is_featured", false)
    .order("created_at", { ascending: true });

  const statuses = STATUS_MAP[filter];
  if (statuses.length > 0) {
    query = query.in("status", statuses);
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
    .order("id", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }

  return (data as PropertyRow[]).map(rowToProperty);
}
