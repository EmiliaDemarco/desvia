export const CLASE_BOTON =
  'inline-flex min-h-10 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'

export const CLASE_BOTON_PRIMARIO =
  'inline-flex min-h-10 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

export const CAMARA_POR_DEFECTO = {
  latitud: -32.9555,
  longitud: -60.6513,
  direccion: 'Av. Pellegrini y Bv. Oroño',
}

export type CamaraDemo = typeof CAMARA_POR_DEFECTO
