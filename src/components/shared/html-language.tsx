"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function HtmlLanguage() {
    const pathname = usePathname()

    useEffect(() => {
        document.documentElement.lang = pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en"
    }, [pathname])

    return null
}
