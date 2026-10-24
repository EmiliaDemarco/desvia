import { Inter, Sora } from 'next/font/google'
import { Accesos } from './_portada/accesos'
import { Cabecera } from './_portada/cabecera'
import { ComoFunciona } from './_portada/como-funciona'
import { Heroe } from './_portada/heroe'
import { Pie } from './_portada/pie'
import { Probalo } from './_portada/probalo'
import './_portada/portada.css'

const titular = Sora({ subsets: ['latin'], variable: '--fuente-titular', weight: ['700', '800'] })
const cuerpo = Inter({ subsets: ['latin'], variable: '--fuente-cuerpo' })

export default function Home() {
  return (
    <main className={`portada ${titular.variable} ${cuerpo.variable} min-h-screen`}>
      <div className="bg-(--p-navy) pt-6 pb-4 sm:pt-8 lg:rounded-b-[3rem]">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Cabecera />
          <Heroe />
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl space-y-20 px-6 pt-20 pb-6 sm:pt-24 lg:space-y-28">
        <Accesos />
        <ComoFunciona />
        <Probalo />
        <Pie />
      </div>
    </main>
  )
}
