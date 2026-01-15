"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CalendarDays, Users, Home, Menu, Sparkles, Settings as SettingsIcon, SprayCan, ArrowRight, ShoppingBag, Package } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { LogoutButton } from "@/components/admin/logout-button"
import { AutoSyncHandler } from "@/components/admin/auto-sync-handler"

// Sidebar component extracted to avoid React lint error
function SidebarContent({ pathname }: { pathname: string }) {
    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/reservations", label: "Reservas", icon: Users },
        { href: "/admin/events", label: "Eventos", icon: CalendarDays },
        { href: "/admin/housekeeping", label: "Limpieza", icon: SprayCan },
        { href: "/admin/products", label: "Minibar", icon: ShoppingBag },
        { href: "/admin/inventory", label: "Bodega", icon: Package }, // New Link
        { href: "/admin/settings", label: "Configuración", icon: SettingsIcon },
    ]

    return (
        <div className="flex flex-col h-full bg-stone-950 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-stone-900 to-transparent opacity-50 pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Logo Area */}
            <div className="h-28 flex items-center px-8 relative z-10">
                <Link href="/" className="group flex items-center gap-4 w-full p-2 rounded-2xl hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-stone-900 to-stone-800 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-500 relative overflow-hidden group-hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Sparkles className="w-5 h-5 text-amber-500 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold font-heading tracking-[0.15em] text-white uppercase group-hover:text-amber-500 transition-colors duration-300">
                            Mandalas
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[0.6rem] uppercase tracking-widest text-stone-500 group-hover:text-stone-400 transition-colors notranslate" translate="no" suppressHydrationWarning>Admin Portal</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto relative z-10">
                <div className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.2em] mb-4 px-4 py-2">Menu Principal</div>
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "text-white shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                                    : "text-stone-500 hover:text-stone-200 hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-900 border border-white/5 rounded-xl" />
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-amber-500 rounded-r-full shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                                </>
                            )}

                            <div className={cn(
                                "relative z-10 p-2 rounded-lg transition-all duration-300",
                                isActive ? "bg-amber-500/10 text-amber-500" : "bg-transparent group-hover:bg-stone-800"
                            )}>
                                <Icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]")} />
                            </div>

                            <span className={cn(
                                "relative z-10 font-medium tracking-wide text-sm transition-all duration-300",
                                isActive ? "translate-x-1" : "group-hover:translate-x-1"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/5 space-y-3 relative z-10 bg-gradient-to-t from-black/40 to-transparent">
                <div className="flex justify-between items-center bg-stone-900/80 p-3 rounded-xl border border-white/5 backdrop-blur-md">
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 pl-2">Modo</span>
                    <ModeToggle />
                </div>

                <Link href="/">
                    <Button variant="ghost" className="w-full justify-start text-stone-500 hover:text-stone-200 hover:bg-white/5 h-12 rounded-xl group">
                        <Home className="w-4 h-4 mr-3 group-hover:text-amber-500 transition-colors" />
                        <span className="text-sm font-medium">Sitio Público</span>
                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </Button>
                </Link>
                <div className="pt-2">
                    <LogoutButton />
                </div>
            </div>
        </div>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans overflow-hidden transition-colors duration-500">
            <AutoSyncHandler />
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 flex-col h-full flex-shrink-0 z-30 shadow-2xl shadow-black/40 border-r border-white/5 bg-stone-950">
                <SidebarContent pathname={pathname} />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full h-16 bg-stone-950/80 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-6 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-stone-800 to-stone-900 border border-white/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="font-light font-heading uppercase tracking-widest text-white text-sm">Mandalas Admin</span>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-stone-400 hover:text-white hover:bg-white/10"><Menu /></Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[300px] border-r-0 bg-stone-950 shadow-2xl">
                        <SheetTitle className="sr-only">Navegación Admin</SheetTitle>
                        <SidebarContent pathname={pathname} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-stone-50 dark:bg-stone-950 transition-colors duration-500">
                {/* Subtle Grain/Noise if needed, or clean stone background */}
                <div className="container mx-auto p-6 md:p-12 pt-24 md:pt-12 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    )
}
