import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Mandalas Hideout cerca del Lago Atitlan",
    description:
        "Mandalas Hideout es la sede tranquila en San Pedro La Laguna, cerca del lago y fuera del centro, con terraza, cocina, dormitorios, privadas y reserva directa por WhatsApp.",
    alternates: {
        canonical: "/hideout",
    },
    openGraph: {
        title: "Mandalas Hideout cerca del Lago Atitlan",
        description:
            "Una sede tranquila cerca del lago en San Pedro La Laguna, ideal para bajar el ritmo y reservar directo por WhatsApp.",
        url: "/hideout",
        images: [
            {
                url: "/images/mandalas/hostelworld/hideout-terrace-dusk.jpg",
                width: 1200,
                height: 900,
                alt: "Terraza de Mandalas Hideout al atardecer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mandalas Hideout cerca del Lago Atitlan",
        description: "Hostal tranquilo cerca del lago en San Pedro La Laguna.",
        images: ["/images/mandalas/hostelworld/hideout-terrace-dusk.jpg"],
    },
}

export default function HideoutLayout({ children }: { children: React.ReactNode }) {
    return children
}
