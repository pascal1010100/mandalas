import { Instagram } from "lucide-react"

import { publicContact } from "@/lib/public-contact"
import { cn } from "@/lib/utils"

type SocialLinksProps = {
    className?: string
    itemClassName?: string
}

const links = [
    {
        label: "Mandalas",
        href: publicContact.instagram.mandalas,
    },
    {
        label: "Hideout",
        href: publicContact.instagram.hideout,
    },
]

export function SocialLinks({ className, itemClassName }: SocialLinksProps) {
    return (
        <div className={cn("flex flex-wrap gap-3", className)}>
            {links.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                        "inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-300 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white",
                        itemClassName
                    )}
                >
                    <Instagram className="h-4 w-4" />
                    {link.label}
                </a>
            ))}
        </div>
    )
}
