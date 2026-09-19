"use client"

import { useRef } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"

export const MagneticButton = ({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const reduceMotion = useReducedMotion()
    const targetX = useMotionValue(0)
    const targetY = useMotionValue(0)
    const x = useSpring(targetX, { stiffness: 150, damping: 15, mass: 0.1 })
    const y = useSpring(targetY, { stiffness: 150, damping: 15, mass: 0.1 })

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        if (reduceMotion) return

        const { clientX, clientY } = e
        const { height, width, left, top } = ref.current?.getBoundingClientRect() || {
            height: 0,
            width: 0,
            left: 0,
            top: 0,
        }
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)
        targetX.set(middleX * 0.15)
        targetY.set(middleY * 0.15)
    }

    const reset = () => {
        targetX.set(0)
        targetY.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x, y }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
