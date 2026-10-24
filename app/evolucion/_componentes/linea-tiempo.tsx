type Estado = 'implementada' | 'demostracion' | 'futura'

interface Etapa {
  numero: number
  titulo: string
  estado: Estado
  etiqueta: string
  resumen: string
  puntos: string[]
}

const ETAPAS: Etapa[] = [
  {
    numero: 1,
    titulo: 'Información preventiva',
    estado: 'implementada',
    etiqueta: 'Implementada en este prototipo',
    resumen: 'La ciudad informa antes de que la persona llegue al problema.',
    puntos: [
      'Mapa de afectaciones con filtros por tipo, estado e impacto.',
      'Alertas anticipadas según la ruta, las zonas habituales o la cercanía.',
      'Panel para que el operador cargue, publique, modifique y resuelva, con historial de cada cambio.',
    ],
  },
  {
    numero: 2,
    titulo: 'Análisis inteligente',
    estado: 'demostracion',
    etiqueta: 'Demostración con video de prueba. Requiere validación con la Municipalidad',
    resumen: 'Cámaras y sensores aportan datos agregados para detectar cuándo se forma una cola.',
    puntos: [
      'Conteo de vehículos dentro de una zona de cola que dibuja el operador.',
      'Nivel fluido, moderado o congestionado con umbrales editables.',
      'Si la congestión se sostiene, la IA genera una sugerencia y el operador decide si la publica.',
    ],
  },
  {
    numero: 3,
    titulo: 'Predicción y asistencia a la gestión',
    estado: 'futura',
    etiqueta: 'Visión futura',
    resumen: 'Anticipar problemas y apoyar decisiones, siempre con una persona al mando.',
    puntos: [
      'Estimar con antelación dónde es probable que se forme congestión.',
      'Proponer alternativas de desvío y horarios para planificar obras.',
      'Cruzar el historial de afectaciones con eventos y patrones de uso.',
    ],
  },
]

const ESTILO_ETIQUETA: Record<Estado, string> = {
  implementada: 'bg-[#1551A1] text-[#ffffff]',
  demostracion: 'border border-[#F26B1D] bg-[#fff1e8] text-[#7a3105]',
  futura: 'border border-dashed border-[#4b5870] bg-[#ffffff] text-[#4b5870]',
}

const ESTILO_MARCADOR: Record<Estado, string> = {
  implementada: 'bg-[#1551A1] text-[#ffffff]',
  demostracion: 'border-2 border-[#F26B1D] bg-[#ffffff] text-[#7a3105]',
  futura: 'border-2 border-dashed border-[#4b5870] bg-[#ffffff] text-[#4b5870]',
}

export function LineaTiempo() {
  return (
    <ol className="flex flex-col" aria-label="Etapas de la evolución con IA">
      {ETAPAS.map((etapa, indice) => {
        const ultima = indice === ETAPAS.length - 1
        return (
          <li key={etapa.numero} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full text-base font-black ${ESTILO_MARCADOR[etapa.estado]}`}
                aria-hidden="true"
              >
                {etapa.numero}
              </span>
              {!ultima && <span className="my-1 w-0.5 flex-1 bg-[#c3cddd]" aria-hidden="true" />}
            </div>

            <article className={`min-w-0 flex-1 ${ultima ? '' : 'pb-8'}`}>
              <p className="text-xs font-bold uppercase tracking-wide text-[#4b5870]">Etapa {etapa.numero}</p>
              <h2 className="mt-0.5 text-balance text-xl font-black text-[#0f1b33]">{etapa.titulo}</h2>
              <p className={`mt-2 inline-block rounded-md px-2.5 py-1 text-xs font-bold leading-snug sm:text-sm ${ESTILO_ETIQUETA[etapa.estado]}`}>
                {etapa.etiqueta}
              </p>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-[#0f1b33]">{etapa.resumen}</p>
              <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-[#2c3a52]">
                {etapa.puntos.map((punto) => (
                  <li key={punto}>{punto}</li>
                ))}
              </ul>
            </article>
          </li>
        )
      })}
    </ol>
  )
}
