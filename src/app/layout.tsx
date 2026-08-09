import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.mandalashostels.com"),
  title: {
    default: "Mandalas Hostels | San Pedro La Laguna, Atitlán",
    template: "%s | Mandalas Hostal",
  },
  description: "Choose between Mandalas in town and Hideout near Lake Atitlán. Check live availability and book direct for your stay in San Pedro La Laguna.",
  applicationName: "Mandalas Hostal",
  keywords: [
    "Mandalas Hostal",
    "Mandala's Hostal",
    "San Pedro La Laguna",
    "Lake Atitlan",
    "Lake Atitlan hostel",
    "San Pedro hostel",
    "San Pedro La Laguna hostel",
    "Mandalas Hideout",
    "hostel Guatemala",
  ],
  authors: [{ name: "Mandalas Hostal" }],
  creator: "Mandalas Hostal",
  publisher: "Mandalas Hostal",
  verification: {
    google: "P_umI9VQ3JAZ9YH-PIWi75Brvqw-8i0MGTRoNh_GZZ4",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/mandalas-favicon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/mandalas-favicon.png",
  },
  openGraph: {
    title: "Mandalas Hostels | San Pedro La Laguna, Atitlán",
    description: "Choose between Mandalas in town and Hideout near Lake Atitlán. Check live availability and book direct for your stay in San Pedro La Laguna.",
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
    title: "Mandalas Hostels | San Pedro La Laguna, Atitlán",
    description: "Choose between Mandalas in town and Hideout near Lake Atitlán. Check live availability and book direct for your stay in San Pedro La Laguna.",
    images: ["/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${outfit.variable} ${inter.variable}`}>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
