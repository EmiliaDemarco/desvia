'use client'

import { useEffect, useRef, useState } from 'react'

// El panel cambia a su layout de escritorio (con sidebar) desde 1024 px de ancho.
const ANCHO_ESCRITORIO = 1024

type Medida = { ancho: number; alto: number; escala: number }

export function MarcoPanel() {
  const contenedor = useRef<HTMLDivElement>(null)
  const [medida, setMedida] = useState<Medida>({ ancho: ANCHO_ESCRITORIO, alto: 700, escala: 1 })

  useEffect(() => {
    const elemento = contenedor.current
    if (!elemento) return

    // Si el hueco es más angosto que el layout de escritorio, se renderiza a 1024 px y se achica para que entre.
    const observador = new ResizeObserver(([entrada]) => {
      const { width, height } = entrada.contentRect
      if (width === 0 || height === 0) return
      const ancho = window.innerWidth >= 1024 ? Math.max(width, ANCHO_ESCRITORIO) : width
      const escala = width / ancho
      setMedida({ ancho, alto: height / escala, escala })
    })
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  return (
    <div ref={contenedor} className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-[#d5dce8] bg-[#ffffff] shadow-sm">
      <iframe
        title="Panel municipal desvIA TR"
        src="/tr"
        className="absolute left-0 top-0 border-0"
        style={{ width: medida.ancho, height: medida.alto, transform: `scale(${medida.escala})`, transformOrigin: 'top left' }}
      />
    </div>
  )
}
