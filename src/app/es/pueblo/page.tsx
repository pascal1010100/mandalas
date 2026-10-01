import type { Metadata } from "next"
import { PuebloPageContent } from "@/app/(public)/pueblo/page"

const description = "Hospédate en Mandalas Hostal, una opción céntrica, caminable y social en San Pedro La Laguna. Consulta fechas y precios en Cloudbeds."
export const metadata: Metadata = { title: { absolute: "Hostal céntrico en San Pedro La Laguna | Mandalas" }, description, alternates: { canonical: "/es/pueblo", languages: { "es-GT": "/es/pueblo", en: "/pueblo", "x-default": "/pueblo" } }, openGraph: { title: "Hostal céntrico en San Pedro La Laguna | Mandalas", description, url: "/es/pueblo", images: [{ url: "/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg", width: 1200, height: 800, alt: "Patio con hamacas de Mandalas Hostal" }] }, twitter: { card: "summary_large_image", title: "Hostal céntrico en San Pedro La Laguna | Mandalas", description, images: ["/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"] } }
export default function SpanishPuebloPage() { return <PuebloPageContent locale="es" /> }
