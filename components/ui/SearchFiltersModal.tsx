"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/locale-context";

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchFiltersModal({ isOpen, onClose }: SearchFiltersModalProps) {
  const router = useRouter();
  const { t } = useLocale();
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("Any Type");
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);

  const [amenities, setAmenities] = useState<Record<string, boolean>>({
    pool: false,
    gym: false,
    parking: false,
    ac: false,
    wifi: false,
    patio: false,
  });

  if (!isOpen) return null;

  const toggleAmenity = (key: string) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    if (location) params.set("q", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (propertyType !== "Any Type") params.set("type", propertyType);
    if (beds > 0) params.set("beds", beds.toString());
    if (baths > 0) params.set("baths", baths.toString());

    const activeAmenities = Object.entries(amenities).filter(([, v]) => v).map(([k]) => k);
    if (activeAmenities.length > 0) {
      params.set("amenities", activeAmenities.join(","));
    }

    router.push(`/?${params.toString()}`);
    onClose();
  };

  const clearFilters = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setPropertyType("Any Type");
    setBeds(0);
    setBaths(0);
    setAmenities({
      pool: false,
      gym: false,
      parking: false,
      ac: false,
      wifi: false,
      patio: false,
    });
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <main className="pointer-events-auto relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t.filters.title}</h1>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <span className="material-icons">close</span>
            </button>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
            {/* Section 1: Location */}
            <section>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {t.filters.location}
              </label>
              <div className="relative group">
                <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">
                  location_on
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-[#f5f8f6] border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm outline-none"
                  placeholder={t.filters.locationPlaceholder}
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </section>

            {/* Section 2: Price Range */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t.filters.priceRange}
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f5f8f6] p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                  <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                    {t.filters.minPrice}
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">$</span>
                    <input
                      className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm outline-none"
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="bg-[#f5f8f6] p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                  <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                    {t.filters.maxPrice}
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">$</span>
                    <input
                      className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm outline-none"
                      type="number"
                      placeholder="Any"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Property Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Property Type */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t.filters.propertyType}
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[#f5f8f6] border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 appearance-none focus:ring-2 focus:ring-mosque cursor-pointer outline-none"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="Any Type">{t.filters.anyType}</option>
                    <option value="House">{t.filters.house}</option>
                    <option value="Apartment">{t.filters.apartment}</option>
                    <option value="Condo">{t.filters.condo}</option>
                    <option value="Townhouse">{t.filters.townhouse}</option>
                  </select>
                  <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Rooms */}
              <div className="space-y-4">
                {/* Beds */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{t.filters.bedrooms}</span>
                  <div className="flex items-center space-x-3 bg-[#f5f8f6] rounded-full p-1">
                    <button
                      onClick={() => setBeds(Math.max(0, beds - 1))}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque transition-colors"
                    >
                      <span className="material-icons text-base">remove</span>
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{beds}+</span>
                    <button
                      onClick={() => setBeds(beds + 1)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    >
                      <span className="material-icons text-base">add</span>
                    </button>
                  </div>
                </div>

                {/* Baths */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{t.filters.bathrooms}</span>
                  <div className="flex items-center space-x-3 bg-[#f5f8f6] rounded-full p-1">
                    <button
                      onClick={() => setBaths(Math.max(0, baths - 1))}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque transition-colors"
                    >
                      <span className="material-icons text-base">remove</span>
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{baths}+</span>
                    <button
                      onClick={() => setBaths(baths + 1)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    >
                      <span className="material-icons text-base">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Amenities */}
            <section>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {t.filters.amenitiesTitle}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <AmenityToggle
                  icon="pool" label={t.filters.pool}
                  isActive={amenities.pool}
                  onClick={() => toggleAmenity("pool")}
                />
                <AmenityToggle
                  icon="fitness_center" label={t.filters.gym}
                  isActive={amenities.gym}
                  onClick={() => toggleAmenity("gym")}
                />
                <AmenityToggle
                  icon="local_parking" label={t.filters.parking}
                  isActive={amenities.parking}
                  onClick={() => toggleAmenity("parking")}
                />
                <AmenityToggle
                  icon="ac_unit" label={t.filters.ac}
                  isActive={amenities.ac}
                  onClick={() => toggleAmenity("ac")}
                />
                <AmenityToggle
                  icon="wifi" label={t.filters.wifi}
                  isActive={amenities.wifi}
                  onClick={() => toggleAmenity("wifi")}
                />
                <AmenityToggle
                  icon="deck" label={t.filters.patio}
                  isActive={amenities.patio}
                  onClick={() => toggleAmenity("patio")}
                />
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
            >
              {t.filters.clearAll}
            </button>
            <button
              onClick={handleApply}
              className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all flex items-center gap-2 transform active:scale-95"
            >
              {t.filters.apply}
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </footer>
        </main>
      </div>
    </>
  );
}

function AmenityToggle({ icon, label, isActive, onClick }: { icon: string; label: string; isActive: boolean; onClick: () => void }) {
  if (isActive) {
    return (
      <label className="cursor-pointer group relative" onClick={onClick}>
        <div className="h-full px-4 py-3 rounded-lg border border-mosque bg-mosque/5 text-mosque font-medium text-sm flex items-center justify-center gap-2 transition-all hover:bg-mosque/10">
          <span className="material-icons text-lg">{icon}</span>
          {label}
        </div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full opacity-100 transition-opacity"></div>
      </label>
    );
  }

  return (
    <label className="cursor-pointer group" onClick={onClick}>
      <div className="h-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm flex items-center justify-center gap-2 transition-all hover:border-gray-300">
        <span className="material-icons text-lg text-gray-400 group-hover:text-gray-500">{icon}</span>
        {label}
      </div>
    </label>
  );
}
