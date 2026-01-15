
"use client"
import { useAppStore } from "@/lib/store"
import { format } from "date-fns"

export function DebugPanel() {
    const { bookings, rooms, isLoading } = useAppStore()
    const todayStr = format(new Date(), 'yyyy-MM-dd')

    return (
        <div className="p-4 bg-black/80 border border-red-500 text-green-400 font-mono text-xs rounded-xl mb-6 overflow-auto max-h-96">
            <h3 className="text-red-500 font-bold text-lg mb-2">🕵️ DEBUG PANEL (Temporary)</h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="text-white">Store Loading:</span> {isLoading ? 'TRUE' : 'FALSE'}
                </div>
                <div>
                    <span className="text-white">Total Bookings:</span> {bookings.length}
                </div>
                <div>
                    <span className="text-white">Active (Checked In):</span> {bookings.filter(b => b.status === 'checked_in').length}
                </div>
                <div>
                    <span className="text-white">Today Local:</span> {todayStr}
                </div>
            </div>

            <h4 className="border-b border-gray-700 mt-4 mb-2">First 3 Bookings:</h4>
            {bookings.slice(0, 3).map(b => (
                <div key={b.id} className="mb-2 p-2 bg-white/5 rounded">
                    <div className="text-yellow-400">{b.guestName} ({b.status})</div>
                    <div>RoomType: <span className="text-blue-300">&apos;{b.roomType}&apos;</span></div>
                    <div>Location: <span className="text-blue-300">&apos;{b.location}&apos;</span></div>
                    <div>CheckIn: {b.checkIn}</div>
                    <div>UnitId: &apos;{b.unitId}&apos;</div>
                </div>
            ))}

            <h4 className="border-b border-gray-700 mt-4 mb-2">Raw Store Rooms (First 1):</h4>
            {rooms.slice(0, 1).map(r => (
                <div key={r.id} className="mb-2">
                    ID: &apos;{r.id}&apos; | Loc: &apos;{r.location}&apos; | Type: &apos;{r.type}&apos;
                </div>
            ))}
        </div>
    )
}
