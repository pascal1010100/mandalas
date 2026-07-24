interface StaggerRevealProps {
    children: React.ReactNode
    className?: string
    delay?: number
}

export const StaggerReveal = ({ children, className, delay = 0 }: StaggerRevealProps) => {
    return (
        <div
            className={className}
            style={delay ? { animationDelay: `${delay}s` } : undefined}
        >
            {children}
        </div>
    )
}

export const StaggerItem = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <div className={className}>{children}</div>
}
