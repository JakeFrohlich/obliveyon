import type { Metadata } from "next";
import { EB_Garamond, Cormorant } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";

// Body / "medieval" — EB Garamond is a Garamond revival: old-world serif character,
// readable at small sizes, pairs with Cormorant. Replaces Jost (geometric sans).
const bodyFont = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-medieval",
  display: "swap",
});

// Display / headings — Cormorant. Unchanged.
const displayFont = Cormorant({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-gothic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Obliveyon — Dark Luxury Streetwear",
  description:
    "Premium streetwear for those who move through the world on their own terms. Built for the bold. Designed for the future.",
  keywords: ["streetwear", "luxury", "fashion", "dark", "clothing", "Obliveyon"],
  openGraph: {
    title: "Obliveyon — Dark Luxury Streetwear",
    description: "Premium streetwear for the bold.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen flex flex-col ${bodyFont.variable} ${displayFont.variable}`}>
        <Providers>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
