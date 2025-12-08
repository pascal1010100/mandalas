"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { BookingModal } from "@/components/shared/booking-modal"

export function MobileCTA() {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-stone-200 z-50 md:hidden">
            <BookingModal>
                <Button className="w-full rounded-full text-lg h-12 shadow-lg gap-2 font-bold animate-in slide-in-from-bottom duration-500">
                    <Calendar className="w-5 h-5" />
                    Reservar Ahora
                </Button>
            </BookingModal>
        </div>
    )
}
