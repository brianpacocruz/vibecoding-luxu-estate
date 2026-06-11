import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/supabase";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyDetailClient } from "@/components/property/PropertyDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const property = await getPropertyBySlug(resolvedParams.slug);

  if (!property) {
    return {
      title: "Property Not Found | LuxeEstate",
    };
  }

  return {
    title: `${property.title} | LuxeEstate`,
    description: `Beautiful ${property.beds} bedroom property in ${property.location} for $${property.price}`,
    openGraph: {
      images: [property.images[0]],
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const resolvedParams = await params;
  const property = await getPropertyBySlug(resolvedParams.slug);

  if (!property) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <PropertyDetailClient property={property} />
    </>
  );
}
