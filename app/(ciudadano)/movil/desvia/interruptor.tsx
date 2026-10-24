'use client'

export function Interruptor({ activo, onCambio, etiqueta }: { activo: boolean; onCambio: (valor: boolean) => void; etiqueta: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      onClick={() => onCambio(!activo)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${activo ? 'bg-[#1551A1]' : 'bg-slate-300'}`}
    >
      <span className={`absolute left-0.5 top-0.5 size-6 rounded-full bg-white shadow transition-transform ${activo ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}
