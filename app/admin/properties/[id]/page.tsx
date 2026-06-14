import PropertyForm from "@/components/admin/PropertyForm";
import { getPropertyById } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const property = await getPropertyById(resolvedParams.id);

  if (!property) {
    notFound();
  }

  return <PropertyForm isEditing={true} property={property} />;
}
