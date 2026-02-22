export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 rounded bg-border" />
        <div className="h-10 w-28 rounded-lg bg-border" />
      </div>
      <div className="rounded-xl border border-border bg-background">
        <div className="space-y-4 p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-5 w-1/4 rounded bg-border" />
              <div className="h-5 w-1/6 rounded bg-border" />
              <div className="h-5 w-1/6 rounded bg-border" />
              <div className="h-5 w-1/6 rounded bg-border" />
              <div className="h-5 w-1/6 rounded bg-border" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
