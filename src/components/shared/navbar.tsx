"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { Languages, Menu } from "lucide-react"
import { ConsultationLink } from "@/components/shared/consultation-link"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"

export function Navbar() {
    const [scrolled, setScrolled] = React.useState(false)
    const [menuOpen, setMenuOpen] = React.useState(false)
    const menuTriggerRef = React.useRef<HTMLButtonElement>(null)
    const pathname = usePathname()
    const isSpanish = pathname === "/es" || pathname.startsWith("/es/")
    const puebloPath = isSpanish ? "/es/pueblo" : "/pueblo"
    const hideoutPath = isSpanish ? "/es/hideout" : "/hideout"
    const guidePath = isSpanish ? "/es/guia" : "/guide"
    const contactPath = isSpanish ? "/es/contacto" : "/contact"
    const languagePath = isSpanish
        ? pathname === "/es/guia" ? "/guide" : pathname === "/es/contacto" ? "/contact" : pathname.replace(/^\/es/, "") || "/"
        : pathname === "/guide" ? "/es/guia" : pathname === "/contact" ? "/es/contacto" : `/es${pathname === "/" ? "" : pathname}`
    const rememberLanguage = () => {
        document.cookie = `mandalas_locale=${isSpanish ? "en" : "es"}; Path=/; Max-Age=31536000; SameSite=Lax`
    }
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
    const bookingSectionHref = pathname === contactPath ? "#book-directly" : undefined

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
                <Link href={isSpanish ? "/es" : "/"} className="group flex min-h-11 flex-col justify-center leading-none">
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
                        href={puebloPath}
                        className={cn(
                            "relative flex min-h-11 items-center px-3 py-2 transition-colors duration-300",
                            "hover:text-amber-300",
                            pathname === puebloPath
                                ? "text-amber-300"
                                : scrolled ? "text-stone-300" : "text-white/90"
                        )}
                    >
                        Mandalas
                        {pathname === puebloPath && (
                            <span className="absolute bottom-0 left-3 right-3 h-px bg-amber-300/70" />
                        )}
                    </Link>
                    <Link
                        href={hideoutPath}
                        className={cn(
                            "relative flex min-h-11 items-center px-3 py-2 transition-colors duration-300",
                            "hover:text-lime-300",
                            pathname === hideoutPath
                                ? "text-lime-300"
                                : scrolled ? "text-stone-300" : "text-white/90"
                        )}
                    >
                        Hideout
                        {pathname === hideoutPath && (
                            <span className="absolute bottom-0 left-3 right-3 h-px bg-lime-300/70" />
                        )}
                    </Link>
                    <Link
                        href={guidePath}
                        className={cn(
                            "relative flex min-h-11 items-center px-3 py-2 transition-colors duration-300",
                            "hover:text-white",
                            pathname === guidePath
                                ? "text-white"
                                : scrolled ? "text-stone-300" : "text-white/90"
                        )}
                    >
                        {isSpanish ? "Guía de viaje" : "Travel guide"}
                        {pathname === guidePath && (
                            <span className="absolute bottom-0 left-3 right-3 h-px bg-white/70" />
                        )}
                    </Link>
                    <Link
                        href={contactPath}
                        className={cn(
                            "relative flex min-h-11 items-center px-3 py-2 transition-colors duration-300",
                            "hover:text-white",
                            pathname === contactPath
                                ? "text-white"
                                : scrolled ? "text-stone-300" : "text-white/90"
                        )}
                    >
                        {isSpanish ? "Contacto" : "Contact"}
                        {pathname === contactPath && (
                            <span className="absolute bottom-0 left-3 right-3 h-px bg-white/70" />
                        )}
                    </Link>

                    <ConsultationLink
                        locale={isSpanish ? "es" : "en"}
                        location={isHideout ? "Mandalas Hideout" : isPueblo ? "Mandalas" : undefined}
                        href={bookingSectionHref}
                        className={cn(
                            "h-11 gap-2 px-6",
                            theme.button
                        )}
                    >
                        {isPueblo ? (isSpanish ? "Reservar Mandalas" : "Book Mandalas") : isHideout ? (isSpanish ? "Reservar Hideout" : "Book Hideout") : (isSpanish ? "Elige tu hospedaje" : "Choose your stay")}
                    </ConsultationLink>
                    <Link href={languagePath} hrefLang={isSpanish ? "en" : "es"} onClick={rememberLanguage} className="flex min-h-11 items-center gap-1 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/80 hover:text-white" aria-label={isSpanish ? "View site in English" : "Ver sitio en español"}>
                        <Languages className="h-4 w-4" />
                        {isSpanish ? "EN" : "ES"}
                    </Link>
                </div>

                <Sheet
                    open={menuOpen}
                    onOpenChange={(open) => {
                        setMenuOpen(open)
                        if (!open) requestAnimationFrame(() => menuTriggerRef.current?.focus())
                    }}
                >
                    <SheetTrigger asChild className="lg:hidden">
                        <Button
                            ref={menuTriggerRef}
                            variant="ghost"
                            size="icon"
                            aria-label={isSpanish ? "Abrir menú de navegación" : "Open navigation menu"}
                            className={cn("size-11 transition-colors motion-reduce:transition-none", scrolled ? "text-stone-100 hover:text-white" : "text-white hover:text-white/80")}
                            suppressHydrationWarning
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="max-h-dvh w-[50vw] min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain border-l border-white/10 bg-stone-950/95 p-0 text-stone-100 shadow-2xl shadow-black/40 backdrop-blur-3xl [&>button]:bg-stone-900/90 [&>button]:text-white [&>button]:opacity-100 [&>button]:ring-1 [&>button]:ring-white/20 [&>button]:hover:bg-stone-800 [&>button]:focus-visible:ring-2 [&>button]:focus-visible:ring-amber-300 sm:w-[320px]"
                    >
                        <div className="relative z-10 flex min-h-full flex-col px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] min-[360px]:px-4 sm:px-6">
                            <SheetHeader className="mb-5 p-0 pr-12">
                                <SheetTitle className="text-left">
                                    <div className="flex flex-col leading-none">
                                        <span className="font-heading text-lg font-black tracking-tighter text-white min-[360px]:text-xl sm:text-3xl">
                                            MANDALAS
                                        </span>
                                        <span className="mt-1 text-[10px] font-bold uppercase leading-[1.35] tracking-[0.08em] text-stone-300 min-[360px]:tracking-[0.12em] sm:text-xs">
                                            Hostels ·<span className="block sm:inline"> Lake Atitlán</span>
                                        </span>
                                    </div>
                                </SheetTitle>
                                <SheetDescription className="sr-only">
                                    {isSpanish ? "Navega a una propiedad Mandalas, contacta al equipo o consulta la guía de viaje." : "Navigate to a Mandalas property, contact the team, or read the travel guide."}
                                </SheetDescription>
                            </SheetHeader>

                            <StaggerReveal className="flex flex-1 flex-col gap-1">
                                <StaggerItem>
                                    <SheetClose asChild>
                                        <Link
                                            href={puebloPath}
                                            className={cn(
                                                "group block min-h-11 border-b border-transparent py-2 font-heading text-base font-light uppercase tracking-[0.07em] transition-all duration-300 hover:border-amber-200 dark:hover:border-amber-900 min-[360px]:tracking-[0.1em] sm:py-3 sm:text-2xl",
                                                pathname === puebloPath ? "text-amber-300 pl-4 border-amber-300/30" : "text-stone-200 hover:pl-4 hover:text-amber-300"
                                            )}
                                            aria-current={pathname === puebloPath ? "page" : undefined}
                                        >
                                            Mandalas
                                            <span className="mt-0.5 block font-sans text-[10px] lowercase leading-snug tracking-normal text-stone-300 transition-colors group-hover:text-amber-300 sm:text-xs">{isSpanish ? "en el centro de San Pedro" : "in the center of San Pedro"}</span>
                                        </Link>
                                    </SheetClose>
                                </StaggerItem>
                                <StaggerItem>
                                    <SheetClose asChild>
                                        <Link
                                            href={hideoutPath}
                                            className={cn(
                                                "group block min-h-11 border-b border-transparent py-2 font-heading text-base font-light uppercase tracking-[0.07em] transition-all duration-300 hover:border-lime-200 dark:hover:border-lime-900 min-[360px]:tracking-[0.1em] sm:py-3 sm:text-2xl",
                                                pathname === hideoutPath ? "text-lime-300 pl-4 border-lime-300/30" : "text-stone-200 hover:pl-4 hover:text-lime-300"
                                            )}
                                            aria-current={pathname === hideoutPath ? "page" : undefined}
                                        >
                                            Hideout
                                            <span className="mt-0.5 block font-sans text-[10px] lowercase leading-snug tracking-normal text-stone-300 transition-colors group-hover:text-lime-300 sm:text-xs">{isSpanish ? "naturaleza y noches tranquilas" : "nature and slower nights"}</span>
                                        </Link>
                                    </SheetClose>
                                </StaggerItem>
                                <StaggerItem>
                                    <SheetClose asChild>
                                        <Link
                                            href={guidePath}
                                            className={cn(
                                                "group block min-h-11 border-b border-transparent py-2 font-heading text-base font-light uppercase tracking-[0.07em] transition-all duration-300 hover:border-stone-200 dark:hover:border-stone-800 min-[360px]:tracking-[0.1em] sm:py-3 sm:text-2xl",
                                                pathname === guidePath ? "text-white pl-4 border-white/30" : "text-stone-400 hover:pl-4 hover:text-white"
                                            )}
                                            aria-current={pathname === guidePath ? "page" : undefined}
                                        >
                                            {isSpanish ? "Guía de viaje" : "Travel guide"}
                                            <span className="mt-0.5 block font-sans text-[10px] lowercase leading-snug tracking-normal text-stone-300 transition-colors group-hover:text-white sm:text-xs">{isSpanish ? "cómo llegar al Lago de Atitlán" : "arriving at Lake Atitlán"}</span>
                                        </Link>
                                    </SheetClose>
                                </StaggerItem>
                                <StaggerItem>
                                    <SheetClose asChild>
                                        <Link
                                            href={contactPath}
                                            className={cn(
                                                "group block min-h-11 border-b border-transparent py-2 font-heading text-base font-light uppercase tracking-[0.07em] transition-all duration-300 hover:border-stone-200 dark:hover:border-stone-800 min-[360px]:tracking-[0.1em] sm:py-3 sm:text-2xl",
                                                pathname === contactPath ? "text-white pl-4 border-white/30" : "text-stone-400 hover:pl-4 hover:text-white"
                                            )}
                                            aria-current={pathname === contactPath ? "page" : undefined}
                                        >
                                            {isSpanish ? "Contacto" : "Contact"}
                                        </Link>
                                    </SheetClose>
                                </StaggerItem>
                                <div className="mt-auto space-y-4 pt-4 sm:mb-8 sm:space-y-8">
                                    <StaggerItem>
                                        <ConsultationLink
                                            locale={isSpanish ? "es" : "en"}
                                            location={isHideout ? "Mandalas Hideout" : isPueblo ? "Mandalas" : undefined}
                                            href={bookingSectionHref}
                                            onClick={() => setMenuOpen(false)}
                                            showIcon={false}
                                            className={cn("h-12 w-full min-w-0 px-1 text-[11px] tracking-[0.04em] min-[360px]:px-2 min-[360px]:tracking-[0.07em]", theme.button)}
                                        >
                                            {isPueblo ? (isSpanish ? "RESERVAR MANDALAS" : "BOOK MANDALAS") : isHideout ? (isSpanish ? "RESERVAR HIDEOUT" : "BOOK HIDEOUT") : (isSpanish ? "ELIGE TU HOSPEDAJE" : "CHOOSE YOUR STAY")}
                                        </ConsultationLink>
                                    </StaggerItem>
                                    <StaggerItem>
                                        <SheetClose asChild>
                                            <Link href={languagePath} hrefLang={isSpanish ? "en" : "es"} onClick={rememberLanguage} className="flex min-h-11 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-300 hover:text-white">
                                                <Languages className="h-4 w-4" />
                                                {isSpanish ? "English" : "Español"}
                                            </Link>
                                        </SheetClose>
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
