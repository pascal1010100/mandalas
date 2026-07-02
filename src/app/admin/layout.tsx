"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Bot, Cloud, LayoutDashboard, Menu, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
    { href: "/admin", label: "Resumen", icon: LayoutDashboard },
    { href: "/admin/cloudbeds", label: "Cloudbeds", icon: Cloud },
    { href: "/admin/automations", label: "Automatizaciones", icon: Zap },
]

function Sidebar({ pathname }: { pathname: string }) {
    return (
        <div className="flex h-full flex-col bg-[#171815] text-white">
            <div className="border-b border-white/10 px-7 py-7">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                        <Sparkles className="h-4 w-4 text-amber-300" />
                    </div>
                    <div>
                        <p className="font-heading text-sm font-medium uppercase tracking-[0.2em]">Mandalas</p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/35">Automation Studio</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-6">
                <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">Workspace</p>
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon
                        const active = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition",
                                    active
                                        ? "bg-white text-stone-950"
                                        : "text-white/50 hover:bg-white/5 hover:text-white",
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            <div className="space-y-4 border-t border-white/10 p-5">
                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">Conexiones</span>
                        <Bot className="h-3.5 w-3.5 text-white/25" />
                    </div>
                    <div className="mt-4 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-white/65">Hideout</span>
                            <span className="flex items-center gap-1.5 text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Activo</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-white/35">Mandalas</span>
                            <span className="text-white/25">Pendiente</span>
                        </div>
                    </div>
                </div>
                <Link href="/" className="flex items-center justify-between px-2 text-xs text-white/35 transition hover:text-white">
                    Sitio público <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        </div>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    if (pathname === "/admin/login") return children

    return (
        <div className="flex h-screen overflow-hidden bg-[#f3f1eb] text-stone-900 dark:bg-stone-950 dark:text-stone-100">
            <aside className="hidden w-64 flex-shrink-0 border-r border-black/10 md:block">
                <Sidebar pathname={pathname} />
            </aside>

            <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#171815] px-5 text-white md:hidden">
                <Link href="/admin" className="font-heading text-xs uppercase tracking-[0.2em]">Mandalas</Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white"><Menu className="h-5 w-5" /></Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] border-0 bg-[#171815] p-0">
                        <SheetTitle className="sr-only">Navegación</SheetTitle>
                        <Sidebar pathname={pathname} />
                    </SheetContent>
                </Sheet>
            </div>

            <main className="h-full flex-1 overflow-y-auto">
                <div className="mx-auto max-w-7xl px-5 pb-12 pt-24 md:px-10 md:pt-10 xl:px-12">
                    {children}
                </div>
            </main>
        </div>
    )
}
