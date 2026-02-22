"use client"

export default function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (color: string) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-10 cursor-pointer rounded-md border border-border"
      />
      <div>
        <label className="block text-sm font-medium">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs outline-none focus:border-accent"
        />
      </div>
    </div>
  )
}
