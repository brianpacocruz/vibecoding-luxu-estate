"use client";

import Link from "next/link";
import React, { useState, useTransition } from "react";
import { createProperty, updateProperty } from "@/app/admin/properties/actions";
import type { Property } from "@/lib/mockData";

interface PropertyFormProps {
  isEditing?: boolean;
  property?: Property;
}

export default function PropertyForm({ isEditing = false, property }: PropertyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [beds, setBeds] = useState(property?.beds || 3);
  const [baths, setBaths] = useState(property?.baths || 2);
  const [parking, setParking] = useState(1);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(property?.images || []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (index >= (property?.images?.length || 0)) {
      const fileIndex = index - (property?.images?.length || 0);
      setImages((prev) => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("beds", beds.toString());
    formData.set("baths", baths.toString());
    formData.set("parking", parking.toString());
    
    // Remove the default empty file input
    formData.delete("imageInput");

    images.forEach((file) => {
      formData.append("images", file);
    });

    if (isEditing && property?.images) {
      const remainingExistingImages = imagePreviews.filter((url) => property.images.includes(url));
      formData.set("existingImages", JSON.stringify(remainingExistingImages));
    }

    startTransition(() => {
      if (isEditing && property) {
        updateProperty(property.id, formData);
      } else {
        createProperty(formData);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 selection:bg-hint-green selection:text-nordic">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
              <li>
                <Link className="hover:text-mosque transition-colors" href="/admin/properties">
                  Properties
                </Link>
              </li>
              <li>
                <span className="material-icons text-xs text-gray-400">chevron_right</span>
              </li>
              <li aria-current="page" className="text-nordic">
                {isEditing ? "Edit Property" : "Add New"}
              </li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic tracking-tight mb-2">
              {isEditing ? "Edit Property" : "Add New Property"}
            </h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
              Fill in the details below to {isEditing ? "update the" : "create a new"} listing. Fields marked with * are mandatory.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/properties" className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-nordic hover:bg-gray-50 transition-colors font-medium font-sf-pro text-sm">
            Cancel
          </Link>
          <button type="submit" form="property-form" disabled={isPending} className="px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-sf-pro text-sm disabled:opacity-70 disabled:cursor-not-allowed">
            {isPending ? (
              <span className="material-icons text-sm animate-spin">refresh</span>
            ) : (
              <span className="material-icons text-sm">save</span>
            )}
            {isPending ? "Saving..." : "Save Property"}
          </button>
        </div>
      </header>

      <form id="property-form" onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">info</span>
              </div>
              <h2 className="text-xl font-bold text-nordic">Basic Information</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="title">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input required defaultValue={property?.title} name="title" className="w-full text-base px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro" id="title" placeholder="e.g. Modern Penthouse with Ocean View" type="text" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="price">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">$</span>
                    <input required defaultValue={property?.price} name="price" className="w-full pl-7 pr-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium font-sf-pro" id="price" placeholder="0.00" type="number" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="status">Status</label>
                  <select defaultValue={property?.status || "FOR SALE"} name="status" className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer" id="status">
                    <option value="FOR SALE">For Sale</option>
                    <option value="FOR RENT">For Rent</option>
                    <option value="Exclusive">Exclusive</option>
                    <option value="New Arrival">New Arrival</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="type">Property Type</label>
                  <select name="type" className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer" id="type">
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">description</span>
              </div>
              <h2 className="text-xl font-bold text-nordic">Description</h2>
            </div>
            <div className="p-8">
              <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px]" id="description" placeholder="Describe the property features, neighborhood, and unique selling points..."></textarea>
              <div className="mt-2 text-right text-xs text-gray-400 font-sf-pro">{description.length} / 2000 characters</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-hint-green/30 flex justify-between items-center bg-gradient-to-r from-hint-green/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">image</span>
                </div>
                <h2 className="text-xl font-bold text-nordic">Gallery</h2>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">JPG, PNG, WEBP</span>
            </div>
            <div className="p-8">
              <label className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-green/10 hover:border-mosque/40 transition-colors cursor-pointer group block">
                <input name="imageInput" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" multiple type="file" accept="image/*" />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
                    <span className="material-icons text-2xl">cloud_upload</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-nordic font-sf-pro">Click or drag images here</p>
                    <p className="text-xs text-gray-400 font-sf-pro">Max file size 5MB per image</p>
                  </div>
                </div>
              </label>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {imagePreviews.map((url, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm">
                      <img alt={`Preview ${i}`} className="w-full h-full object-cover" src={url} />
                      <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                        <button onClick={() => removeImage(i)} className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors" type="button"><span className="material-icons text-sm">delete</span></button>
                      </div>
                      {i === 0 && (
                        <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">Main</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">place</span>
              </div>
              <h2 className="text-lg font-bold text-nordic">Location</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="location">Address</label>
                <input defaultValue={property?.location} name="location" className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro" id="location" placeholder="Street Address, City, Zip" type="text" />
              </div>
              <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                <img alt="Map view" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-white/90 text-nordic px-3 py-1.5 rounded shadow-sm backdrop-blur-sm text-xs font-bold font-sf-pro flex items-center gap-1">
                    <span className="material-icons text-sm text-mosque">map</span> Preview
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">straighten</span>
              </div>
              <h2 className="text-lg font-bold text-nordic">Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="area">Area (m²)</label>
                  <input defaultValue={property?.area} name="area" className="w-full text-left px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm" id="area" placeholder="0" type="number" />
                </div>
                <div className="group">
                  <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="year">Year Built</label>
                  <input name="year" className="w-full text-left px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm" id="year" placeholder="YYYY" type="number" />
                </div>
              </div>
              <hr className="border-gray-100" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">bed</span> Bedrooms
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <button onClick={() => setBeds(Math.max(0, beds - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                    <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={beds} />
                    <button onClick={() => setBeds(beds + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">shower</span> Bathrooms
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <button onClick={() => setBaths(Math.max(0, baths - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                    <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={baths} />
                    <button onClick={() => setBaths(baths + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">directions_car</span> Parking
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <button onClick={() => setParking(Math.max(0, parking - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                    <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={parking} />
                    <button onClick={() => setParking(parking + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl md:hidden z-40 flex gap-3">
          <Link href="/admin/properties" className="flex-1 text-center py-3 rounded-lg border border-gray-300 bg-white text-nordic font-medium font-sf-pro">
            Cancel
          </Link>
          <button type="submit" form="property-form" disabled={isPending} className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium font-sf-pro flex justify-center items-center gap-2 disabled:opacity-70">
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
