import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { BookingLink } from "@/components/shared/booking-link"
import { buildContactHref, getDisplayPhone, publicContact } from "@/lib/public-contact"

const displayPhone = getDisplayPhone()

export function Footer() {
    return (
        <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white tracking-tighter font-heading">
                            MANDALAS<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">.</span>
                        </h3>
                        <p className="text-sm leading-relaxed max-w-xs text-stone-500 font-light">
                            Dos formas sencillas de quedarse en San Pedro: cerca del movimiento o con más calma junto al lago.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Explorar</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li>
                                <Link href="/pueblo" className="hover:text-amber-500 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Mandalas
                                </Link>
                            </li>
                            <li>
                                <Link href="/hideout" className="hover:text-lime-500 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-lime-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Hideout
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Contacto</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-stone-600" />
                                <a href={buildContactHref("Hola Mandalas, quiero consultar disponibilidad")} className="hover:text-amber-300 transition-colors">
                                    {displayPhone}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-stone-600" />
                                <a href={`mailto:${publicContact.email}`} className="hover:text-lime-300 transition-colors">
                                    {publicContact.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 mt-1 text-stone-600" />
                                <span>San Pedro La Laguna, Sololá</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Reserva Directa</h4>
                        <p className="text-sm leading-relaxed text-stone-500 font-light mb-5">
                            Cuéntanos tus fechas y te orientamos por WhatsApp.
                        </p>
                        <BookingLink
                            location="Mandalas Hostal"
                            className="rounded-full bg-white text-stone-950 hover:bg-stone-200 font-semibold"
                        >
                            Consultar
                        </BookingLink>
                    </div>
                </div>

                <div className="border-t border-stone-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-600">
                    <p>&copy; {new Date().getFullYear()} Mandalas Hostal. San Pedro La Laguna, Lago Atitlan.</p>
                </div>
            </div>
        </footer>
    )
}
