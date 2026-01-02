import React from 'react'
import { RoomConfig, useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Check, User, BedDouble, Lock } from 'lucide-react'

interface BedSelectorProps {
    room: RoomConfig
    dateRange: { from: Date | undefined; to: Date | undefined }
    selectedUnits: string[] // List of selected unit IDs (e.g. ["1", "3"])
    onToggleUnit: (unitId: string) => void
    maxSelections: number
    activeColorClass?: string // Optional override for selected state
}

export function BedSelector({ room, dateRange, selectedUnits, onToggleUnit, maxSelections, activeColorClass }: BedSelectorProps) {
    const { bookings } = useAppStore()

    // Helper: Determine if a specific unit (e.g., "1", "2") is occupied for the dates
    const getUnitStatus = (unitId: string) => {
        if (!dateRange.from || !dateRange.to) return 'unknown'

        // Filter bookings that overlap with requested dates
        const overlapping = bookings.filter(b => {
            // Basic overlap check
            if (b.status === 'cancelled' || b.status === 'checked_out') return false
            // 1. Must match room Type ID (e.g. pueblo_dorm)
            if (b.roomType !== room.id) return false

            // 2. Date Overlap
            const start = new Date(b.checkIn)
            const end = new Date(b.checkOut)
            // Standard overlap: (StartA < EndB) and (EndA > StartB)
            if (!(dateRange.from! < end && dateRange.to! > start)) return false

            return true
        })

        // Check if ANY overlapping booking has this unitId
        const directBlock = overlapping.find(b => b.unitId === unitId)
        if (directBlock) {
            if (directBlock.status === 'maintenance') return 'maintenance'
            return 'occupied'
        }

        // Logic for Legacy Bookings (No unitId)? 
        const legacyBookingsCount = overlapping.filter(b => !b.unitId).reduce((acc, b) => acc + (parseInt(b.guests) || 1), 0)
        const numericId = parseInt(unitId)
        if (!isNaN(numericId) && numericId <= legacyBookingsCount) {
            return 'occupied_legacy'
        }

        return 'available'
    }

    const units = Array.from({ length: room.capacity }, (_, i) => ({
        id: (i + 1).toString(),
        label: room.type === 'dorm' ? `Cama ${i + 1}` : `Habitación`,
    }))

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                    <BedDouble className="w-4 h-4" /> Distribución
                </h4>
                <div className={cn(
                    "text-[10px] font-bold px-3 py-1.5 rounded-full transition-all duration-300 font-mono tracking-wider",
                    selectedUnits.length === maxSelections
                        ? "bg-stone-900 text-white shadow-lg"
                        : "bg-stone-100 text-stone-500"
                )}>
                    {selectedUnits.length} / {maxSelections} SELECCIONADAS
                </div>
            </div>

            <div className={`grid gap-4 ${room.type === 'dorm' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {units.map((unit) => {
                    const status = getUnitStatus(unit.id)
                    const isSelected = selectedUnits.includes(unit.id)
                    const isDisabled = status !== 'available' && !isSelected

                    return (
                        <div
                            key={unit.id}
                            onClick={() => !isDisabled && onToggleUnit(unit.id)}
                            className={cn(
                                "relative p-4 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 h-32 group select-none",
                                isDisabled
                                    ? "bg-stone-50/50 border border-stone-100 opacity-40 cursor-not-allowed"
                                    : "cursor-pointer",
                                isSelected
                                    ? cn("text-white shadow-xl scale-[1.02]", activeColorClass || "bg-stone-800")
                                    : !isDisabled && "bg-white border border-stone-200 hover:border-stone-400 hover:shadow-md hover:-translate-y-1",
                                status === 'maintenance' && "bg-stone-100 border-dashed border-stone-300 opacity-60"
                            )}
                        >
                            {/* Icon layer */}
                            <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                                {isSelected ? (
                                    <Check className="w-8 h-8 animate-in zoom-in-50 duration-300 stroke-[1.5]" />
                                ) : status === 'available' ? (
                                    <BedDouble className="w-8 h-8 text-stone-300 group-hover:text-stone-500 transition-colors stroke-[1.5]" />
                                ) : status === 'maintenance' ? (
                                    <Lock className="w-8 h-8 text-stone-300 stroke-[1.5]" />
                                ) : (
                                    <User className="w-8 h-8 text-stone-300 stroke-[1.5]" />
                                )}
                            </div>

                            {/* Label */}
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                isSelected ? "text-stone-300" : "text-stone-400"
                            )}>
                                {unit.label}
                            </span>

                            {/* Corner Status Badge for non-available */}
                            {status !== 'available' && !isSelected && (
                                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-rose-400" />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Simple Legend */}
            <div className="flex justify-center gap-6 mt-4 opacity-50">
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-stone-400">
                    <div className="w-2 h-2 rounded-full bg-stone-200"></div> Disponible
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-stone-400">
                    <div className="w-2 h-2 rounded-full bg-stone-800"></div> Seleccionada
                </div>
            </div>
        </div>
    )
}
