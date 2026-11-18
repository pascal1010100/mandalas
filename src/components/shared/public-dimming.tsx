"use client"

import { usePathname } from "next/navigation"

const dimmedPaths = new Set([
  "/", "/pueblo", "/hideout", "/contact", "/guide",
  "/es", "/es/pueblo", "/es/hideout", "/es/contacto", "/es/guia",
])

export function PublicDimming() {
  const pathname = usePathname()

  if (!dimmedPaths.has(pathname)) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2147483647] bg-black/90"
    />
  )
}
