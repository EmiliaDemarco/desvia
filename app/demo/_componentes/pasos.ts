export type RolPaso = 'Ciudadano' | 'Operador'

export interface PasoDemo {
  id: string
  rol: RolPaso
  titulo: string
  queHacer: string
  href: string
}

export const PASOS: PasoDemo[] = [
  {
    id: 'consulta',
    rol: 'Ciudadano',
    titulo: 'El ciudadano consulta y filtra el mapa',
    queHacer: 'Abrí el mapa de desvIA, filtrá por tipo o impacto y tocá un marcador para ver el detalle de la afectación.',
    href: '/movil/desvia',
  },
  {
    id: 'publica',
    rol: 'Operador',
    titulo: 'El operador carga y publica una obra',
    queHacer: 'Ingresá como Operador Demo si te lo pide, completá título, tipo, ubicación en el mapa e inicio, elegí estado Publicada y guardá.',
    href: '/tr/afectaciones/nueva',
  },
  {
    id: 'alerta',
    rol: 'Ciudadano',
    titulo: 'Juan recibe la alerta anticipada',
    queHacer: 'En el mapa tocá "Simular recorrido de Juan". Si la obra queda cerca de su ruta, aparece el aviso con "Ver en el mapa". Mirá también la campana.',
    href: '/movil/desvia',
  },
  {
    id: 'resuelve',
    rol: 'Operador',
    titulo: 'El operador modifica o resuelve y deja de alertar',
    queHacer: 'Abrí la lista de afectaciones y elegí Resolver (o Editar) en la obra que cargaste. Volvé al celular: ya no figura como activa ni genera avisos nuevos.',
    href: '/tr/afectaciones',
  },
  {
    id: 'indicadores',
    rol: 'Operador',
    titulo: 'Los indicadores reflejan los cambios',
    queHacer: 'Mirá las tarjetas y los gráficos del dashboard: activas, programadas y alertas generadas cambian con lo que hiciste.',
    href: '/tr',
  },
  {
    id: 'camara',
    rol: 'Operador',
    titulo: 'La cámara detecta congestión y el operador la publica',
    queHacer: 'En el laboratorio marcá la zona de cola (o usá la de ejemplo) y esperá a que el nivel sea congestionado durante 30 segundos. Después aprobá la sugerencia en Sugerencias IA.',
    href: '/tr/laboratorio',
  },
]
