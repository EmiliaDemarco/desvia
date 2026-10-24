import type { Metadata } from 'next'
import { VistaDividida } from './_componentes/vista-dividida'

export const metadata: Metadata = {
  title: 'desvIA · Demostración en vivo (panel + celular)',
  description: 'Panel municipal y experiencia ciudadana lado a lado, con los mismos datos simulados.',
}

export default function DemoSplitPage() {
  return <VistaDividida />
}
