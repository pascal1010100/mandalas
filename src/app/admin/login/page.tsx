"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, ArrowRight, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

// Tiempo de bloqueo después de 3 intentos fallidos (5 minutos)
const LOCKOUT_DURATION = 5 * 60 * 1000
const MAX_ATTEMPTS = 3

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [attempts, setAttempts] = useState(0)
    const [isLocked, setIsLocked] = useState(false)
    const [lockUntil, setLockUntil] = useState<Date | null>(null)

    // Verificar bloqueo al cargar el componente
    useEffect(() => {
        const storedLock = localStorage.getItem('loginLockUntil')
        if (storedLock) {
            const lockTime = new Date(storedLock)
            if (new Date() < lockTime) {
                setIsLocked(true)
                setLockUntil(lockTime)
            } else {
                localStorage.removeItem('loginLockUntil')
                setAttempts(0)
            }
        }
    }, [])

    // Contador regresivo cuando está bloqueado
    useEffect(() => {
        if (!isLocked || !lockUntil) return

        const timer = setInterval(() => {
            const now = new Date()
            if (now >= lockUntil) {
                setIsLocked(false)
                setLockUntil(null)
                clearInterval(timer)
                localStorage.removeItem('loginLockUntil')
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [isLocked, lockUntil])

    // Formatear tiempo restante
    const formatTimeLeft = () => {
        if (!lockUntil) return ""
        const now = new Date()
        const diff = lockUntil.getTime() - now.getTime()
        if (diff <= 0) return ""
        
        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validación básica
        if (!email || !password) {
            toast.error("Error", {
                description: "Por favor completa todos los campos."
            })
            return
        }

        if (!validateEmail(email)) {
            toast.error("Error", {
                description: "Por favor ingresa un correo electrónico válido."
            })
            return
        }

        if (isLocked) {
            toast.error("Cuenta temporalmente bloqueada", {
                description: `Demasiados intentos fallidos. Intenta de nuevo en ${formatTimeLeft()}.`
            })
            return
        }

        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                const newAttempts = attempts + 1
                setAttempts(newAttempts)

                // Bloquear después de MAX_ATTEMPTS intentos fallidos
                if (newAttempts >= MAX_ATTEMPTS) {
                    const lockTime = new Date(Date.now() + LOCKOUT_DURATION)
                    setLockUntil(lockTime)
                    setIsLocked(true)
                    localStorage.setItem('loginLockUntil', lockTime.toISOString())
                    
                    toast.error("Cuenta bloqueada temporalmente", {
                        description: `Demasiados intentos fallidos. Intenta de nuevo en 5 minutos.`
                    })
                } else {
                    const remainingAttempts = MAX_ATTEMPTS - newAttempts
                    toast.error("Acceso Denegado", {
                        description: `Credenciales incorrectas. ${remainingAttempts} ${remainingAttempts === 1 ? 'intento' : 'intentos'} restante${remainingAttempts !== 1 ? 's' : ''}.`
                    })
                }
                return
            }

            // Restablecer contador de intentos al inicio de sesión exitoso
            setAttempts(0)
            localStorage.removeItem('loginLockUntil')

            if (data.session) {
                document.cookie = "mandalas_admin_session=true; path=/; max-age=86400; SameSite=Lax; Secure"
                toast.success("Bienvenido", {
                    description: "Acceso autorizado al sistema central."
                })
                router.push("/admin")
            }
        } catch (error) {
            console.error("Error inesperado:", error)
            toast.error("Error", {
                description: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde."
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-stone-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Decoración */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-3xl" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-3xl" />

                    {/* Logo y Título */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Acceso al Sistema</h1>
                        <p className="text-stone-400 text-sm mt-1">
                            Ingresa tus credenciales para continuar
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-xs uppercase tracking-widest text-stone-400 font-semibold pl-1 mb-1 block">
                                    Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="bg-stone-800/50 border-stone-700 focus:border-emerald-500 focus:ring-emerald-500/50 text-white"
                                    disabled={isLoading || isLocked}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <Label htmlFor="password" className="text-xs uppercase tracking-widest text-stone-400 font-semibold pl-1">
                                        Contraseña
                                    </Label>
                                    <a
                                        href="/forgot-password"
                                        className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-stone-800/50 border-stone-700 focus:border-emerald-500 focus:ring-emerald-500/50 text-white"
                                    disabled={isLoading || isLocked}
                                />
                            </div>
                        </div>

                        {isLocked && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Cuenta temporalmente bloqueada</p>
                                    <p className="text-xs opacity-80 mt-1">
                                        Demasiados intentos fallidos. Intenta de nuevo en {formatTimeLeft()}.
                                    </p>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                            disabled={isLoading || isLocked}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/5">
                        <p className="text-xs text-center text-stone-500">
                            ¿Necesitas ayuda?{' '}
                            <a href="mailto:soporte@tudominio.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                                Contáctanos
                            </a>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}