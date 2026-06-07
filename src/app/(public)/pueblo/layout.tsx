import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Mandalas Hostal en San Pedro La Laguna",
    description:
        "Mandalas Hostal es la sede centrica para quedarte en San Pedro La Laguna: terraza, cocina, dormitorios compartidos, privadas sencillas y consulta por WhatsApp.",
    alternates: {
        canonical: "/pueblo",
    },
    openGraph: {
        title: "Mandalas Hostal en San Pedro La Laguna",
        description:
            "Hostal centrico en San Pedro La Laguna con terraza, ambiente social y consulta personalizada por WhatsApp.",
        url: "/pueblo",
        images: [
            {
                url: "/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
                width: 1200,
                height: 800,
                alt: "Patio con hamacas de Mandalas Hostal en San Pedro La Laguna",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mandalas Hostal en San Pedro La Laguna",
        description: "Hostal centrico con terraza, cocina y consulta por WhatsApp.",
        images: ["/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"],
    },
}

export default function PuebloLayout({ children }: { children: React.ReactNode }) {
    return children
}
