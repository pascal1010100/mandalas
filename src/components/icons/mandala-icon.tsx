export function MandalaIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer lotus petals - 8 petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rotation = angle
                return (
                    <g key={`outer-${i}`} transform={`rotate(${rotation} 50 50)`}>
                        <path
                            d="M 50 20 Q 45 35, 50 50 Q 55 35, 50 20 Z"
                            fill="currentColor"
                            opacity="0.3"
                        />
                    </g>
                )
            })}

            {/* Middle lotus petals - 8 petals offset */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => {
                const rotation = angle
                return (
                    <g key={`middle-${i}`} transform={`rotate(${rotation} 50 50)`}>
                        <path
                            d="M 50 28 Q 46 38, 50 50 Q 54 38, 50 28 Z"
                            fill="currentColor"
                            opacity="0.5"
                        />
                    </g>
                )
            })}

            {/* Inner circle with decorative dots */}
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />

            {/* Decorative dots around inner circle */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                const x = Number((50 + Math.cos(rad) * 18).toFixed(2))
                const y = Number((50 + Math.sin(rad) * 18).toFixed(2))
                return (
                    <circle
                        key={`dot-${i}`}
                        cx={x}
                        cy={y}
                        r="1.5"
                        fill="currentColor"
                        opacity="0.7"
                    />
                )
            })}

            {/* Center sacred geometry */}
            <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
    )
}
