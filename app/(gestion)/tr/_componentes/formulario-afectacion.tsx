'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Lock } from 'lucide-react'
import {
  IMPACTOS,
  NOMBRE_CORTE,
  NOMBRE_IMPACTO,
  NOMBRE_PUBLICACION,
  NOMBRE_TIPO,
  PUBLICACIONES,
  TIPOS_AFECTACION,
  TIPOS_CORTE,
  formatearFechaHora,
} from '@/lib/formato'
import {
  coordenadaValida,
  valoresDesdeAfectacion,
  valoresParaAltaNueva,
  type ErroresFormulario,
  type ValoresFormulario,
} from '@/lib/gestion/formulario'
import { AHORA_SIMULADO } from '@/lib/alerts/simulacion'
import { crearAfectacion, editarAfectacion } from '@/lib/services/afectaciones'
import { useDemoStore } from '@/lib/store'
import type { Afectacion, Impacto, Publicacion, TipoAfectacion, TipoCorte } from '@/lib/types'
import { useHidratado } from '@/lib/use-hidratado'
import { Campo, CLASE_CAMPO } from './campos'
import { EtiquetaSimulado } from './etiqueta-simulado'
import { AfectacionNoEncontrada, EsqueletoCarga } from './no-encontrada'

const SelectorUbicacion = dynamic(() => import('./selector-ubicacion'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
})

const AYUDA_PUBLICACION: Record<Publicacion, string> = {
  borrador: 'No se muestra a la ciudadanía ni dispara alertas.',
  programada: 'Se muestra y dispara alertas recién cuando llega la fecha de inicio.',
  publicada: 'Se muestra de inmediato en el mapa ciudadano y entra al motor de alertas.',
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <legend className="px-1 text-base font-bold">{titulo}</legend>
      {children}
    </fieldset>
  )
}

interface FormularioInternoProps {
  existente?: Afectacion
}

function FormularioInterno({ existente }: FormularioInternoProps) {
  const router = useRouter()
  const resumenRef = useRef<HTMLDivElement>(null)
  const [valores, setValores] = useState<ValoresFormulario>(() =>
    existente ? valoresDesdeAfectacion(existente) : valoresParaAltaNueva(AHORA_SIMULADO),
  )
  const [errores, setErrores] = useState<ErroresFormulario>({})
  const [guardando, setGuardando] = useState(false)

  const lat = coordenadaValida(valores.latitud, 90)
  const lng = coordenadaValida(valores.longitud, 180)
  const punto: [number, number] | null = lat !== null && lng !== null ? [lat, lng] : null

  function cambiar<K extends keyof ValoresFormulario>(campo: K, valor: ValoresFormulario[K]) {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }))
    const claveError = campo === 'latitud' || campo === 'longitud' ? 'ubicacion' : campo
    if (claveError in errores) setErrores(({ [claveError as keyof ErroresFormulario]: _quitado, ...resto }) => resto)
  }

  function elegirPunto([latitud, longitud]: [number, number]) {
    setValores((anteriores) => ({ ...anteriores, latitud: latitud.toFixed(6), longitud: longitud.toFixed(6) }))
    if (errores.ubicacion) setErrores(({ ubicacion: _quitado, ...resto }) => resto)
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setGuardando(true)
    const resultado = existente ? await editarAfectacion(existente.id, valores) : await crearAfectacion(valores)
    setGuardando(false)
    if (!resultado.ok) {
      setErrores(resultado.errores)
      requestAnimationFrame(() => resumenRef.current?.focus())
      return
    }
    router.push(`/tr/afectaciones/${resultado.afectacion.id}?guardado=${existente ? 'editada' : 'creada'}`)
  }

  const mensajesError = Object.values(errores)

  return (
    <form onSubmit={enviar} noValidate className="mx-auto flex w-full max-w-3xl flex-col gap-5 p-4 lg:p-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-balance text-2xl font-bold">{existente ? 'Editar afectación' : 'Nueva afectación'}</h1>
          <EtiquetaSimulado />
        </div>
        <p className="text-pretty text-sm text-muted-foreground">
          Los campos con asterisco son obligatorios. Al guardar se actualizan el mapa ciudadano, los indicadores y el motor de alertas.
        </p>
      </header>

      <div
        ref={resumenRef}
        tabIndex={-1}
        role="alert"
        className={mensajesError.length ? 'rounded-lg border border-destructive bg-card p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring' : 'sr-only'}
      >
        {mensajesError.length > 0 && (
          <>
            <p className="font-semibold text-destructive">Revisá estos puntos antes de guardar:</p>
            <ul className="mt-1 list-disc pl-5">
              {mensajesError.map((mensaje) => (
                <li key={mensaje}>{mensaje}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <Seccion titulo="Información pública">
        <Campo etiqueta="Título" obligatorio error={errores.titulo}>
          {(control) => <input {...control} type="text" value={valores.titulo} onChange={(e) => cambiar('titulo', e.target.value)} className={CLASE_CAMPO} />}
        </Campo>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="Tipo" obligatorio error={errores.tipo}>
            {(control) => (
              <select {...control} value={valores.tipo} onChange={(e) => cambiar('tipo', e.target.value as TipoAfectacion | '')} className={CLASE_CAMPO}>
                <option value="">Elegí un tipo</option>
                {TIPOS_AFECTACION.map((t) => (
                  <option key={t} value={t}>
                    {NOMBRE_TIPO[t]}
                  </option>
                ))}
              </select>
            )}
          </Campo>
          <Campo etiqueta="Impacto">
            {(control) => (
              <select {...control} value={valores.impacto} onChange={(e) => cambiar('impacto', e.target.value as Impacto)} className={CLASE_CAMPO}>
                {IMPACTOS.map((i) => (
                  <option key={i} value={i}>
                    {NOMBRE_IMPACTO[i]}
                  </option>
                ))}
              </select>
            )}
          </Campo>
        </div>
        <Campo etiqueta="Descripción pública" ayuda="Es lo que lee la ciudadanía. No incluyas datos internos.">
          {(control) => <textarea {...control} rows={3} value={valores.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} className={CLASE_CAMPO} />}
        </Campo>
      </Seccion>

      <Seccion titulo="Ubicación">
        <div className="grid gap-4 sm:grid-cols-3">
          <Campo etiqueta="Calle">
            {(control) => <input {...control} type="text" value={valores.calle} onChange={(e) => cambiar('calle', e.target.value)} className={CLASE_CAMPO} />}
          </Campo>
          <Campo etiqueta="Altura">
            {(control) => <input {...control} type="text" inputMode="numeric" value={valores.altura} onChange={(e) => cambiar('altura', e.target.value)} className={CLASE_CAMPO} />}
          </Campo>
          <Campo etiqueta="Intersección">
            {(control) => <input {...control} type="text" value={valores.interseccion} onChange={(e) => cambiar('interseccion', e.target.value)} className={CLASE_CAMPO} />}
          </Campo>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold" id="etiqueta-mapa">
            Ubicación en el mapa<span aria-hidden="true" className="text-destructive"> *</span>
            <span className="sr-only"> (obligatorio)</span>
          </p>
          <div
            role="group"
            aria-labelledby="etiqueta-mapa"
            className={`h-72 overflow-hidden rounded-md border ${errores.ubicacion ? 'border-destructive' : 'border-border'}`}
          >
            <SelectorUbicacion punto={punto} onElegir={elegirPunto} />
          </div>
          <p className="text-xs text-muted-foreground">Hacé clic en el mapa para marcar el punto, o ingresá las coordenadas a mano.</p>
          {errores.ubicacion && <p className="text-sm font-medium text-destructive">{errores.ubicacion}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="Latitud">
            {(control) => (
              <input
                {...control}
                aria-invalid={errores.ubicacion ? true : undefined}
                type="text"
                inputMode="decimal"
                value={valores.latitud}
                onChange={(e) => cambiar('latitud', e.target.value)}
                className={CLASE_CAMPO}
              />
            )}
          </Campo>
          <Campo etiqueta="Longitud">
            {(control) => (
              <input
                {...control}
                aria-invalid={errores.ubicacion ? true : undefined}
                type="text"
                inputMode="decimal"
                value={valores.longitud}
                onChange={(e) => cambiar('longitud', e.target.value)}
                className={CLASE_CAMPO}
              />
            )}
          </Campo>
        </div>
      </Seccion>

      <Seccion titulo="Fechas y tipo de corte">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="Inicio"
            obligatorio
            error={errores.inicio}
            ayuda={`La demo usa un reloj fijo: ahora es el ${formatearFechaHora(AHORA_SIMULADO.toISOString())}. Un inicio posterior la deja programada.`}
          >
            {(control) => <input {...control} type="datetime-local" value={valores.inicio} onChange={(e) => cambiar('inicio', e.target.value)} className={CLASE_CAMPO} />}
          </Campo>
          <Campo etiqueta="Fin estimado" error={errores.fin} ayuda="Opcional. Debe ser posterior al inicio.">
            {(control) => (
              <input {...control} type="datetime-local" value={valores.fin} min={valores.inicio || undefined} onChange={(e) => cambiar('fin', e.target.value)} className={CLASE_CAMPO} />
            )}
          </Campo>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-semibold">Tipo de corte</legend>
            <div className="flex gap-2">
              {TIPOS_CORTE.map((corte) => (
                <label
                  key={corte}
                  className="flex min-h-11 flex-1 cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-secondary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
                >
                  <input
                    type="radio"
                    name="tipoCorte"
                    value={corte}
                    checked={valores.tipoCorte === corte}
                    onChange={() => cambiar('tipoCorte', corte as TipoCorte)}
                    className="accent-[var(--primary)]"
                  />
                  {NOMBRE_CORTE[corte]}
                </label>
              ))}
            </div>
          </fieldset>
          <Campo etiqueta="Sentido afectado" ayuda="Por ejemplo: ambos sentidos, norte a sur.">
            {(control) => <input {...control} type="text" value={valores.sentidoAfectado} onChange={(e) => cambiar('sentidoAfectado', e.target.value)} className={CLASE_CAMPO} />}
          </Campo>
        </div>
      </Seccion>

      <Seccion titulo="Fuente y publicación">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="Fuente">
            {(control) => <input {...control} type="text" value={valores.fuente} onChange={(e) => cambiar('fuente', e.target.value)} className={CLASE_CAMPO} />}
          </Campo>
          <Campo etiqueta="Estado de publicación" ayuda={AYUDA_PUBLICACION[valores.publicacion]}>
            {(control) => (
              <select {...control} value={valores.publicacion} onChange={(e) => cambiar('publicacion', e.target.value as Publicacion)} className={CLASE_CAMPO}>
                {PUBLICACIONES.map((p) => (
                  <option key={p} value={p}>
                    {NOMBRE_PUBLICACION[p]}
                  </option>
                ))}
              </select>
            )}
          </Campo>
        </div>
      </Seccion>

      <fieldset className="flex min-w-0 flex-col gap-3 rounded-lg border border-dashed border-muted-foreground bg-secondary p-4">
        <legend className="flex items-center gap-2 px-1 text-base font-bold">
          <Lock className="size-4" aria-hidden="true" />
          Observaciones internas
        </legend>
        <p className="text-xs font-semibold text-muted-foreground">No visible para ciudadanos</p>
        <Campo etiqueta="Notas para el equipo">
          {(control) => (
            <textarea {...control} rows={3} value={valores.observacionesInternas} onChange={(e) => cambiar('observacionesInternas', e.target.value)} className={CLASE_CAMPO} />
          )}
        </Campo>
      </fieldset>

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          href={existente ? `/tr/afectaciones/${existente.id}` : '/tr/afectaciones'}
          className="inline-flex min-h-11 items-center rounded-md border border-border bg-card px-4 text-sm font-semibold outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={guardando}
          className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {guardando ? 'Guardando…' : existente ? 'Guardar cambios' : 'Guardar afectación'}
        </button>
      </div>
    </form>
  )
}

export function FormularioAfectacion({ id }: { id?: string }) {
  const hidratado = useHidratado()
  const afectaciones = useDemoStore((s) => s.afectaciones)

  if (!hidratado) return <EsqueletoCarga />
  const existente = id ? afectaciones.find((a) => a.id === id) : undefined
  if (id && !existente) return <AfectacionNoEncontrada />

  return <FormularioInterno key={existente?.id ?? 'nueva'} existente={existente} />
}
