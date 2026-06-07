const rawWhatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50232289507"

export const publicContact = {
    whatsappNumber: rawWhatsAppNumber.replace(/\D/g, ""),
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "mandalashostal@gmail.com",
    instagram: {
        mandalas: "https://www.instagram.com/mandalas_hostal/",
        hideout: "https://www.instagram.com/mandalashideout/",
    },
}

export function buildContactHref(message: string) {
    if (publicContact.whatsappNumber) {
        return `https://wa.me/${publicContact.whatsappNumber}?text=${encodeURIComponent(message)}`
    }

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
}

export function getDisplayPhone() {
    if (!publicContact.whatsappNumber) return "WhatsApp"

    return `+${publicContact.whatsappNumber.replace(/^502/, "502 ")}`
}
