"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Generate slug from title
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadImages(propertyId: string, files: File[]) {
  const supabase = await createSupabaseServerClient();
  const urls: string[] = [];

  for (const file of files) {
    if (file.size === 0 || file.name === "undefined") continue;
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${propertyId}/${fileName}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image:", error);
      continue;
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(filePath);

    urls.push(data.publicUrl);
  }

  return urls;
}

export async function createProperty(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));
  const status = formData.get("status") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const area = Number(formData.get("area"));
  const year = formData.get("year"); // currently unused in Property type, could ignore
  const beds = Number(formData.get("beds"));
  const baths = Number(formData.get("baths"));
  const parking = Number(formData.get("parking")); // Not in PropertyRow yet, but could be added or ignored
  
  const latStr = formData.get("lat");
  const lngStr = formData.get("lng");
  const lat = latStr ? Number(latStr) : null;
  const lng = lngStr ? Number(lngStr) : null;
  
  // Note: we're reusing `imageAlt` for description or title if empty
  const imageAlt = title;
  const slug = generateSlug(title);
  const propertyId = crypto.randomUUID();

  // Handle files
  const files = formData.getAll("images") as File[];
  const uploadedUrls = await uploadImages(propertyId, files);

  const newProperty = {
    id: propertyId,
    title,
    location,
    price,
    beds,
    baths,
    area,
    status,
    image_alt: imageAlt,
    is_featured: false,
    is_disabled: false,
    slug,
    images: uploadedUrls,
    lat,
    lng,
  };

  const { error } = await supabase.from("properties").insert(newProperty);

  if (error) {
    console.error("Error creating property:", error);
    throw new Error("Failed to create property");
  }

  revalidatePath("/admin/properties");
  revalidatePath("/");
  redirect("/admin/properties");
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));
  const status = formData.get("status") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const area = Number(formData.get("area"));
  const beds = Number(formData.get("beds"));
  const baths = Number(formData.get("baths"));

  const latStr = formData.get("lat");
  const lngStr = formData.get("lng");
  const lat = latStr ? Number(latStr) : null;
  const lng = lngStr ? Number(lngStr) : null;

  const slug = generateSlug(title);

  // Check if there are new files to upload
  const files = formData.getAll("images") as File[];
  const newUrls = await uploadImages(id, files);

  // Existing images passed as JSON
  const existingImagesJson = formData.get("existingImages") as string;
  const existingImages = existingImagesJson ? JSON.parse(existingImagesJson) : [];

  const allImages = [...existingImages, ...newUrls];

  const updatedProperty = {
    title,
    location,
    price,
    beds,
    baths,
    area,
    status,
    slug,
    images: allImages,
    lat,
    lng,
  };

  const { error } = await supabase
    .from("properties")
    .update(updatedProperty)
    .eq("id", id);

  if (error) {
    console.error("Error updating property:", error);
    throw new Error("Failed to update property");
  }

  revalidatePath("/admin/properties");
  revalidatePath("/");
  redirect("/admin/properties");
}

export async function togglePropertyStatus(id: string, isDisabled: boolean) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("properties")
    .update({ is_disabled: isDisabled })
    .eq("id", id);

  if (error) {
    console.error("Error toggling property status:", error);
    throw new Error("Failed to toggle property status");
  }

  revalidatePath("/admin/properties");
  revalidatePath("/");
}

export async function deleteImageFromStorage(url: string) {
  const supabase = await createSupabaseServerClient();
  
  // Extract path from public URL
  // e.g. https://.../storage/v1/object/public/property-images/123/file.jpg
  const parts = url.split("/property-images/");
  if (parts.length < 2) return;
  const filePath = parts[1];

  const { error } = await supabase.storage
    .from("property-images")
    .remove([filePath]);

  if (error) {
    console.error("Error deleting image:", error);
  }
}
