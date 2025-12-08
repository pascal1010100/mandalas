"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

// Dynamic imports to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

export function LocationMap() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
            ; (async () => {
                const L = (await import("leaflet")).default
                // Fix leaflet icon issue in Next.js
                // @ts-ignore
                delete L.Icon.Default.prototype._getIconUrl;
                // @ts-ignore
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                });
            })()
    }, [])

    if (!isMounted) return <div className="h-[400px] w-full bg-stone-200 animate-pulse rounded-lg" />

    const puebloCoords: [number, number] = [14.693, -91.274] // Approximate
    const hideoutCoords: [number, number] = [14.688, -91.270] // Approximate (further along shore)

    return (
        <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-xl border border-stone-200">
            <MapContainer center={puebloCoords} zoom={15} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Light theme map
                />

                <Marker position={puebloCoords}>
                    <Popup>
                        <strong>Mandalas</strong><br />
                        El corazón de la acción.
                    </Popup>
                </Marker>

                <Marker position={hideoutCoords}>
                    <Popup>
                        <strong>Mandalas Hideout</strong><br />
                        Tu refugio natural.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
