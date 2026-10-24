'use client'

import { useEffect } from 'react'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Afectacion } from '@/lib/types'

const centro: [number, number] = [-32.9468, -60.6393]
const icono = (afectacion: Afectacion) => L.divIcon({ className: 'desvia-marker', html: `<span class="marker-dot marker-${afectacion.impacto}-${afectacion.estado}">${afectacion.tipo === 'obra' ? '⚒' : afectacion.tipo === 'corte' ? '×' : afectacion.tipo === 'accidente' ? '!' : afectacion.tipo === 'congestion' ? '≈' : '•'}</span>`, iconSize: [36, 36], iconAnchor: [18, 18] })

function Recentrar({ ubicacion }: { ubicacion: [number, number] | null }) { const map = useMap(); useEffect(() => { if (ubicacion) map.flyTo(ubicacion, 15) }, [map, ubicacion]); return null }

export default function Mapa({ afectaciones, seleccionada, onSeleccionar, ubicacion }: { afectaciones: Afectacion[]; seleccionada?: Afectacion; onSeleccionar: (afectacion: Afectacion) => void; ubicacion: [number, number] | null }) {
  return <MapContainer center={centro} zoom={14} scrollWheelZoom className="h-full min-h-[430px] w-full"><TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{afectaciones.map((item) => <Marker key={item.id} position={[item.latitud, item.longitud]} icon={icono(item)} eventHandlers={{ click: () => onSeleccionar(item) }}><Popup>{item.titulo}</Popup></Marker>)}{ubicacion && <CircleMarker center={ubicacion} radius={8} pathOptions={{ color: '#F26B1D', fillColor: '#F26B1D', fillOpacity: 0.8 }} />}<Recentrar ubicacion={ubicacion} /></MapContainer>
}
