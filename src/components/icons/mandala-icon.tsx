export function MandalaIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer circle */}
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" fill="none" />

            {/* Middle circle */}
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1.5" fill="none" />

            {/* Inner circle */}
            <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="1.5" fill="none" />

            {/* Center dot */}
            <circle cx="50" cy="50" r="4" fill="currentColor" />

            {/* Petals - 8 directions */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                const x1 = 50 + Math.cos(rad) * 22
                const y1 = 50 + Math.sin(rad) * 22
                const x2 = 50 + Math.cos(rad) * 35
                const y2 = 50 + Math.sin(rad) * 35

                return (
                    <g key={i}>
                        {/* Radial lines */}
                        <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="currentColor"
                            strokeWidth="1"
                        />

                        {/* Petal shapes */}
                        <ellipse
                            cx={50 + Math.cos(rad) * 41}
                            cy={50 + Math.sin(rad) * 41}
                            rx="6"
                            ry="3"
                            transform={`rotate(${angle} ${50 + Math.cos(rad) * 41} ${50 + Math.sin(rad) * 41})`}
                            fill="currentColor"
                            opacity="0.6"
                        />
                    </g>
                )
            })}
        </svg>
    )
}
