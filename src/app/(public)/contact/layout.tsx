import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contacto y reserva directa",
    description:
        "Contacta a Mandalas Hostal para consultar disponibilidad, fechas y elegir entre Mandalas en el centro o Hideout cerca del lago en San Pedro La Laguna.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contacto y reserva directa | Mandalas Hostal",
        description:
            "Escríbenos por WhatsApp para consultar fechas y elegir la sede que mejor va con tu viaje.",
        url: "/contact",
        images: [
            {
                url: "/images/mandalas/pueblo-dock-boat.jpg",
                width: 1200,
                height: 630,
                alt: "San Pedro La Laguna junto al Lago Atitlan",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contacto y reserva directa | Mandalas Hostal",
        description: "Consulta fechas y disponibilidad por WhatsApp.",
        images: ["/images/mandalas/pueblo-dock-boat.jpg"],
    },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children
}
