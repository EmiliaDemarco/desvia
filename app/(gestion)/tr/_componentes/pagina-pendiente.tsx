export function PaginaPendiente({ titulo }: { titulo: string }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 p-4 lg:p-8">
      <h1 className="text-balance text-2xl font-bold">{titulo}</h1>
      <p className="text-pretty text-sm text-muted-foreground">Esta sección se incorpora en una próxima fase de la demostración.</p>
    </div>
  )
}
