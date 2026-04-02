import type { Metadata } from "next";
import { Cormorant_Garamond, Cormorant } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Navbar from "@/components/layout/Navbar";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-medieval",
  display: "swap",
});

const cormorantDisplay = Cormorant({
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
      <body className={`min-h-screen flex flex-col ${cormorant.variable} ${cormorantDisplay.variable}`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
