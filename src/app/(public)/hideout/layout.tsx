import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Mandalas Hideout near Lake Atitlan",
    description:
        "Mandalas Hideout is the quieter San Pedro La Laguna stay near the lake and outside the center, with a terrace, kitchen, dorms, private rooms, and WhatsApp inquiries.",
    alternates: {
        canonical: "/hideout",
    },
    openGraph: {
        title: "Mandalas Hideout near Lake Atitlan",
        description:
            "A quieter stay near Lake Atitlan in San Pedro La Laguna, ideal for slowing down and checking dates on WhatsApp.",
        url: "/hideout",
        images: [
            {
                url: "/images/mandalas/hostelworld/hideout-terrace-dusk.jpg",
                width: 1200,
                height: 900,
                alt: "Mandalas Hideout terrace at dusk",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mandalas Hideout near Lake Atitlan",
        description: "A quieter hostel near the lake in San Pedro La Laguna.",
        images: ["/images/mandalas/hostelworld/hideout-terrace-dusk.jpg"],
    },
}

export default function HideoutLayout({ children }: { children: React.ReactNode }) {
    return children
}
