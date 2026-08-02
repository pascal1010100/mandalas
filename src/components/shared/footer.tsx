import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { ConsultationLink } from "@/components/shared/consultation-link"
import { SocialLinks } from "@/components/shared/social-links"
import { buildContactHref, getDisplayPhone, publicContact } from "@/lib/public-contact"

const displayPhone = getDisplayPhone()

export function Footer() {
    return (
        <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-900">
            <div className="container mx-auto px-4">
                <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-8 xl:grid-cols-4 xl:gap-x-12">
                    <div className="min-w-0 space-y-6">
                        <h3 className="text-2xl font-black text-white tracking-tighter font-heading">
                            MANDALAS<span className="text-amber-400">.</span>
                        </h3>
                        <p className="text-sm leading-relaxed max-w-xs text-stone-500 font-light">
                            Two easy ways to stay in San Pedro: close to the movement or quieter near the lake.
                        </p>
                        <SocialLinks
                            className="gap-2"
                            itemClassName="min-h-11 border-stone-800 px-3 py-2 text-[10px] text-stone-500 hover:border-white/20 hover:text-white"
                        />
                    </div>

                    <div className="min-w-0">
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Explore</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li>
                                <Link href="/pueblo" className="group flex min-h-11 items-center gap-2 transition-colors hover:text-amber-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Mandalas
                                </Link>
                            </li>
                            <li>
                                <Link href="/hideout" className="group flex min-h-11 items-center gap-2 transition-colors hover:text-lime-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-lime-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Hideout
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="min-w-0">
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Contact</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li className="flex min-w-0 items-center gap-3">
                                <Phone className="h-4 w-4 shrink-0 text-stone-600" />
                                <a href={buildContactHref("Hi Mandalas, I would like to check availability")} className="flex min-h-11 min-w-0 items-center transition-colors hover:text-amber-300">
                                    {displayPhone}
                                </a>
                            </li>
                            <li className="flex min-w-0 items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0 text-stone-600" />
                                <a href={`mailto:${publicContact.email}`} className="flex min-h-11 min-w-0 items-center [overflow-wrap:anywhere] transition-colors hover:text-lime-300">
                                    {publicContact.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 h-4 w-4 shrink-0 text-stone-600" />
                                <span className="min-w-0">San Pedro La Laguna, Solola</span>
                            </li>
                        </ul>
                    </div>

                    <div className="min-w-0">
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Book direct</h4>
                        <p className="text-sm leading-relaxed text-stone-500 font-light mb-5">
                            Choose Mandalas or Hideout, then check live availability and final prices in Cloudbeds.
                        </p>
                        <ConsultationLink className="min-h-11 w-full min-w-0 border-white/20 bg-white px-4 text-stone-950 hover:bg-stone-200 xl:w-auto">
                            Choose your stay
                        </ConsultationLink>
                    </div>
                </div>

                <div className="border-t border-stone-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-600">
                    <p>&copy; {new Date().getFullYear()} Mandalas Hostal. San Pedro La Laguna, Lake Atitlan.</p>
                </div>
            </div>
        </footer>
    )
}
