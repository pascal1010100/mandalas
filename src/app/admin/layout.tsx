"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CalendarDays, Users, Home, Menu, Sparkles, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { LogoutButton } from "@/components/admin/logout-button"
import { NotificationsListener } from "@/components/admin/notifications-listener"
import { AutoSyncHandler } from "@/components/admin/auto-sync-handler"

// Sidebar component extracted to avoid React lint error
function SidebarContent({ pathname }: { pathname: string }) {
    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/reservations", label: "Reservas", icon: Users },
        { href: "/admin/events", label: "Eventos", icon: CalendarDays },
        { href: "/admin/settings", label: "Configuración", icon: Settings },
    ]

    return (
        <div className="flex flex-col h-full bg-stone-950 text-stone-300">
            {/* Logo Area */}
            <div className="h-24 flex items-center px-8 border-b border-white/5">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-20" />
                        <Sparkles className="w-4 h-4 text-amber-500 relative z-10" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-light font-heading tracking-[0.2em] text-white uppercase">
                            Mandalas
                        </span>
                        <span className="text-[0.6rem] uppercase tracking-widest text-stone-500">Admin Portal</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                <div className="text-xs font-medium text-stone-600 uppercase tracking-widest mb-6 px-4">Menu Principal</div>
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-500 group relative overflow-hidden",
                                isActive
                                    ? "bg-white/10 text-white shadow-lg shadow-amber-900/20"
                                    : "text-stone-500 hover:bg-white/[0.05] hover:text-stone-300"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                            )}
                            <Icon className={cn("w-5 h-5 transition-colors duration-300", isActive ? "text-amber-400 drop-shadow-md" : "text-stone-600 group-hover:text-stone-400")} />
                            <span className={cn("font-medium tracking-wide text-sm", isActive ? "font-semibold" : "")}>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center bg-stone-900/50 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 pl-1">Tema</span>
                    <ModeToggle />
                </div>

                <Link href="/">
                    <Button variant="ghost" className="w-full justify-start text-stone-500 hover:text-stone-200 hover:bg-white/5 h-12 rounded-xl group mb-2">
                        <Home className="w-4 h-4 mr-3 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium">Ir al Sitio Público</span>
                    </Button>
                </Link>
                <LogoutButton />
            </div>
        </div>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans overflow-hidden transition-colors duration-500">
            <NotificationsListener />
            <AutoSyncHandler />
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-80 flex-col h-full flex-shrink-0 z-30 shadow-2xl shadow-stone-900/20">
                <SidebarContent pathname={pathname} />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full h-16 bg-stone-950/90 backdrop-blur-md border-b border-white/5 z-40 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <span className="font-light font-heading uppercase tracking-widest text-white text-lg">Mandalas</span>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-stone-400 hover:text-white hover:bg-white/10"><Menu /></Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[300px] border-r-0 bg-stone-950">
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
