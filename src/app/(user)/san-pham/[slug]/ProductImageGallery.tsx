"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const safeImages = images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"];
  const [mainImage, setMainImage] = useState(safeImages[0]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square md:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
        <Image
          src={mainImage}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>

      {/* Thumbnails row */}
      {safeImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x scrollbar-hide">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img)}
              className={`relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 snap-center transition-all ${
                mainImage === img ? "border-blue-600 scale-100 ring-2 ring-blue-600 ring-offset-2" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${idx + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
