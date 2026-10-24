import { FormularioAfectacion } from '../../../_componentes/formulario-afectacion'

export default async function EditarAfectacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <FormularioAfectacion id={id} />
}
