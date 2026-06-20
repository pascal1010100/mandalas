import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mandalashostels.com"),
  title: {
    default: "Mandalas Hostal | San Pedro La Laguna Hostel",
    template: "%s | Mandalas Hostal",
  },
  description: "A San Pedro La Laguna hostel with two stays: Mandalas in town and Hideout near Lake Atitlan. Ask about dates on WhatsApp.",
  applicationName: "Mandalas Hostal",
  keywords: [
    "Mandalas Hostal",
    "Mandala's Hostal",
    "San Pedro La Laguna",
    "Lake Atitlan",
    "Lake Atitlan hostel",
    "Lake Atitlan hostel",
    "San Pedro hostel",
    "San Pedro La Laguna hostel",
    "Mandalas Hideout",
    "hostel Guatemala",
  ],
  authors: [{ name: "Mandalas Hostal" }],
  creator: "Mandalas Hostal",
  publisher: "Mandalas Hostal",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mandalas Hostal | San Pedro La Laguna Hostel",
    description: "Mandalas in town and Hideout near Lake Atitlan, with personal booking inquiries on WhatsApp.",
    url: "/",
    siteName: "Mandalas Hostal",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
        width: 1200,
        height: 800,
        alt: "Hammocks and courtyard at Mandalas Hostal in San Pedro La Laguna",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mandalas Hostal | San Pedro La Laguna Hostel",
    description: "Two stays in San Pedro La Laguna: a town hostel and a quieter hideout near the lake.",
    images: ["/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${outfit.variable} ${inter.variable} notranslate`} translate="no">
        {/* ThemeProvider wrapping */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
