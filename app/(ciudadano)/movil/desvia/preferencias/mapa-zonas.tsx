'use client'

import { Circle, CircleMarker, MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import type { ZonaHabitual } from '@/lib/types'

const centro: [number, number] = [-32.9468, -60.6393]

function CapturaToque({ onElegir }: { onElegir: (punto: [number, number]) => void }) {
  useMapEvents({ click: (evento) => onElegir([evento.latlng.lat, evento.latlng.lng]) })
  return null
}

interface MapaZonasProps {
  zonas: ZonaHabitual[]
  punto: [number, number] | null
  onElegir: (punto: [number, number]) => void
}

export default function MapaZonas({ zonas, punto, onElegir }: MapaZonasProps) {
  return (
    <MapContainer center={centro} zoom={13} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {zonas.map((zona) => (
        <Circle key={zona.id} center={[zona.latitud, zona.longitud]} radius={zona.radioM} pathOptions={{ color: '#1551A1', weight: 2, fillColor: '#1551A1', fillOpacity: 0.15 }} />
      ))}
      {punto && (
        <>
          <Circle center={punto} radius={500} pathOptions={{ color: '#F26B1D', weight: 2, dashArray: '6 6', fillColor: '#F26B1D', fillOpacity: 0.15 }} />
          <CircleMarker center={punto} radius={6} pathOptions={{ color: '#F26B1D', fillColor: '#F26B1D', fillOpacity: 1 }} />
        </>
      )}
      <CapturaToque onElegir={onElegir} />
    </MapContainer>
  )
}
