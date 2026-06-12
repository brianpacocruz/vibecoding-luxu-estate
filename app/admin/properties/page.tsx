import { getAllProperties } from "@/lib/supabase";
import PropertiesTable from "@/components/admin/PropertiesTable";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const properties = await getAllProperties();

  const forSale = properties.filter((p) =>
    ["FOR SALE", "Exclusive", "New Arrival"].includes(p.status)
  ).length;
  const forRent = properties.filter((p) => p.status === "FOR RENT").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-mosque/10 rounded-xl flex items-center justify-center">
            <span className="material-icons text-mosque text-base">apartment</span>
          </div>
          <h1 className="text-2xl font-bold text-nordic-dark">Properties</h1>
        </div>
        <p className="text-nordic-muted">
          Manage all your property listings in one place.
        </p>
      </div>

      {/* Quick stats bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-white rounded-2xl px-6 py-4 border border-black/5 shadow-card">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-nordic-dark inline-block" />
          <span className="font-semibold text-nordic-dark">{properties.length}</span>
          <span className="text-nordic-muted">total</span>
        </div>
        <div className="h-4 w-px bg-black/10" />
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span className="font-semibold text-nordic-dark">{forSale}</span>
          <span className="text-nordic-muted">for sale</span>
        </div>
        <div className="h-4 w-px bg-black/10" />
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
          <span className="font-semibold text-nordic-dark">{forRent}</span>
          <span className="text-nordic-muted">for rent</span>
        </div>
        <div className="h-4 w-px bg-black/10" />
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-mosque inline-block" />
          <span className="font-semibold text-nordic-dark">
            {properties.filter((p) => p.isFeatured).length}
          </span>
          <span className="text-nordic-muted">featured</span>
        </div>
      </div>

      {/* Table */}
      <PropertiesTable properties={properties} />
    </div>
  );
}
