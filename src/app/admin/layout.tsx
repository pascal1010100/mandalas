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
        <div className="flex flex-col h-full">
            <div className="h-20 flex items-center px-6 border-b border-white/10">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold font-heading tracking-tight text-white">
                        Mandalas<span className="text-purple-500">.</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4 px-2">Menu Principal</div>
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-white/10 text-white shadow-sm"
                                    : "text-stone-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-purple-500 rounded-full" />
                            )}
                            <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-purple-400" : "text-stone-500 group-hover:text-stone-300")} />
                            <span className="font-medium tracking-wide">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 border-t border-white/10 space-y-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs font-medium text-stone-300 mb-2">Estado del Sistema</p>
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs text-stone-400">En línea</span>
                    </div>
                </div>

                <Link href="/">
                    <Button variant="ghost" className="w-full justify-start text-stone-400 hover:text-white hover:bg-white/5 h-12 rounded-xl">
                        <Home className="w-4 h-4 mr-3" />
                        Volver al Sitio
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-full bg-[#FAFAFA] text-stone-900 font-sans overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 flex-col h-full flex-shrink-0 z-30 bg-stone-900 border-r border-stone-800 text-stone-300">
                <SidebarContent pathname={pathname} />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full h-16 bg-white/80 backdrop-blur-md border-b z-40 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-pink-600" />
                    <span className="font-bold font-heading">Admin</span>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-stone-600"><Menu /></Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[280px] bg-stone-900">
                        <SidebarContent pathname={pathname} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10 pointer-events-none" />
                <div className="container mx-auto p-6 md:p-10 pt-24 md:pt-10 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    )
}
