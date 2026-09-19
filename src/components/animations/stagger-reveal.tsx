"use client"

import { Children } from "react"
import { motion, useReducedMotion } from "framer-motion"

interface StaggerRevealProps {
    children: React.ReactNode
    className?: string
    delay?: number
}

export const StaggerReveal = ({ children, className, delay = 0 }: StaggerRevealProps) => {
    const reduceMotion = useReducedMotion()
    const itemCount = Children.count(children)
    const stagger = itemCount > 1 ? Math.min(0.08, 0.4 / (itemCount - 1)) : 0

    return (
        <motion.div
            className={className}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        delayChildren: reduceMotion ? 0 : delay,
                        staggerChildren: reduceMotion ? 0 : stagger,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    )
}

export const StaggerItem = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const reduceMotion = useReducedMotion()

    return (
        <motion.div
            className={className}
            variants={{
                hidden: reduceMotion ? {} : { opacity: 0, y: 10 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: reduceMotion ? 0 : 0.48,
                        ease: [0.16, 1, 0.3, 1],
                    },
                },
            }}
        >
            {children}
        </motion.div>
    )
}
