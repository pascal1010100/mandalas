import type { Metadata } from "next"
import { HideoutPageContent } from "@/app/(public)/hideout/page"

const description = "Mandalas Hideout ofrece una estancia tranquila cerca del Lago de Atitlán, fuera del centro de San Pedro La Laguna. Consulta fechas y habitaciones."
export const metadata: Metadata = { title: { absolute: "Hostal tranquilo cerca del Lago de Atitlán | Mandalas Hideout" }, description, alternates: { canonical: "/es/hideout", languages: { "es-GT": "/es/hideout", en: "/hideout", "x-default": "/hideout" } }, openGraph: { title: "Hostal tranquilo cerca del Lago de Atitlán | Mandalas Hideout", description, url: "/es/hideout", images: [{ url: "/images/mandalas/hostelworld/hideout-terrace-dusk.jpg", width: 1200, height: 900, alt: "Terraza de Mandalas Hideout al atardecer" }] }, twitter: { card: "summary_large_image", title: "Hostal tranquilo cerca del Lago de Atitlán | Mandalas Hideout", description, images: ["/images/mandalas/hostelworld/hideout-terrace-dusk.jpg"] } }
export default function SpanishHideoutPage() { return <HideoutPageContent locale="es" /> }
