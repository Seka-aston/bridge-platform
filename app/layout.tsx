import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

// Brand typeface. This is the only place the font is chosen;
// globals.css picks it up through the --font-brand variable.
const brandFont = Manrope({
  variable: "--font-brand",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${brandFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
