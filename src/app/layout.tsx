import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { MobileCTA } from "@/components/shared/mobile-cta"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mandalas Hostal - San Pedro La Laguna",
  description: "Experience the harmonic duality of Mandalas: Social Vibes at the Pueblo, Nature Retreat at the Hideout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-stone-50`}
      >
        {children}
      </body>
    </html>
  );
}
