import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteChrome } from "@/components/SiteChrome";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Brand typeface. This is the only place the font is chosen;
// globals.css picks it up through the --font-brand variable.
const brandFont = Manrope({
  variable: "--font-brand",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={cn("h-full antialiased font-sans", brandFont.variable)}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <SiteChrome>
            <Header />
          </SiteChrome>
          {children}
          <SiteChrome>
            <Footer />
          </SiteChrome>
        </TooltipProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
