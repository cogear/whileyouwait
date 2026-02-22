"use client"

import { Plus, Trash2 } from "lucide-react"

export type Service = {
  name: string
  description: string
  price?: string
}

export default function ServicesEditor({
  value,
  onChange,
}: {
  value: Service[]
  onChange: (services: Service[]) => void
}) {
  function update(index: number, field: keyof Service, val: string) {
    const updated = [...value]
    updated[index] = { ...updated[index], [field]: val }
    onChange(updated)
  }

  function add() {
    onChange([...value, { name: "", description: "" }])
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium">Services</label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent hover:bg-accent/20"
        >
          <Plus className="h-3 w-3" />
          Add Service
        </button>
      </div>
      <div className="space-y-3">
        {value.map((service, i) => (
          <div
            key={i}
            className="flex gap-2 rounded-lg border border-border p-3"
          >
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Service name"
                value={service.name}
                onChange={(e) => update(i, "name", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="Brief description"
                value={service.description}
                onChange={(e) => update(i, "description", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="Price (optional, e.g. $25)"
                value={service.price || ""}
                onChange={(e) => update(i, "price", e.target.value)}
                className="w-40 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="self-start p-1 text-muted hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {value.length === 0 && (
          <p className="py-4 text-center text-sm text-muted">
            No services yet. Click &quot;Add Service&quot; to add one.
          </p>
        )}
      </div>
    </div>
  )
}
