export function FadeIn({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) {
    return (
        <div
            className={className}
            style={delay ? { animationDelay: `${delay}s` } : undefined}
        >
            {children}
        </div>
    )
}
