"use client";

import { Artwork } from "@/types/gallery";
import { useState } from "react";

interface ArtCardProps {
  artwork: Omit<Artwork, "category"> & { price: string; previewUrl: string };
}

export const ArtCard = ({ artwork }: ArtCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(artwork.previewUrl);

  return (
    <div className="w-[300px] mx-auto text-left">
      <div className="mb-3 relative">
        <img
          src={imageSrc}
          alt={`${artwork.title} by ${artwork.artist}`}
          className={`w-full max-h-screen h-auto object-contain transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-50 blur-sm"
          }`}
          loading="lazy"
          onLoad={() => {
            setLoaded(true);
            setImageSrc(artwork.imageUrl); // Подменяем на полноценное изображение
          }}
        />
      </div>

      <div className="max-w-full space-y-1">
        <p className="font-medium text-base">{artwork.artist}</p>
        <p className="text-sm italic">
          {artwork.title}, {artwork.year}
        </p>
        <p className="text-sm text-gray-600">{artwork.gallery}</p>
        <p className="font-medium text-base mt-1">{artwork.price}</p>
      </div>
    </div>
  );
};
