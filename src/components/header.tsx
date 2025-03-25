"use client"

import { useScrollTop } from "@/hooks/use-scroll-top";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export const Header = () => {
  const scrolled = useScrollTop();
  return (
    <div className={cn("z-50 bg-background p-12 flex justify-center items-center flex-col fixed w-full",
      scrolled && "border-b shadow-sm")}>
      <div className="flex justify-center gap-x-6 mb-14">
        <Button variant="link" size="header">Featured</Button>
        <Button variant="link" size="header">Artists</Button>
        <Button variant="link" size="header">Paintings</Button>
        <Button variant="link" size="header">Drawings</Button>
        <Button variant="link" size="header">Sculptures</Button>
        <Button variant="link" size="header">Curated Collections</Button>
        <Button variant="link" size="header">Photographing</Button>
      </div>
      <h1 className="text-5xl">Featured Artworks</h1>
    </div>
  );
};
