import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { TanstackQueryProvider } from "@/providers/query-provider";
import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TanstackQueryProvider>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-4">{children}</main>
            </div>
          </div>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}