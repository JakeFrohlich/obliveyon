import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";

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
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
