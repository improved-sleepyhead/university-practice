import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { TanstackQueryProvider } from "@/providers/query-provider";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
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
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-4">{children}</main>
            </div>
          </div>
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}