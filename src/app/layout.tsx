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
    default: "Mandalas Hostal | Hostal en San Pedro La Laguna",
    template: "%s | Mandalas Hostal",
  },
  description: "Hostal en San Pedro La Laguna con dos sedes: Mandalas en el centro y Hideout cerca del Lago Atitlan. Consulta disponibilidad y reserva directo por WhatsApp.",
  applicationName: "Mandalas Hostal",
  keywords: [
    "Mandalas Hostal",
    "Mandala's Hostal",
    "San Pedro La Laguna",
    "Lago Atitlan",
    "hostal Lago Atitlan",
    "Lake Atitlan hostel",
    "Hostal en San Pedro",
    "hostal San Pedro La Laguna",
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
    title: "Mandalas Hostal | Hostal en San Pedro La Laguna",
    description: "Mandalas en el centro y Hideout cerca del Lago Atitlan, con reserva directa por WhatsApp.",
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
    title: "Mandalas Hostal | Hostal en San Pedro La Laguna",
    description: "Dos sedes en San Pedro La Laguna: centro y hideout cerca del lago.",
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
