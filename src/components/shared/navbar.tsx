"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { BookingModal } from "@/components/shared/booking-modal"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"

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

    const getNavTheme = () => {
        if (pathname.includes("/pueblo")) return {
            text: "text-amber-700 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950/30",
            hoverText: "hover:text-amber-700 dark:hover:text-amber-400",
            hoverBg: "hover:bg-amber-50/80 dark:hover:bg-amber-900/30",
            activeBg: "bg-amber-50/50 dark:bg-amber-900/20",
            indicator: "bg-amber-600 dark:bg-amber-500",
            button: "bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-orange-900/20"
        }
        if (pathname.includes("/hideout")) return {
            text: "text-lime-700 dark:text-lime-400",
            bg: "bg-lime-50 dark:bg-lime-950/30",
            hoverText: "hover:text-lime-700 dark:hover:text-lime-400",
            hoverBg: "hover:bg-lime-50/80 dark:hover:bg-lime-900/30",
            activeBg: "bg-lime-50/50 dark:bg-lime-900/20",
            indicator: "bg-lime-600 dark:bg-lime-500",
            button: "bg-gradient-to-r from-lime-600 to-green-700 hover:shadow-lime-900/20"
        }
        return {
            text: "text-stone-800 dark:text-stone-100",
            bg: "bg-stone-50 dark:bg-stone-900/50",
            hoverText: "hover:text-stone-900 dark:hover:text-stone-50",
            hoverBg: "hover:bg-stone-100 dark:hover:bg-stone-800",
            activeBg: "bg-stone-100 dark:bg-stone-800",
            indicator: "bg-stone-800 dark:bg-stone-200",
            button: "bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        }
    }

    const theme = getNavTheme()
    const isPueblo = pathname.includes("/pueblo")
    const isHideout = pathname.includes("/hideout")

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b",
                scrolled
                    ? "bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl border-stone-200/50 dark:border-white/10 shadow-lg shadow-stone-900/5 dark:shadow-black/20 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-stone-950/60"
                    : isHome
                        ? "bg-transparent border-transparent text-white"
                        : "bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl border-stone-200/50 dark:border-white/10 shadow-lg shadow-stone-900/5 dark:shadow-black/20 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-stone-950/60"
            )}
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="group flex flex-col leading-none">
                    {/* Main Brand */}
                    <span className={cn(
                        "text-3xl font-black tracking-tighter transition-all duration-300 font-heading",
                        scrolled || !isHome
                            ? "text-stone-800 dark:text-stone-100"
                            : "text-white",
                        isPueblo && "group-hover:text-amber-600",
                        isHideout && "group-hover:text-lime-600"
                    )}>
                        MANDALAS
                    </span>
                    {/* Subtitle */}
                    <span className={cn(
                        "text-[10px] font-medium tracking-wide uppercase transition-all duration-300 mt-0.5",
                        scrolled || !isHome
                            ? "text-stone-500 dark:text-stone-400"
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
                            "hover:bg-amber-50/80 hover:text-amber-700",
                            pathname === "/pueblo"
                                ? "text-amber-700 bg-amber-50/50"
                                : scrolled || !isHome ? "text-stone-700 dark:text-stone-300" : "text-white/90"
                        )}
                    >
                        Pueblo
                        {pathname === "/pueblo" && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-600" />
                        )}
                    </Link>
                    <Link
                        href="/hideout"
                        className={cn(
                            "relative px-4 py-2 rounded-lg transition-all duration-300",
                            "hover:bg-lime-50/80 hover:text-lime-700",
                            pathname === "/hideout"
                                ? "text-lime-700 bg-lime-50/50"
                                : scrolled || !isHome ? "text-stone-700 dark:text-stone-300" : "text-white/90"
                        )}
                    >
                        Hideout
                        {pathname === "/hideout" && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-lime-600" />
                        )}
                    </Link>
                    <Link
                        href="/contact"
                        className={cn(
                            "relative px-4 py-2 rounded-lg transition-all duration-300",
                            "hover:bg-stone-100 hover:text-stone-900",
                            pathname === "/contact"
                                ? "text-stone-900 bg-stone-100"
                                : scrolled || !isHome ? "text-stone-700 dark:text-stone-300" : "text-white/90"
                        )}
                    >
                        Contacto
                    </Link>

                    {/* Divider */}
                    <div className="w-px h-6 bg-stone-300/50 mx-2" />

                    <ModeToggle />

                    <BookingModal defaultLocation={isHideout ? 'hideout' : 'pueblo'}>
                        <Button
                            className={cn(
                                "rounded-full font-bold px-6 h-10 shadow-lg transition-all duration-300 text-white border-0",
                                theme.button,
                                "hover:scale-105"
                            )}
                        >
                            Reservar
                        </Button>
                    </BookingModal>
                </div>

                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className={cn("transition-colors", !scrolled && isHome ? "text-white hover:text-white/80" : "text-stone-800 dark:text-stone-100")}>
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:w-[400px] border-l-stone-200/50 dark:border-l-stone-800/50 bg-white/95 dark:bg-stone-950/95 backdrop-blur-3xl p-0 overflow-hidden">
                        {/* Decorative Background Blob */}
                        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-gradient-to-br from-amber-200/20 to-lime-200/20 rounded-full blur-[80px] pointer-events-none" />

                        <div className="h-full flex flex-col p-8 relative z-10">
                            <SheetHeader className="mb-8">
                                <SheetTitle className="text-left">
                                    <div className="flex flex-col leading-none">
                                        <span className="text-4xl font-black tracking-tighter text-stone-800 dark:text-stone-100 font-heading">
                                            MANDALAS
                                        </span>
                                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mt-1">
                                            Hostal · San Pedro
                                        </span>
                                    </div>
                                </SheetTitle>
                            </SheetHeader>

                            <StaggerReveal className="flex flex-col gap-2 flex-1">
                                <StaggerItem>
                                    <Link
                                        href="/pueblo"
                                        className={cn(
                                            "block text-3xl font-light font-heading uppercase tracking-widest py-3 transition-all duration-300 border-b border-transparent hover:border-amber-200 dark:hover:border-amber-900 group",
                                            pathname === "/pueblo" ? "text-amber-600 pl-4 border-amber-200" : "text-stone-800 dark:text-stone-200 hover:pl-4 hover:text-amber-600"
                                        )}
                                    >
                                        Pueblo
                                        <span className="block text-[10px] lowercase tracking-normal text-stone-400 font-sans group-hover:text-amber-400 transition-colors">En el corazón del pueblo</span>
                                    </Link>
                                </StaggerItem>
                                <StaggerItem>
                                    <Link
                                        href="/hideout"
                                        className={cn(
                                            "block text-3xl font-light font-heading uppercase tracking-widest py-3 transition-all duration-300 border-b border-transparent hover:border-lime-200 dark:hover:border-lime-900 group",
                                            pathname === "/hideout" ? "text-lime-600 pl-4 border-lime-200" : "text-stone-800 dark:text-stone-200 hover:pl-4 hover:text-lime-600"
                                        )}
                                    >
                                        Hideout
                                        <span className="block text-[10px] lowercase tracking-normal text-stone-400 font-sans group-hover:text-lime-400 transition-colors">Naturaleza y desconexión</span>
                                    </Link>
                                </StaggerItem>
                                <StaggerItem>
                                    <Link
                                        href="/contact"
                                        className={cn(
                                            "block text-3xl font-light font-heading uppercase tracking-widest py-3 transition-all duration-300 border-b border-transparent hover:border-stone-200 dark:hover:border-stone-800 group",
                                            pathname === "/contact" ? "text-stone-900 pl-4 border-stone-200" : "text-stone-500 dark:text-stone-400 hover:pl-4 hover:text-stone-900 dark:hover:text-white"
                                        )}
                                    >
                                        Contacto
                                    </Link>
                                </StaggerItem>

                                <div className="mt-auto mb-8 space-y-8">
                                    <StaggerItem>
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50">
                                            <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">Apariencia</span>
                                            <ModeToggle />
                                        </div>
                                    </StaggerItem>

                                    <StaggerItem>
                                        <BookingModal defaultLocation={isHideout ? 'hideout' : 'pueblo'}>
                                            <Button className={cn("w-full rounded-2xl text-xl py-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]", theme.button)}>
                                                RESERVAR AHORA
                                            </Button>
                                        </BookingModal>
                                    </StaggerItem>
                                </div>
                            </StaggerReveal>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}
