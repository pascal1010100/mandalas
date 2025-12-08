import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white tracking-tighter">MANDALAS</h3>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Mandalas Hostal ofrece una experiencia única en San Pedro La Laguna, fusionando la energía social del pueblo con la paz de la naturaleza.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Ubicaciones</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/pueblo" className="hover:text-white transition-colors">
                                    Mandalas
                                </Link>
                            </li>
                            <li>
                                <Link href="/hideout" className="hover:text-white transition-colors">
                                    Mandalas Hideout
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>+502 1234 5678</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>info@mandalashostal.com</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-1" />
                                <span>San Pedro La Laguna, Sololá, Guatemala</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Síguenos</h4>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors">
                                <Instagram className="h-6 w-6" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Facebook className="h-6 w-6" />
                                <span className="sr-only">Facebook</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
                    <p>&copy; {new Date().getFullYear()} Mandalas Hostal. Todos los derechos reservados.</p>
                    <Link href="/admin" className="text-orange-500 font-bold hover:text-orange-400 transition-colors flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        Admin Portal
                    </Link>
                </div>
            </div>
        </footer>
    )
}
