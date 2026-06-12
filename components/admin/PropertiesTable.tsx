"use client";

import type { Property } from "@/lib/mockData";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  "FOR SALE": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "FOR RENT": "bg-sky-50 text-sky-700 border-sky-200",
  "Exclusive": "bg-violet-50 text-violet-700 border-violet-200",
  "New Arrival": "bg-amber-50 text-amber-700 border-amber-200",
};

export default function PropertiesTable({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16 text-nordic-muted">
        <span className="material-icons text-5xl mb-3 opacity-30 block">apartment</span>
        No properties found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-nordic-dark/5 text-nordic-muted text-xs font-semibold uppercase tracking-wider">
            <th className="px-5 py-3.5 text-left">Property</th>
            <th className="px-5 py-3.5 text-left">Location</th>
            <th className="px-5 py-3.5 text-left">Status</th>
            <th className="px-5 py-3.5 text-right">Price</th>
            <th className="px-5 py-3.5 text-center">Beds</th>
            <th className="px-5 py-3.5 text-center">Baths</th>
            <th className="px-5 py-3.5 text-center">Area m²</th>
            <th className="px-5 py-3.5 text-center">Featured</th>
            <th className="px-5 py-3.5 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 bg-white">
          {properties.map((p) => (
            <tr key={p.id} className="hover:bg-background-light/50 transition-colors group">
              <td className="px-5 py-4">
                <p className="font-semibold text-nordic-dark line-clamp-1 max-w-[220px]">
                  {p.title}
                </p>
                <p className="text-nordic-muted text-xs mt-0.5 font-mono">{p.id.slice(0, 8)}…</p>
              </td>
              <td className="px-5 py-4 text-nordic-muted">
                <div className="flex items-center gap-1.5">
                  <span className="material-icons text-sm opacity-50">place</span>
                  {p.location}
                </div>
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    STATUS_COLORS[p.status] ?? "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-5 py-4 text-right font-semibold text-nordic-dark">
                ${p.price.toLocaleString()}{p.priceSuffix ?? ""}
              </td>
              <td className="px-5 py-4 text-center text-nordic-muted">{p.beds}</td>
              <td className="px-5 py-4 text-center text-nordic-muted">{p.baths}</td>
              <td className="px-5 py-4 text-center text-nordic-muted">{p.area}</td>
              <td className="px-5 py-4 text-center">
                {p.isFeatured ? (
                  <span className="material-icons text-mosque text-base">star</span>
                ) : (
                  <span className="material-icons text-black/20 text-base">star_border</span>
                )}
              </td>
              <td className="px-5 py-4 text-center">
                <Link
                  href={`/property/${p.slug}`}
                  target="_blank"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-nordic-dark/5 hover:bg-mosque hover:text-white text-nordic-muted transition-all duration-200"
                  title="View property"
                >
                  <span className="material-icons text-sm">open_in_new</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
