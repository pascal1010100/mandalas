"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ConsultationLink } from "@/components/shared/consultation-link"

export function MobileCTA() {
    const pathname = usePathname()
    const isPropertyPage = pathname === "/pueblo" || pathname === "/hideout"
    const [revealedForPath, setRevealedForPath] = useState<string | null>(null)

    useEffect(() => {
        if (!isPropertyPage) return

        const heroBookingCta = document.querySelector<HTMLElement>(
            "[data-property-hero-booking-cta]"
        ) ?? document.querySelector<HTMLElement>("main a[href*='cloudbeds']")

        if (!heroBookingCta) return

        const updateVisibility = (isIntersecting: boolean, bottom: number) => {
            setRevealedForPath(!isIntersecting && bottom <= 0 ? pathname : null)
        }

        if (typeof IntersectionObserver === "undefined") {
            const updateFromViewport = () => {
                const rect = heroBookingCta.getBoundingClientRect()
                updateVisibility(rect.bottom > 0 && rect.top < window.innerHeight, rect.bottom)
            }
            const initialFrame = window.requestAnimationFrame(updateFromViewport)

            window.addEventListener("scroll", updateFromViewport, { passive: true })
            window.addEventListener("resize", updateFromViewport)

            return () => {
                window.cancelAnimationFrame(initialFrame)
                window.removeEventListener("scroll", updateFromViewport)
                window.removeEventListener("resize", updateFromViewport)
            }
        }

        const observer = new IntersectionObserver(([entry]) => {
            updateVisibility(entry.isIntersecting, entry.boundingClientRect.bottom)
        })

        observer.observe(heroBookingCta)

        return () => observer.disconnect()
    }, [isPropertyPage, pathname])

    if (pathname === "/contact") return null

    if (pathname === "/") {
        return (
            <>
                <div className="h-[calc(3.75rem+max(0.75rem,env(safe-area-inset-bottom)))] md:hidden" aria-hidden="true" />
                <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-white/10 bg-stone-950/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
                    <ConsultationLink
                        location="Mandalas"
                        showIcon={false}
                        className="h-12 w-full border-white/20 bg-white px-3 text-xs text-stone-950 hover:bg-stone-200"
                    >
                        Book Mandalas
                    </ConsultationLink>
                    <ConsultationLink
                        location="Mandalas Hideout"
                        showIcon={false}
                        className="h-12 w-full border-lime-200/30 bg-lime-200 px-3 text-xs text-lime-950 hover:bg-lime-100"
                    >
                        Book Hideout
                    </ConsultationLink>
                </div>
            </>
        )
    }

    if (pathname === "/guide") {
        return (
            <>
                <div className="h-[calc(4rem+max(1rem,env(safe-area-inset-bottom)))] md:hidden" aria-hidden="true" />
                <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-stone-950/92 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
                    <ConsultationLink
                        href="/contact#book-directly"
                        showIcon={false}
                        className="h-12 w-full border-white/20 bg-white text-stone-950 hover:bg-stone-200 focus-visible:ring-white focus-visible:ring-offset-stone-950"
                    >
                        Choose your stay
                    </ConsultationLink>
                </div>
            </>
        )
    }

    const location = pathname.includes("/hideout")
        ? "Mandalas Hideout"
        : pathname.includes("/pueblo")
            ? "Mandalas"
            : "Mandalas Hostal"

    if (isPropertyPage && revealedForPath !== pathname) return null

    return (
        <>
            <div className="h-[calc(4rem+max(1rem,env(safe-area-inset-bottom)))] md:hidden" aria-hidden="true" />
            <div
                data-property-mobile-booking-bar={isPropertyPage ? "" : undefined}
                className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-stone-950/88 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
            >
                <ConsultationLink
                    location={location}
                    showIcon={false}
                    className="h-12 w-full animate-in gap-2 border-white/20 bg-white text-stone-950 duration-500 slide-in-from-bottom hover:bg-stone-200 motion-reduce:animate-none"
                >
                    {location.includes("Hideout") ? "Book Hideout" : "Book Mandalas"}
                </ConsultationLink>
            </div>
        </>
    )
}
