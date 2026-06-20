import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Mandalas Hostal in San Pedro La Laguna",
    description:
        "Mandalas Hostal is the central San Pedro La Laguna stay: rooftop, kitchen, shared dorms, simple private rooms, and WhatsApp inquiries.",
    alternates: {
        canonical: "/pueblo",
    },
    openGraph: {
        title: "Mandalas Hostal in San Pedro La Laguna",
        description:
            "A central San Pedro La Laguna hostel with a rooftop, social energy, and personal WhatsApp inquiries.",
        url: "/pueblo",
        images: [
            {
                url: "/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
                width: 1200,
                height: 800,
                alt: "Courtyard with hammocks at Mandalas Hostal in San Pedro La Laguna",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mandalas Hostal in San Pedro La Laguna",
        description: "A central hostel with a rooftop, kitchen, and WhatsApp inquiries.",
        images: ["/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"],
    },
}

export default function PuebloLayout({ children }: { children: React.ReactNode }) {
    return children
}
