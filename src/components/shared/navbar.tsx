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
                <div className="hidden md:flex gap-8 items-center font-medium">
                    <Link
                        href="/pueblo"
                        className={cn(
                            "relative hover:text-primary transition-colors py-2",
                            pathname === "/pueblo" && "text-primary"
                        )}
                    >
                        Pueblo
                        {pathname === "/pueblo" && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                        )}
                    </Link>
                    <Link
                        href="/hideout"
                        className={cn(
                            "relative hover:text-primary transition-colors py-2",
                            pathname === "/hideout" && "text-primary"
                        )}
                    >
                        Hideout
                        {pathname === "/hideout" && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                        )}
                    </Link>
                    <Link
                        href="/contact"
                        className={cn(
                            "relative hover:text-primary transition-colors py-2",
                            pathname === "/contact" && "text-primary"
                        )}
                    >
                        Contacto
                        {pathname === "/contact" && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                        )}
                    </Link>
                    <BookingModal>
                        <Button
                            className={cn(
                                "rounded-full font-bold px-6 shadow-lg transition-all hover:scale-105",
                                !scrolled && isHome ? "bg-white text-black hover:bg-white/90" : ""
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
