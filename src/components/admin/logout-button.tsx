"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export function LogoutButton() {
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            // Cerrar sesión en Supabase
            const { error } = await supabase.auth.signOut()
            
            if (error) throw error
            
            // Limpiar la cookie de sesión personalizada
            document.cookie = "mandalas_admin_session=; path=/; max-age=0; SameSite=Lax"
            
            // Mostrar mensaje de éxito
            toast.success("Sesión cerrada", {
                description: "Has cerrado sesión correctamente."
            })
            
            // Redirigir al login
            router.push("/admin/login")
            router.refresh() // Forzar recarga para limpiar el estado
        } catch (error) {
            console.error("Error al cerrar sesión:", error)
            toast.error("Error", {
                description: "Ocurrió un error al intentar cerrar sesión. Por favor, inténtalo de nuevo."
            })
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start text-stone-500 hover:text-red-400 hover:bg-red-950/20 h-10 rounded-xl group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoggingOut ? (
                <>
                    <LogOut className="w-4 h-4 mr-3 animate-pulse" />
                    <span className="text-sm font-medium">Cerrando sesión...</span>
                </>
            ) : (
                <>
                    <LogOut className="w-4 h-4 mr-3 group-hover:text-red-400 transition-colors" />
                    <span className="text-sm font-medium">Cerrar Sesión</span>
                </>
            )}
        </Button>
    )
}
