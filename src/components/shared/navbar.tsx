"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { BookingModal } from "@/components/shared/booking-modal"

export function Navbar() {
    const [scrolled, setScrolled] = React.useState(false)
    const pathname = usePathname()
    const isHome = pathname === "/"

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b",
                scrolled
                    ? "bg-white/95 backdrop-blur-xl border-stone-200/50 shadow-lg shadow-stone-900/5"
                    : isHome
                        ? "bg-transparent border-transparent text-white"
                        : "bg-white/95 backdrop-blur-xl border-stone-200/50 shadow-lg shadow-stone-900/5"
            )}
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="group flex flex-col leading-none">
                    {/* Main Brand */}
                    <span className={cn(
                        "text-3xl font-black tracking-tighter transition-all duration-300",
                        "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent",
                        "group-hover:scale-105 inline-block"
                    )}>
                        MANDALAS
                    </span>
                    {/* Subtitle */}
                    <span className={cn(
                        "text-[10px] font-medium tracking-wide uppercase transition-all duration-300 mt-0.5",
                        scrolled || !isHome
                            ? "text-stone-500"
                            : "text-white/70"
                    )}>
                        Hostal · San Pedro
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-2 items-center font-medium">
                    <Link
                        href="/pueblo"
                        className={cn(
                            "relative px-4 py-2 rounded-lg transition-all duration-300",
                            "hover:bg-stone-100/80 hover:text-purple-600",
                            pathname === "/pueblo"
                                ? "text-purple-600 bg-purple-50/50"
                                : scrolled || !isHome ? "text-stone-700" : "text-white/90"
                        )}
                    >
                        Pueblo
                        {pathname === "/pueblo" && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600" />
                        )}
                    </Link>
                    <Link
                        href="/hideout"
                        className={cn(
                            "relative px-4 py-2 rounded-lg transition-all duration-300",
                            "hover:bg-stone-100/80 hover:text-purple-600",
                            pathname === "/hideout"
                                ? "text-purple-600 bg-purple-50/50"
                                : scrolled || !isHome ? "text-stone-700" : "text-white/90"
                        )}
                    >
                        Hideout
                        {pathname === "/hideout" && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600" />
                        )}
                    </Link>
                    <Link
                        href="/contact"
                        className={cn(
                            "relative px-4 py-2 rounded-lg transition-all duration-300",
                            "hover:bg-stone-100/80 hover:text-purple-600",
                            pathname === "/contact"
                                ? "text-purple-600 bg-purple-50/50"
                                : scrolled || !isHome ? "text-stone-700" : "text-white/90"
                        )}
                    >
                        Contacto
                        {pathname === "/contact" && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600" />
                        )}
                    </Link>

                    {/* Divider */}
                    <div className="w-px h-6 bg-stone-300/50 mx-2" />

                    <BookingModal>
                        <Button
                            className={cn(
                                "rounded-full font-bold px-6 h-10 shadow-lg transition-all duration-300",
                                "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500",
                                "hover:shadow-xl hover:scale-105 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600",
                                "text-white border-0"
                            )}
                        >
                            Reservar
                        </Button>
                    </BookingModal>
                </div>

                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className={cn(!scrolled && isHome ? "text-white hover:text-white/80" : "")}>
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle className="text-left">
                                <div className="flex flex-col leading-none">
                                    <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                                        MANDALAS
                                    </span>
                                    <span className="text-[10px] font-medium tracking-wide uppercase text-stone-500 mt-0.5">
                                        Hostal · San Pedro
                                    </span>
                                </div>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-6 mt-10">
                            <Link
                                href="/pueblo"
                                className={cn(
                                    "text-xl font-medium hover:text-primary transition-colors",
                                    pathname === "/pueblo" && "text-primary font-bold"
                                )}
                            >
                                Pueblo
                            </Link>
                            <Link
                                href="/hideout"
                                className={cn(
                                    "text-xl font-medium hover:text-primary transition-colors",
                                    pathname === "/hideout" && "text-primary font-bold"
                                )}
                            >
                                Hideout
                            </Link>
                            <Link
                                href="/contact"
                                className={cn(
                                    "text-xl font-medium hover:text-primary transition-colors",
                                    pathname === "/contact" && "text-primary font-bold"
                                )}
                            >
                                Contacto
                            </Link>
                            <BookingModal>
                                <Button className="w-full rounded-full text-lg py-6 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                    Reservar Ahora
                                </Button>
                            </BookingModal>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}
