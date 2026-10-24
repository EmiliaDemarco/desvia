import type { Metadata } from 'next'
import { GuiaDemo } from './_componentes/guia-demo'

export const metadata: Metadata = {
  title: 'desvIA · Guía de la demostración',
  description: 'Seis pasos guiados para recorrer desvIA: consulta ciudadana, gestión del operador, alertas, indicadores y análisis de cámara.',
}

export default function DemoPage() {
  return <GuiaDemo />
}
