"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { supabase } from "@/lib/supabase"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                console.error("Login error:", error)
                toast.error("Acceso Denegado", {
                    description: error.message === "Invalid login credentials"
                        ? "Credenciales inválidas."
                        : "Error al conectar con el servidor."
                })
                setIsLoading(false)
                return
            }

            if (data.session) {
                // Bridge for our existing Middleware
                // In a future refactor, we will use Supabase Auth Helpers for proper server-side session
                document.cookie = "mandalas_admin_session=true; path=/; max-age=86400" // 1 day

                toast.success("Bienvenido", {
                    description: "Acceso autorizado al sistema central."
                })
                router.push("/admin")
            }
        } catch (err) {
            console.error("Unexpected error:", err)
            toast.error("Error del Sistema", {
                description: "Ocurrió un error inesperado."
            })
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-stone-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-amber-900/10 blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
                <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-lime-900/10 blur-[100px] animate-pulse" style={{ animationDuration: "12s" }} />

                {/* Noise overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo / Brand Header */}
                <div className="text-center mb-10 space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-900/50 border border-stone-800 backdrop-blur-md mb-4 shadow-xl shadow-amber-900/5 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-lime-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <Sparkles className="w-6 h-6 text-stone-200" />
                    </div>
                    <h1 className="text-3xl font-light font-heading uppercase tracking-[0.2em] text-white">
                        Mandalas
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">
                        Sistema de Gestión Central
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-stone-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Top gradient line */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold pl-1">ID de Operador</Label>
                            <div className="relative group">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@mandalas.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-stone-950/50 border-stone-800 text-stone-200 placeholder:text-stone-700 h-12 pl-4 focus:ring-1 focus:ring-stone-700 focus:border-stone-700 transition-all rounded-xl"
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold pl-1">Clave de Acceso</Label>
                            <div className="relative group">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-stone-950/50 border-stone-800 text-stone-200 placeholder:text-stone-700 h-12 pl-4 focus:ring-1 focus:ring-stone-700 focus:border-stone-700 transition-all rounded-xl"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-white text-black hover:bg-stone-200 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.2)]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    INGRESAR <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-stone-600 font-mono">
                            SECURE ACCESS NODE v1.0.0
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
