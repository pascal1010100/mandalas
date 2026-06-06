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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mandalas-sigma.vercel.app"),
  title: {
    default: "Mandalas Hostal | San Pedro La Laguna",
    template: "%s | Mandalas Hostal",
  },
  description: "Dos formas de quedarte en San Pedro La Laguna: Mandalas en el centro y Hideout cerca del lago, con reservas directas por WhatsApp.",
  applicationName: "Mandalas Hostal",
  keywords: [
    "Mandalas Hostal",
    "San Pedro La Laguna",
    "Lake Atitlan hostel",
    "Hostal en San Pedro",
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
    title: "Mandalas Hostal | San Pedro La Laguna",
    description: "Una base social en el centro y un hideout tranquilo cerca del lago Atitlan.",
    url: "/",
    siteName: "Mandalas Hostal",
    locale: "es_GT",
    type: "website",
    images: [
      {
        url: "/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
        width: 1200,
        height: 800,
        alt: "Hamacas y patio de Mandalas Hostal en San Pedro La Laguna",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mandalas Hostal | San Pedro La Laguna",
    description: "Mandalas en el centro y Hideout cerca del lago.",
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
    <html lang="es-GT" suppressHydrationWarning>
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
