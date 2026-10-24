'use client'

import Link from 'next/link'
import { useCallback, useRef, useState } from 'react'
import useSWR from 'swr'
import { Cpu, FileClock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ZONA_EJEMPLO, type Punto } from '@/lib/laboratorio/geometria'
import { calcularNivel, UMBRALES_POR_DEFECTO, type Umbrales } from '@/lib/laboratorio/nivel'
import { crearSugerenciaDeCamara } from '@/lib/services/sugerencias'
import { EtiquetaSimulado } from '../etiqueta-simulado'
import { CamaraDemoUbicacion } from './camara-demo'
import { CAMARA_POR_DEFECTO, CLASE_BOTON, type CamaraDemo } from './estilos'
import { GraficoCola } from './grafico-cola'
import { PanelMetricas } from './panel-metricas'
import { Privacidad } from './privacidad'
import { useAnalisis, type CongestionSostenida, type ModoConteo } from './use-analisis'
import { useDetector } from './use-detector'
import { VisorVideo } from './visor-video'

const leerConteos = (url: string): Promise<number[]> => fetch(url).then((respuesta) => respuesta.json())

export function Laboratorio() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [zona, setZona] = useState<Punto[]>([])
  const [cerrada, setCerrada] = useState(false)
  const [dibujando, setDibujando] = useState(false)
  const [umbrales, setUmbrales] = useState<Umbrales>(UMBRALES_POR_DEFECTO)
  const [camara, setCamara] = useState<CamaraDemo>(CAMARA_POR_DEFECTO)
  const [forzarRespaldo, setForzarRespaldo] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

  const { estado, detectar, reintentar } = useDetector()
  const { data: conteosRespaldo } = useSWR('/demo-conteos.json', leerConteos, { revalidateOnFocus: false })

  const modo: ModoConteo = estado === 'cargando' ? 'cargando' : estado === 'listo' && !forzarRespaldo ? 'vivo' : 'respaldo'

  const alCongestionSostenida = useCallback(
    ({ promedio, confianza, segundos }: CongestionSostenida) => {
      const sugerencia = crearSugerenciaDeCamara({ ...camara, promedio, confianza, segundosSostenidos: segundos })
      if (sugerencia) setAviso('Se generó una sugerencia de congestión a partir de la cámara demo.')
    },
    [camara],
  )

  const analisis = useAnalisis({
    videoRef,
    canvasRef,
    zona,
    cerrada,
    umbrales,
    modo,
    conteosRespaldo,
    detectar,
    reproduciendo,
    onCongestionSostenida: alCongestionSostenida,
  })
  const nivel = calcularNivel(analisis.promedio, umbrales)
  const necesitaZona = modo === 'vivo' && !cerrada

  function borrarZona() {
    setZona([])
    setCerrada(false)
    setDibujando(false)
    analisis.reiniciar()
  }

  function empezarZona() {
    setZona([])
    setCerrada(false)
    setDibujando(true)
    analisis.reiniciar()
  }

  function cerrarZona() {
    if (zona.length < 3) return
    setCerrada(true)
    setDibujando(false)
    analisis.reiniciar()
  }

  function usarEjemplo() {
    setZona(ZONA_EJEMPLO)
    setCerrada(true)
    setDibujando(false)
    analisis.reiniciar()
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 lg:p-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-balance text-2xl font-bold">Laboratorio de análisis de tránsito (demo)</h1>
          <EtiquetaSimulado />
        </div>
        <p className="text-pretty text-sm text-muted-foreground">
          Detecta vehículos en un video de demostración, mide la cola en una zona que dibuja el operador y sugiere una afectación cuando la congestión se sostiene.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-card p-3 text-sm">
        <span className="flex items-center gap-2 font-semibold" role="status">
          {modo === 'cargando' && (
            <>
              <Cpu className="size-4 text-primary" aria-hidden="true" />
              Cargando el modelo de detección (hasta 10 s)…
            </>
          )}
          {modo === 'vivo' && (
            <>
              <Cpu className="size-4 text-primary" aria-hidden="true" />
              Detección en vivo con coco-ssd, en este navegador
            </>
          )}
          {modo === 'respaldo' && (
            <>
              <FileClock className="size-4 text-(--aviso)" aria-hidden="true" />
              Modo respaldo: conteos precalculados
            </>
          )}
        </span>
        {modo === 'vivo' && (
          <button type="button" onClick={() => setForzarRespaldo(true)} className={CLASE_BOTON}>
            Usar conteos precalculados
          </button>
        )}
        {modo === 'respaldo' && (
          <button
            type="button"
            onClick={() => {
              setForzarRespaldo(false)
              if (estado === 'respaldo') reintentar()
            }}
            className={CLASE_BOTON}
          >
            {estado === 'respaldo' ? 'Reintentar detección en vivo' : 'Volver a la detección en vivo'}
          </button>
        )}
      </div>

      {necesitaZona && (
        <p role="note" className="rounded-md border border-border bg-secondary p-3 text-sm text-secondary-foreground">
          Marcá una zona de cola sobre el video, o usá la zona de ejemplo, para empezar a contar vehículos.
        </p>
      )}

      {aviso && (
        <p role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-primary bg-secondary p-3 text-sm font-medium text-primary">
          <span>{aviso}</span>
          <Link href="/tr/sugerencias" className="font-semibold underline underline-offset-2">
            Ver en Sugerencias IA
          </Link>
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <VisorVideo
          videoRef={videoRef}
          canvasRef={canvasRef}
          reproduciendo={reproduciendo}
          onReproduccion={setReproduciendo}
          onMetadatos={analisis.dibujar}
          zona={zona}
          cerrada={cerrada}
          dibujando={dibujando}
          onEmpezar={empezarZona}
          onPunto={(punto) => setZona((actual) => [...actual, punto])}
          onCerrar={cerrarZona}
          onDeshacer={() => setZona((actual) => actual.slice(0, -1))}
          onBorrar={borrarZona}
          onEjemplo={usarEjemplo}
        />
        <PanelMetricas
          conteo={analisis.conteoActual}
          promedio={analisis.promedio}
          nivel={nivel}
          segundosCongestion={analisis.segundosCongestion}
          umbrales={umbrales}
          onUmbrales={setUmbrales}
          midiendo={analisis.serie.length > 0}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolución de los últimos 2 minutos</CardTitle>
          <CardDescription>Vehículos contados por segundo y promedio móvil del último minuto.</CardDescription>
        </CardHeader>
        <CardContent>
          <GraficoCola serie={analisis.serie} umbrales={umbrales} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cámara demo en el mapa</CardTitle>
            <CardDescription>Las sugerencias usan esta ubicación. Por defecto, Pellegrini y Oroño.</CardDescription>
          </CardHeader>
          <CardContent>
            <CamaraDemoUbicacion camara={camara} onCambiar={setCamara} />
          </CardContent>
        </Card>
        <Privacidad />
      </div>
    </div>
  )
}
