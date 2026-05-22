import type { Metadata } from "next";
import { Cormorant_Garamond, Cormorant, Italiana } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import BackgroundMusic from "@/components/audio/BackgroundMusic";

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

const italiana = Italiana({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-luxe",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://obliveyon.com"),
  title: "Obliveyon — Dark Luxury Streetwear",
  description:
    "Premium streetwear for those who move through the world on their own terms. Built for the bold. Designed for the future.",
  keywords: ["streetwear", "luxury", "fashion", "dark", "clothing", "Obliveyon"],
  openGraph: {
    title: "Obliveyon — Dark Luxury Streetwear",
    description: "Premium streetwear for the bold.",
    type: "website",
    url: "https://obliveyon.com",
    siteName: "Obliveyon",
  },
  twitter: {
    card: "summary_large_image",
    title: "Obliveyon — Dark Luxury Streetwear",
    description: "Premium streetwear for the bold.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen flex flex-col ${cormorant.variable} ${cormorantDisplay.variable} ${italiana.variable}`}>
        <Providers>
          <main className="flex-1">{children}</main>
        </Providers>
        <BackgroundMusic />
        <Analytics />
      </body>
    </html>
  );
}
