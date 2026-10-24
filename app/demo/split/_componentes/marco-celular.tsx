export function MarcoCelular() {
  // 410 px con 10 px de bisel por lado dejan 390 px útiles: la app móvil ocupa todo el marco.
  return (
    <div className="min-h-0 w-[410px] max-w-full flex-1 overflow-hidden rounded-[2.5rem] border-[10px] border-[#111827] bg-[#ffffff] shadow-xl lg:max-h-[860px]">
      <iframe title="TR-Móvil con desvIA" src="/movil/desvia" className="h-full w-full border-0" />
    </div>
  )
}
