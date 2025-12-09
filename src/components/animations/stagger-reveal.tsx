"use client"

import { motion, Variants } from "framer-motion"

interface StaggerRevealProps {
    children: React.ReactNode
    className?: string
    delay?: number
}

const containerVars = {
    hidden: { opacity: 0 },
    show: (delay: number) => ({
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
        },
    }),
}

const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export const StaggerReveal = ({ children, className, delay = 0 }: StaggerRevealProps) => {
    return (
        <motion.div
            variants={containerVars}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            custom={delay}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export const StaggerItem = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <motion.div variants={itemVars} className={className}>
            {children}
        </motion.div>
    )
}
