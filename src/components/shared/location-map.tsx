"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import type { Map as LeafletMap } from "leaflet"
import "leaflet/dist/leaflet.css"

// Dynamic imports to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

const puebloCoords: [number, number] = [14.69448948, -91.27277374]
const hideoutCoords: [number, number] = [14.682795, -91.259236]

export function LocationMap() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [shouldLoad, setShouldLoad] = useState(false)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true)
                    observer.disconnect()
                }
            },
            { rootMargin: "300px" },
        )

        observer.observe(container)

        return () => observer.disconnect()
    }, [])

    return (
        <div ref={containerRef} className="h-full min-h-[320px] w-full">
            {shouldLoad ? (
                <InteractiveMap />
            ) : (
                <div
                    className="h-full min-h-[320px] w-full animate-pulse rounded-lg bg-stone-900"
                    aria-label="Interactive map loading"
                    role="status"
                />
            )}
        </div>
    )
}

function InteractiveMap() {
    const [isMounted, setIsMounted] = useState(false)
    const [map, setMap] = useState<LeafletMap | null>(null)

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

    useEffect(() => {
        if (!map) return

        const fitPropertyBounds = () => {
            const padding = window.innerWidth < 640 ? 48 : 64

            map.invalidateSize({ pan: false })
            map.fitBounds([puebloCoords, hideoutCoords], {
                padding: [padding, padding],
                maxZoom: 15,
            })
        }

        fitPropertyBounds()
        window.addEventListener("resize", fitPropertyBounds)

        return () => window.removeEventListener("resize", fitPropertyBounds)
    }, [map])

    if (!isMounted) return <div className="h-full min-h-[320px] w-full animate-pulse rounded-lg bg-stone-900" />

    return (
        <div className="h-full min-h-[320px] w-full overflow-hidden rounded-lg border border-white/10 bg-stone-950">
            <MapContainer
                ref={setMap}
                center={puebloCoords}
                zoom={15}
                scrollWheelZoom={false}
                className="h-full w-full bg-stone-950 [&_.leaflet-control-zoom_a]:!h-11 [&_.leaflet-control-zoom_a]:!w-11 [&_.leaflet-control-zoom_a]:!leading-11"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    className="mandalas-map-tiles"
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={puebloCoords}>
                    <Popup>
                        <strong>Mandalas</strong><br />
                        Zona 2, segundo acceso peatonal.
                    </Popup>
                </Marker>

                <Marker position={hideoutCoords}>
                    <Popup>
                        <strong>Mandalas Hideout</strong><br />
                        Zona 3, 05 avenida.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
