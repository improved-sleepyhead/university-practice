"use client";

import { Artwork } from "@/types/gallery";
import { useEffect, useRef, useState } from "react";

interface ArtCardProps {
  artwork: Omit<Artwork, "category"> & { price: string };
}

export const ArtCard = ({ artwork }: ArtCardProps) => {
  return (
    <div className="w-[300px] mx-auto text-left">
      {/* Изображение */}
      <div className="mb-3">
      <img
        src={artwork.imageUrl}
        alt={`${artwork.title} by ${artwork.artist}`}
        className="w-full max-h-screen h-auto object-contain"
        loading="lazy"
      />
      </div>

      {/* Текстовый блок */}
      <div className="max-w-full space-y-1">
        <p className="font-medium text-base">{artwork.artist}</p>
        <p className="text-sm italic">{artwork.title}, {artwork.year}</p>
        <p className="text-sm text-gray-600">{artwork.gallery}</p>
        <p className="font-medium text-base mt-1">{artwork.price}</p>
      </div>
    </div>
  );
};

