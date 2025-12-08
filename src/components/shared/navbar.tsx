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
                    ? "bg-white/80 backdrop-blur-md border-border shadow-sm text-foreground"
                    : isHome
                        ? "bg-transparent border-transparent text-white"
                        : "bg-white/80 backdrop-blur-md border-border shadow-sm text-foreground"
            )}
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                    MANDALAS
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 items-center font-medium">
                    <Link href="/pueblo" className="hover:text-primary transition-colors">
                        Pueblo
                    </Link>
                    <Link href="/hideout" className="hover:text-primary transition-colors">
                        Hideout
                    </Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">
                        Contacto
                    </Link>
                    <BookingModal>
                        <Button
                            className={cn(
                                "rounded-full font-bold px-6",
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
                            <SheetTitle className="text-left text-2xl font-bold">Menú</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-6 mt-10">
                            <Link href="/pueblo" className="text-xl font-medium hover:text-primary">
                                Mandalas
                            </Link>
                            <Link href="/hideout" className="text-xl font-medium hover:text-primary">
                                Mandalas Hideout
                            </Link>
                            <Link href="/contact" className="text-xl font-medium hover:text-primary">
                                Contacto
                            </Link>
                            <Button className="w-full rounded-full text-lg py-6">Reservar Ahora</Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}
