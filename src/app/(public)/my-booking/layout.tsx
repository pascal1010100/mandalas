import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Mi reserva",
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: null,
    },
    openGraph: null,
    twitter: null,
}

export default function MyBookingLayout({ children }: { children: React.ReactNode }) {
    return children
}
