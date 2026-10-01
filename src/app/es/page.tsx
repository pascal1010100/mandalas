import type { Metadata } from "next"

import { HomePageContent } from "@/app/(public)/page"

const description = "Compara Mandalas Hostal en el centro y Mandalas Hideout cerca del Lago de Atitlán para elegir dónde hospedarte en San Pedro La Laguna."

export const metadata: Metadata = {
    title: { absolute: "Hostales en San Pedro La Laguna | Mandalas Hostels" },
    description,
    alternates: {
        canonical: "/es",
        languages: { "es-GT": "/es", en: "/", "x-default": "/" },
    },
    openGraph: {
        title: "Hostales en San Pedro La Laguna | Mandalas Hostels",
        description,
        url: "/es",
        images: [{
            url: "/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
            width: 1200,
            height: 800,
            alt: "Patio con hamacas de Mandalas Hostal en San Pedro La Laguna",
        }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Hostales en San Pedro La Laguna | Mandalas Hostels",
        description,
        images: ["/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"],
    },
}

export default function SpanishHomePage() {
    return <HomePageContent locale="es" />
}
