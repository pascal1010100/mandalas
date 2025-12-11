import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"

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
                            Fusionando la energía social del pueblo con la paz de la naturaleza. San Pedro La Laguna, Atitlán.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Explorar</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li>
                                <Link href="/pueblo" className="hover:text-amber-500 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Pueblo
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
                                <span>+502 1234 5678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-stone-600" />
                                <span>info@mandalashostal.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 mt-1 text-stone-600" />
                                <span>San Pedro La Laguna, Sololá</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Social</h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-stone-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-600">
                    <p>&copy; {new Date().getFullYear()} Mandalas Hostal. Crafted with radiant energy.</p>
                    <Link href="/admin" className="hover:text-stone-400 transition-colors opacity-50 hover:opacity-100">
                        Staff Access
                    </Link>
                </div>
            </div>
        </footer>
    )
}
