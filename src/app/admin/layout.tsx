"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CalendarDays, Users, Home, Menu, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Sidebar component extracted to avoid React lint error
function SidebarContent({ pathname }: { pathname: string }) {
    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/reservations", label: "Reservas", icon: Users },
        { href: "/admin/events", label: "Eventos", icon: CalendarDays },
    ]

    return (
        <div className="flex flex-col h-full bg-stone-950 text-stone-300">
            {/* Logo Area */}
            <div className="h-24 flex items-center px-8 border-b border-white/5">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500">
                        <Sparkles className="w-4 h-4 text-amber-500/80" />
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
                                    ? "bg-white/5 text-white shadow-xl shadow-black/20"
                                    : "text-stone-500 hover:bg-white/[0.02] hover:text-stone-300"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-600" />
                            )}
                            <Icon className={cn("w-5 h-5 transition-colors duration-300", isActive ? "text-amber-500" : "text-stone-600 group-hover:text-stone-400")} />
                            <span className={cn("font-medium tracking-wide text-sm", isActive ? "font-semibold" : "")}>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-6 border-t border-white/5 space-y-6">
                <div className="bg-stone-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-3">Estado del Sistema</p>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs text-stone-300 font-medium">Operativo</span>
                    </div>
                </div>

                <Link href="/">
                    <Button variant="ghost" className="w-full justify-start text-stone-500 hover:text-stone-200 hover:bg-white/5 h-12 rounded-xl group">
                        <Home className="w-4 h-4 mr-3 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium">Ir al Sitio Público</span>
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-full bg-[#F5F5F4] text-stone-900 font-sans overflow-hidden">
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
                        <SidebarContent pathname={pathname} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-[#F5F5F4]">
                {/* Subtle Grain/Noise if needed, or clean stone background */}
                <div className="container mx-auto p-6 md:p-12 pt-24 md:pt-12 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    )
}
