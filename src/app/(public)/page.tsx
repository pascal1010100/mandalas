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
            // Warm elegant gradient - sunset vibes
            backgroundImage: "linear-gradient(135deg, #e8b87e 0%, #d4a574 50%, #c08f5f 100%)",
            // backgroundImage: "url('/images/pueblo_vibes.webp')" 
          }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Users className="w-16 h-16 mb-4 mx-auto text-amber-50/90" />
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter drop-shadow-lg">Mandalas</h2>
            <p className="text-lg md:text-xl font-light mb-8 max-w-md mx-auto drop-shadow-md">
              Vibra social, atardeceres en el lago y noches inolvidables en el corazón de San Pedro.
            </p>
            <Link href="/pueblo">
              <Button size="lg" className="rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white font-medium transition-all duration-300 text-lg px-8 py-6 shadow-lg hover:shadow-2xl">
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
            // Light natural gradient - misty forest morning
            backgroundImage: "linear-gradient(135deg, #c8d8d3 0%, #a7c4bc 50%, #8ab4a8 100%)",
            // backgroundImage: "url('/images/hideout_nature.webp')" 
          }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Leaf className="w-16 h-16 mb-4 mx-auto text-emerald-50/90" />
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter drop-shadow-lg">Mandalas Hideout</h2>
            <p className="text-lg md:text-xl font-light mb-8 max-w-md mx-auto drop-shadow-md">
              Retiro natural, paz absoluta y conexión con la tierra en nuestro santuario escondido.
            </p>
            <Link href="/hideout">
              <Button size="lg" className="rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white font-medium transition-all duration-300 text-lg px-8 py-6 shadow-lg hover:shadow-2xl">
                Descubrir Hideout <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
