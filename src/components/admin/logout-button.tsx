"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
    const router = useRouter()

    const handleLogout = () => {
        // Clear the session cookie
        document.cookie = "mandalas_admin_session=; path=/; max-age=0"
        router.push("/admin/login")
    }

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-stone-500 hover:text-red-400 hover:bg-red-950/20 h-10 rounded-xl group transition-all"
        >
            <LogOut className="w-4 h-4 mr-3 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
        </Button>
    )
}
