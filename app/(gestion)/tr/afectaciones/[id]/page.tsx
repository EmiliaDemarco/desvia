import { Suspense } from 'react'
import { DetalleAfectacion } from '../../_componentes/detalle-afectacion'
import { EsqueletoCarga } from '../../_componentes/no-encontrada'

export default async function DetalleAfectacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Suspense fallback={<EsqueletoCarga />}>
      <DetalleAfectacion id={id} />
    </Suspense>
  )
}
