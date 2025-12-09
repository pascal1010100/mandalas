"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { resolvedTheme, setTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="group relative rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-500 hover:scale-110 active:scale-90"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-180 dark:scale-0 text-amber-600 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] dark:drop-shadow-none" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-180 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-stone-100 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            <span className="sr-only">Cambiar tema</span>
        </Button>
    )
}
