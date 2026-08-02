"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ConsultationLink } from "@/components/shared/consultation-link"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"

export function Navbar() {
    const [scrolled, setScrolled] = React.useState(false)
    const [menuOpen, setMenuOpen] = React.useState(false)
    const pathname = usePathname()
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
            button: "border-white/15 bg-white text-stone-950 hover:bg-stone-200"
        }
        if (pathname.includes("/hideout")) return {
            text: "text-lime-700 dark:text-lime-400",
            bg: "bg-lime-50 dark:bg-lime-950/30",
            hoverText: "hover:text-lime-700 dark:hover:text-lime-400",
            hoverBg: "hover:bg-lime-50/80 dark:hover:bg-lime-900/30",
            activeBg: "bg-lime-50/50 dark:bg-lime-900/20",
            indicator: "bg-lime-600 dark:bg-lime-500",
            button: "border-white/15 bg-white text-stone-950 hover:bg-stone-200"
        }
        return {
            text: "text-stone-800 dark:text-stone-100",
            bg: "bg-stone-50 dark:bg-stone-900/50",
            hoverText: "hover:text-stone-900 dark:hover:text-stone-50",
            hoverBg: "hover:bg-stone-100 dark:hover:bg-stone-800",
            activeBg: "bg-stone-100 dark:bg-stone-800",
            indicator: "bg-stone-800 dark:bg-stone-200",
            button: "border-white/15 bg-white text-stone-950 hover:bg-stone-200"
        }
    }

    const theme = getNavTheme()
    const isPueblo = pathname.includes("/pueblo")
    const isHideout = pathname.includes("/hideout")
    const bookingSectionHref = pathname === "/contact" ? "#book-directly" : undefined

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 border-b transition-all duration-300 motion-reduce:transition-none",
                scrolled
                    ? "bg-stone-950/80 backdrop-blur-xl border-white/10 shadow-lg shadow-black/20 supports-[backdrop-filter]:bg-stone-950/60"
                    : "bg-transparent border-transparent text-white"
            )}
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="group flex min-h-11 flex-col justify-center leading-none">
                    {/* Main Brand */}
                    <span className={cn(
                        "text-3xl font-black tracking-tighter transition-all duration-300 font-heading",
                        scrolled ? "text-stone-100" : "text-white",
                        isPueblo && "group-hover:text-amber-600",
                        isHideout && "group-hover:text-lime-600"
                    )}>
                        MANDALAS
                    </span>
                    {/* Subtitle */}
                    <span className={cn(
                        "text-[10px] font-medium tracking-wide uppercase transition-all duration-300 mt-0.5",
                        scrolled ? "text-stone-400" : "text-white/70"
                    )}>
                        Hostels · Lake Atitlán
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-2 font-medium lg:flex">
                    <Link
                        href="/pueblo"
                        className={cn(
                            "relative flex min-h-11 items-center px-3 py-2 transition-colors duration-300",
                            "hover:text-amber-300",
                            pathname === "/pueblo"
                                ? "text-amber-300"
                                : scrolled ? "text-stone-300" : "text-white/90"
                        )}
                    >
                        Mandalas
                        {pathname === "/pueblo" && (
                            <span className="absolute bottom-0 left-3 right-3 h-px bg-amber-300/70" />
                        )}
                    </Link>
                    <Link
                        href="/hideout"
                        className={cn(
                            "relative flex min-h-11 items-center px-3 py-2 transition-colors duration-300",
                            "hover:text-lime-300",
                            pathname === "/hideout"
                                ? "text-lime-300"
                                : scrolled ? "text-stone-300" : "text-white/90"
                        )}
                    >
                        Hideout
                        {pathname === "/hideout" && (
                            <span className="absolute bottom-0 left-3 right-3 h-px bg-lime-300/70" />
                        )}
                    </Link>
                    <Link
                        href="/contact"
                        className={cn(
                            "relative flex min-h-11 items-center px-3 py-2 transition-colors duration-300",
                            "hover:text-white",
                            pathname === "/contact"
                                ? "text-white"
                                : scrolled ? "text-stone-300" : "text-white/90"
                        )}
                    >
                        Contact
                        {pathname === "/contact" && (
                            <span className="absolute bottom-0 left-3 right-3 h-px bg-white/70" />
                        )}
                    </Link>

                    <ConsultationLink
                        location={isHideout ? "Mandalas Hideout" : isPueblo ? "Mandalas" : undefined}
                        href={bookingSectionHref}
                        className={cn(
                            "h-11 gap-2 px-6",
                            theme.button
                        )}
                    >
                        {isPueblo ? "Book Mandalas" : isHideout ? "Book Hideout" : "Choose your stay"}
                    </ConsultationLink>
                </div>

                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Open navigation menu"
                            className={cn("size-11 transition-colors motion-reduce:transition-none", scrolled ? "text-stone-100 hover:text-white" : "text-white hover:text-white/80")}
                            suppressHydrationWarning
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="max-h-dvh w-full overflow-y-auto overscroll-contain border-l border-white/10 bg-stone-950/95 p-0 backdrop-blur-3xl sm:w-[400px]">
                        <div className="relative z-10 flex min-h-full flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8">
                            <SheetHeader className="mb-4 sm:mb-8">
                                <SheetTitle className="text-left">
                                    <div className="flex flex-col leading-none">
                                        <span className="font-heading text-3xl font-black tracking-tighter text-stone-800 dark:text-stone-100 sm:text-4xl">
                                            MANDALAS
                                        </span>
                                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mt-1">
                                            Hostels · Lake Atitlán
                                        </span>
                                    </div>
                                </SheetTitle>
                            </SheetHeader>

                            <StaggerReveal className="flex flex-col gap-2 flex-1">
                                <StaggerItem>
                                    <SheetClose asChild>
                                        <Link
                                            href="/pueblo"
                                            className={cn(
                                                "group block min-h-11 border-b border-transparent py-2 font-heading text-2xl font-light uppercase tracking-widest transition-all duration-300 hover:border-amber-200 dark:hover:border-amber-900 sm:py-3 sm:text-3xl",
                                                pathname === "/pueblo" ? "text-amber-300 pl-4 border-amber-300/30" : "text-stone-200 hover:pl-4 hover:text-amber-300"
                                            )}
                                        >
                                            Mandalas
                                            <span className="block text-[10px] lowercase tracking-normal text-stone-400 font-sans group-hover:text-amber-400 transition-colors">in the center of San Pedro</span>
                                        </Link>
                                    </SheetClose>
                                </StaggerItem>
                                <StaggerItem>
                                    <SheetClose asChild>
                                        <Link
                                            href="/hideout"
                                            className={cn(
                                                "group block min-h-11 border-b border-transparent py-2 font-heading text-2xl font-light uppercase tracking-widest transition-all duration-300 hover:border-lime-200 dark:hover:border-lime-900 sm:py-3 sm:text-3xl",
                                                pathname === "/hideout" ? "text-lime-300 pl-4 border-lime-300/30" : "text-stone-200 hover:pl-4 hover:text-lime-300"
                                            )}
                                        >
                                            Hideout
                                            <span className="block text-[10px] lowercase tracking-normal text-stone-400 font-sans group-hover:text-lime-400 transition-colors">nature and slower nights</span>
                                        </Link>
                                    </SheetClose>
                                </StaggerItem>
                                <StaggerItem>
                                    <SheetClose asChild>
                                        <Link
                                            href="/contact"
                                            className={cn(
                                                "group block min-h-11 border-b border-transparent py-2 font-heading text-2xl font-light uppercase tracking-widest transition-all duration-300 hover:border-stone-200 dark:hover:border-stone-800 sm:py-3 sm:text-3xl",
                                                pathname === "/contact" ? "text-white pl-4 border-white/30" : "text-stone-400 hover:pl-4 hover:text-white"
                                            )}
                                        >
                                            Contact
                                        </Link>
                                    </SheetClose>
                                </StaggerItem>
                                <div className="mt-auto space-y-4 pt-4 sm:mb-8 sm:space-y-8">
                                    <StaggerItem>
                                        <ConsultationLink
                                            location={isHideout ? "Mandalas Hideout" : isPueblo ? "Mandalas" : undefined}
                                            href={bookingSectionHref}
                                            onClick={() => setMenuOpen(false)}
                                            className={cn("h-14 w-full gap-2", theme.button)}
                                        >
                                            {isPueblo ? "BOOK MANDALAS" : isHideout ? "BOOK HIDEOUT" : "CHOOSE YOUR STAY"}
                                        </ConsultationLink>
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
