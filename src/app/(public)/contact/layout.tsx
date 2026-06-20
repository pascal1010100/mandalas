import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact and Stay Inquiry",
    description:
        "Contact Mandalas Hostal to check dates and choose between Mandalas in town or Hideout near the lake in San Pedro La Laguna.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact and Stay Inquiry | Mandalas Hostal",
        description:
            "Check dates on WhatsApp and choose the stay that best fits your trip.",
        url: "/contact",
        images: [
            {
                url: "/images/mandalas/pueblo-dock-boat.jpg",
                width: 1200,
                height: 630,
                alt: "San Pedro La Laguna by Lake Atitlan",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact and Stay Inquiry | Mandalas Hostal",
        description: "Check dates and your ideal stay on WhatsApp.",
        images: ["/images/mandalas/pueblo-dock-boat.jpg"],
    },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children
}
