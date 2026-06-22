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
                // @ts-expect-error - Leaflet types issue
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                });
            })()
    }, [])

    if (!isMounted) return <div className="h-full min-h-[320px] w-full animate-pulse rounded-lg bg-stone-900" />

    const puebloCoords: [number, number] = [14.693, -91.274] // Approximate
    const hideoutCoords: [number, number] = [14.682795, -91.259236]

    return (
        <div className="h-full min-h-[320px] w-full overflow-hidden rounded-lg border border-white/10 bg-stone-950">
            <MapContainer center={puebloCoords} zoom={15} scrollWheelZoom={false} className="h-full w-full bg-stone-950">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <Marker position={puebloCoords}>
                    <Popup>
                        <strong>Mandalas</strong><br />
                        In the heart of town.
                    </Popup>
                </Marker>

                <Marker position={hideoutCoords}>
                    <Popup>
                        <strong>Mandalas Hideout</strong><br />
                        Your quieter retreat.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
