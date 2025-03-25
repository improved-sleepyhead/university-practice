"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { TanstackQueryProvider } from "@/providers/query-provider";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Footer } from "@/components/footer";
import { useGalleryStore } from "@/hooks/use-store-filters";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loadFilters, isLoading } = useGalleryStore();
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  useEffect(() => {
    loadFilters().then(() => setFiltersLoaded(true));
  }, []);

  return (
    <html lang="en">
      <body>
        <TanstackQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col h-screen">
              <Header />
              <main className="flex-1 p-4 pt-52">
                {filtersLoaded ? children : <div className="text-center py-8">Loading gallery...</div>}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
