"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Users, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [hovered, setHovered] = useState<"pueblo" | "hideout" | null>(null)

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Pueblo Section */}
      <motion.div
        className="relative flex-1 group overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovered("pueblo")}
        onMouseLeave={() => setHovered(null)}
        animate={{
          flex: hovered === "pueblo" ? 1.5 : hovered === "hideout" ? 0.5 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            // Radiant Golden Hour - Social, Warm, Energetic
            backgroundImage: "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)",
          }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Users className="w-16 h-16 mb-4 mx-auto text-amber-100/90 drop-shadow-md" />
            <h2 className="text-4xl md:text-7xl font-bold mb-4 tracking-tighter drop-shadow-xl font-heading uppercase">Mandalas</h2>
            <p className="text-lg md:text-xl font-light mb-8 max-w-md mx-auto drop-shadow-md text-amber-50/90">
              Vibra social, atardeceres dorados y conexiones reales.
            </p>
            <Link href="/pueblo">
              <Button size="lg" className="rounded-full bg-white/10 backdrop-blur-md border border-white/40 hover:bg-white/20 text-white font-medium transition-all duration-300 text-lg px-10 py-7 shadow-xl hover:shadow-2xl hover:scale-105">
                Explorar Pueblo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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
          flex: hovered === "hideout" ? 1.5 : hovered === "pueblo" ? 0.5 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            // Zen Sanctuary - Forest Bathing, Healing, Organic
            backgroundImage: "linear-gradient(135deg, #84cc16 0%, #65a30d 40%, #3f6212 100%)",
          }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Leaf className="w-16 h-16 mb-4 mx-auto text-lime-100/90 drop-shadow-md" />
            <h2 className="text-4xl md:text-7xl font-bold mb-4 tracking-tighter drop-shadow-xl font-heading uppercase">Hideout</h2>
            <p className="text-lg md:text-xl font-light mb-8 max-w-md mx-auto drop-shadow-md text-lime-50/90">
              Santuario natural, silencio sanador y paz absoluta.
            </p>
            <Link href="/hideout">
              <Button size="lg" className="rounded-full bg-white/10 backdrop-blur-md border border-white/40 hover:bg-white/20 text-white font-medium transition-all duration-300 text-lg px-10 py-7 shadow-xl hover:shadow-2xl hover:scale-105">
                Descubrir Hideout <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
