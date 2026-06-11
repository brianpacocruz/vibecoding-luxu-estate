"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[4/3] bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">
      <span className="material-icons text-slate-300 text-4xl">map</span>
    </div>
  ),
});

interface DynamicMapProps {
  lat: number;
  lng: number;
  title: string;
}

export default function DynamicMap(props: DynamicMapProps) {
  return <PropertyMap {...props} />;
}
