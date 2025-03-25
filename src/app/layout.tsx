import { Header } from "@/components/header";
import { TanstackQueryProvider } from "@/providers/query-provider";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Footer } from "@/components/footer";

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
            <main className="flex-1 p-4 pt-52">
              {children}
            </main>
            <Footer/>
          </div>
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}