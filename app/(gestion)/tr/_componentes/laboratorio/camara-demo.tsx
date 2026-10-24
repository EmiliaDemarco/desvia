'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MapPin, RotateCcw } from 'lucide-react'
import { zonaMasCercana } from '@/lib/gestion/zona'
import { CAMARA_POR_DEFECTO, CLASE_BOTON, CLASE_BOTON_PRIMARIO, type CamaraDemo } from './estilos'

const SelectorUbicacion = dynamic(() => import('../selector-ubicacion'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
})

interface CamaraDemoProps {
  camara: CamaraDemo
  onCambiar: (camara: CamaraDemo) => void
}

export function CamaraDemoUbicacion({ camara, onCambiar }: CamaraDemoProps) {
  const [eligiendo, setEligiendo] = useState(false)
  const esPorDefecto = camara.latitud === CAMARA_POR_DEFECTO.latitud && camara.longitud === CAMARA_POR_DEFECTO.longitud

  function elegir([latitud, longitud]: [number, number]) {
    onCambiar({ latitud, longitud, direccion: `Zona ${zonaMasCercana(latitud, longitud)}` })
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-start gap-2 text-sm">
        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <span className="font-semibold">{camara.direccion}</span>
          <span className="block text-xs tabular-nums text-muted-foreground">
            {camara.latitud.toFixed(5)}, {camara.longitud.toFixed(5)}
          </span>
        </span>
      </p>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setEligiendo((valor) => !valor)} aria-expanded={eligiendo} className={eligiendo ? CLASE_BOTON_PRIMARIO : CLASE_BOTON}>
          {eligiendo ? 'Listo' : 'Cambiar ubicación en el mapa'}
        </button>
        {!esPorDefecto && (
          <button type="button" onClick={() => onCambiar(CAMARA_POR_DEFECTO)} className={CLASE_BOTON}>
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Volver a Pellegrini y Oroño
          </button>
        )}
      </div>

      {eligiendo && (
        <div className="flex flex-col gap-1.5">
          <div className="h-64 overflow-hidden rounded-md border border-border">
            <SelectorUbicacion punto={[camara.latitud, camara.longitud]} onElegir={elegir} />
          </div>
          <p className="text-xs text-muted-foreground">Tocá el mapa para ubicar la cámara demo.</p>
        </div>
      )}
    </div>
  )
}
