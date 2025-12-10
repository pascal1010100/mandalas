"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Users, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MagneticButton } from "@/components/animations/magnetic-button"

export default function LandingPage() {
  const [hovered, setHovered] = useState<"pueblo" | "hideout" | null>(null)

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden relative bg-black">
      {/* Cinematic Noise Texture */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIxIi8+PC9zdmc+")`
        }}
      />

      {/* Pueblo Section */}
      <motion.div
        className="relative flex-1 group overflow-hidden cursor-pointer border-b md:border-b-0 md:border-r border-white/10"
        onMouseEnter={() => setHovered("pueblo")}
        onMouseLeave={() => setHovered(null)}
        animate={{
          flex: hovered === "pueblo" ? 1.5 : hovered === "hideout" ? 0.6 : 1,
        }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-105"
          style={{
            // Living Light - Warm, Radiant Core
            background: "var(--pueblo-gradient)",
          }}
        />
        {/* Depth Overlay - Darker for more contrast with refined text */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-1000" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
              <Users className="relative w-12 h-12 mx-auto text-amber-50/80 stroke-[1.5px] drop-shadow-md" />
            </div>

            <h2 className="text-3xl md:text-5xl font-light mb-8 tracking-[0.3em] font-heading uppercase text-amber-50/90 drop-shadow-lg">
              Mandalas
            </h2>

            <div className="w-px h-12 bg-gradient-to-b from-transparent via-amber-200/50 to-transparent mb-8" />

            <p className="text-sm md:text-base font-light mb-16 max-w-sm mx-auto text-amber-50/70 tracking-wide leading-loose">
              VIBRA SOCIAL · ATARDECERES · CONEXIONES
            </p>

            <Link href="/pueblo">
              <MagneticButton>
                <Button size="lg" className="rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/90 font-light tracking-widest transition-all duration-700 text-xs md:text-sm px-10 py-6 hover:bg-white/10 hover:border-amber-200/30 hover:text-white hover:tracking-[0.2em]">
                  EXPLORAR
                </Button>
              </MagneticButton>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Hideout Section */}
      <motion.div
        className="relative flex-1 group overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovered("hideout")}
        onMouseLeave={() => setHovered(null)}
        animate={{
          flex: hovered === "hideout" ? 1.5 : hovered === "pueblo" ? 0.6 : 1,
        }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-105"
          style={{
            // Living Light - Organic, Forest Canopy
            background: "var(--hideout-gradient)",
          }}
        />
        {/* Depth Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-1000" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-lime-500/20 blur-3xl rounded-full" />
              <Leaf className="relative w-12 h-12 mx-auto text-lime-50/80 stroke-[1.5px] drop-shadow-md" />
            </div>

            <h2 className="text-3xl md:text-5xl font-light mb-8 tracking-[0.3em] font-heading uppercase text-lime-50/90 drop-shadow-lg">
              Hideout
            </h2>

            <div className="w-px h-12 bg-gradient-to-b from-transparent via-lime-200/50 to-transparent mb-8" />

            <p className="text-sm md:text-base font-light mb-16 max-w-sm mx-auto text-lime-50/70 tracking-wide leading-loose">
              SANTUARIO · SILENCIO · NATURALEZA
            </p>

            <Link href="/hideout">
              <MagneticButton>
                <Button size="lg" className="rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/90 font-light tracking-widest transition-all duration-700 text-xs md:text-sm px-10 py-6 hover:bg-white/10 hover:border-lime-200/30 hover:text-white hover:tracking-[0.2em]">
                  DESCUBRIR
                </Button>
              </MagneticButton>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
