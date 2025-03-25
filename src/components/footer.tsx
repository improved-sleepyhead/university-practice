"use client";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="z-50 fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-xs">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
        <Button
            variant="outline"
            className={`w-80 h-12 flex justify-between shadow-none border-none items-center transition-all ease-on-out duration-200
            ${open ? "hover:text-black dark:hover:bg-black hover:bg-white bg-white text-black dark:bg-black dark:text-white dark:hover:text-white" : "hover:text-white dark:hover:bg-white hover:bg-black bg-black text-white dark:bg-white dark:text-black dark:hover:text-black"}`}
        >
            Filter
        <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        />
        </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            align="center"
            className="w-80 p-5 bg-white border shadow-md rounded-lg max-h-[46rem] overflow-auto"
        >
          <Accordion type="multiple" className="w-full">
            {[
              { title: "Artists", items: ["Javer Best", "John Hoyland", "Tuba Auerbac", "Gagyi Botond", "Bastan Tamil", "Jason Skull", "Mejid Khalid"] },
              { title: "Price" },
              { title: "Color" },
              { title: "Size" },
              { title: "Category" }
            ].map(({ title, items }) => (
              <AccordionItem key={title} value={title} className="p-1">
                <AccordionTrigger className="flex justify-between items-center">
                  {title}
                </AccordionTrigger>
                <AccordionContent>
                  {items ? (
                    <ul className="pl-4 space-y-1">
                      {items.map((item) => (
                        <li key={item} className="py-1">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="pl-4 text-gray-500">Filters go here</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
