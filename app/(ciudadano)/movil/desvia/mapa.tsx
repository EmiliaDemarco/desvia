'use client'

import { useEffect } from 'react'
import { Circle, CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Afectacion } from '@/lib/types'

const centro: [number, number] = [-32.9468, -60.6393]
const icono = (afectacion: Afectacion) => L.divIcon({ className: 'desvia-marker', html: `<span class="marker-dot marker-${afectacion.impacto}-${afectacion.estado}">${afectacion.tipo === 'obra' ? '⚒' : afectacion.tipo === 'corte' ? '×' : afectacion.tipo === 'accidente' ? '!' : afectacion.tipo === 'congestion' ? '≈' : '•'}</span>`, iconSize: [36, 36], iconAnchor: [18, 18] })
const iconoJuan = L.divIcon({ className: 'juan-marker', html: '<span class="juan-dot"></span><span class="juan-label">Juan</span>', iconSize: [44, 44], iconAnchor: [22, 22] })

function Recentrar({ ubicacion }: { ubicacion: [number, number] | null }) { const map = useMap(); useEffect(() => { if (ubicacion) map.flyTo(ubicacion, 15) }, [map, ubicacion]); return null }

function CentrarSeleccion({ seleccionada }: { seleccionada?: Afectacion }) {
  const map = useMap()
  useEffect(() => {
    if (seleccionada) map.flyTo([seleccionada.latitud, seleccionada.longitud], Math.max(map.getZoom(), 15))
  }, [map, seleccionada])
  return null
}

function AjustarRecorrido({ ruta, radioM, reinicioId }: { ruta?: Array<[number, number]>; radioM: number; reinicioId: number }) {
  const map = useMap()
  useEffect(() => {
    if (reinicioId === 0 || !ruta?.length) return
    const limites = L.latLng(ruta[0]).toBounds(radioM * 2).extend(ruta)
    map.fitBounds(limites, { padding: [24, 24] })
  }, [map, ruta, radioM, reinicioId])
  return null
}

interface MapaProps {
  afectaciones: Afectacion[]
  seleccionada?: Afectacion
  onSeleccionar: (afectacion: Afectacion) => void
  ubicacion: [number, number] | null
  ruta?: Array<[number, number]>
  juan: [number, number] | null
  radioM: number
  reinicioId: number
}

export default function Mapa({ afectaciones, seleccionada, onSeleccionar, ubicacion, ruta, juan, radioM, reinicioId }: MapaProps) {
  return (
    <MapContainer center={centro} zoom={14} scrollWheelZoom className="h-full min-h-[430px] w-full">
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {ruta && <Polyline positions={ruta} pathOptions={{ color: '#1551A1', weight: 4, opacity: 0.8 }} />}
      {juan && <Circle center={juan} radius={radioM} pathOptions={{ color: '#F26B1D', weight: 2, dashArray: '6 6', fillColor: '#F26B1D', fillOpacity: 0.08 }} />}
      {afectaciones.map((item) => (
        <Marker key={item.id} position={[item.latitud, item.longitud]} icon={icono(item)} eventHandlers={{ click: () => onSeleccionar(item) }}>
          <Popup>{item.titulo}</Popup>
        </Marker>
      ))}
      {juan && <Marker position={juan} icon={iconoJuan} zIndexOffset={1000} interactive={false} keyboard={false} />}
      {ubicacion && <CircleMarker center={ubicacion} radius={8} pathOptions={{ color: '#F26B1D', fillColor: '#F26B1D', fillOpacity: 0.8 }} />}
      <Recentrar ubicacion={ubicacion} />
      <CentrarSeleccion seleccionada={seleccionada} />
      <AjustarRecorrido ruta={ruta} radioM={radioM} reinicioId={reinicioId} />
    </MapContainer>
  )
}
