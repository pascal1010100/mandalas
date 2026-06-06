const rawWhatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""

export const publicContact = {
    whatsappNumber: rawWhatsAppNumber.replace(/\D/g, ""),
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@mandalashostal.com",
}

export function buildContactHref(message: string) {
    if (publicContact.whatsappNumber) {
        return `https://wa.me/${publicContact.whatsappNumber}?text=${encodeURIComponent(message)}`
    }

    return `mailto:${publicContact.email}?subject=${encodeURIComponent("Consulta Mandalas")}&body=${encodeURIComponent(message)}`
}

export function getDisplayPhone() {
    if (!publicContact.whatsappNumber) return "WhatsApp"

    return `+${publicContact.whatsappNumber.replace(/^502/, "502 ")}`
}
