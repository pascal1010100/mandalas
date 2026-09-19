"use client"

import { motion, useReducedMotion } from "framer-motion"

const easeOutExpo = [0.16, 1, 0.3, 1] as const

export function FadeIn({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) {
    const reduceMotion = useReducedMotion()

    return (
        <motion.div
            className={className}
            initial={reduceMotion ? false : { opacity: 0, y: 12, clipPath: "inset(0 0 8% 0)" }}
            whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay, ease: easeOutExpo }}
        >
            {children}
        </motion.div>
    )
}
