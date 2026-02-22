"use client"

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

export type BusinessHours = {
  [day: string]: { open: string; close: string; closed: boolean }
}

const DEFAULT_HOURS: BusinessHours = Object.fromEntries(
  DAYS.map((d) => [
    d,
    {
      open: d === "Saturday" || d === "Sunday" ? "10:00" : "09:00",
      close: d === "Saturday" || d === "Sunday" ? "14:00" : "17:00",
      closed: d === "Sunday",
    },
  ])
)

export default function BusinessHoursEditor({
  value,
  onChange,
}: {
  value: BusinessHours | null
  onChange: (hours: BusinessHours) => void
}) {
  const hours = value || DEFAULT_HOURS

  function update(day: string, field: string, val: string | boolean) {
    onChange({ ...hours, [day]: { ...hours[day], [field]: val } })
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">Business Hours</label>
      <div className="space-y-2">
        {DAYS.map((day) => (
          <div key={day} className="flex items-center gap-3 text-sm">
            <span className="w-24 text-muted">{day.slice(0, 3)}</span>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={!hours[day]?.closed}
                onChange={(e) => update(day, "closed", !e.target.checked)}
                className="rounded"
              />
              <span className="text-xs text-muted">Open</span>
            </label>
            {!hours[day]?.closed && (
              <>
                <input
                  type="time"
                  value={hours[day]?.open || "09:00"}
                  onChange={(e) => update(day, "open", e.target.value)}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
                <span className="text-muted">–</span>
                <input
                  type="time"
                  value={hours[day]?.close || "17:00"}
                  onChange={(e) => update(day, "close", e.target.value)}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </>
            )}
            {hours[day]?.closed && (
              <span className="text-xs text-muted">Closed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
