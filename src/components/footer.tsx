"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGalleryStore } from "@/hooks/use-store-filters";

export const Footer = () => {
  const {
    collections,
    users,
    categories,
    isLoading,
    setFilters,
    resetFilters,
    search,
    category,
    artCategory,
  } = useGalleryStore();

  const [open, setOpen] = useState(false);

  const renderFilterButtons = (items: string[], filterKey: "search" | "category" | "artCategory") => (
    <div className="flex flex-col space-y-2 p-2">
      {items.map((item) => {
        const isActive =
          filterKey === "search" ? search === item :
          filterKey === "category" ? category === item :
          artCategory === item;

        return (
          <Button
            key={item}
            variant="ghost"
            className={`relative flex items-center justify-between px-4 py-2 rounded-full transition-all
              ${isActive ? "bg-black text-white" : "bg-transparent text-black dark:text-white"}`}
            onClick={() => setFilters({ [filterKey]: isActive ? "" : item })}
          >
            {item}
            {isActive && (
              <div className="ml-2 w-5 h-5 flex items-center justify-center text-white rounded-full">
                +
              </div>
            )}
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="z-50 fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-xs">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`w-80 h-12 flex justify-between shadow-none border-none items-center transition-all ease-out duration-200
            ${open ? "hover:text-black dark:hover:bg-black hover:bg-white bg-white text-black dark:bg-black dark:text-white" : 
                      "hover:text-white dark:hover:bg-white hover:bg-black bg-black text-white dark:bg-white dark:text-black"}`}
          >
            Filter
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="center"
          className="w-80 p-5 bg-white border shadow-md rounded-lg max-h-[46rem] overflow-auto"
        >
          {isLoading ? (
            <div className="text-center p-4">Loading filters...</div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {collections.length > 0 && (
                <AccordionItem value="collections">
                  <AccordionTrigger>Collections</AccordionTrigger>
                  <AccordionContent>{renderFilterButtons(collections, "category")}</AccordionContent>
                </AccordionItem>
              )}

              {users.length > 0 && (
                <AccordionItem value="users">
                  <AccordionTrigger>Artists</AccordionTrigger>
                  <AccordionContent>{renderFilterButtons(users, "search")}</AccordionContent>
                </AccordionItem>
              )}

              {categories.length > 0 && (
                <AccordionItem value="categories">
                  <AccordionTrigger>Categories</AccordionTrigger>
                  <AccordionContent>{renderFilterButtons(categories, "artCategory")}</AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          )}

          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => {
                resetFilters();
                setOpen(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
