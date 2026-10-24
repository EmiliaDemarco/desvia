'use client'

import { useEffect } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'

const CENTRO: [number, number] = [-32.9468, -60.6393]

function CapturaToque({ onElegir }: { onElegir: (punto: [number, number]) => void }) {
  useMapEvents({ click: (evento) => onElegir([evento.latlng.lat, evento.latlng.lng]) })
  return null
}

// Solo mueve el mapa si el punto quedó fuera de la vista, para no desplazarlo bajo el cursor al hacer clic.
function MantenerVisible({ punto }: { punto: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (punto && !map.getBounds().contains(punto)) map.panTo(punto)
  }, [map, punto])
  return null
}

interface SelectorUbicacionProps {
  punto: [number, number] | null
  onElegir: (punto: [number, number]) => void
}

export default function SelectorUbicacion({ punto, onElegir }: SelectorUbicacionProps) {
  return (
    <MapContainer center={punto ?? CENTRO} zoom={14} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {punto && <CircleMarker center={punto} radius={9} pathOptions={{ color: '#F26B1D', weight: 3, fillColor: '#F26B1D', fillOpacity: 0.85 }} />}
      <CapturaToque onElegir={onElegir} />
      <MantenerVisible punto={punto} />
    </MapContainer>
  )
}
