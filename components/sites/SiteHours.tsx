type BusinessHours = {
  [day: string]: { open: string; close: string; closed: boolean }
}

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const ampm = h >= 12 ? "PM" : "AM"
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`
}

export default function SiteHours({ hours }: { hours: BusinessHours }) {
  if (!hours) return null

  return (
    <section
      className="px-6 py-16"
      style={{
        paddingBlock: "var(--site-spacing)",
        backgroundColor: "var(--site-primary-light)",
      }}
    >
      <div className="mx-auto max-w-md">
        <h2
          className="mb-8 text-center text-3xl font-bold"
          style={{
            fontFamily: "var(--site-font-heading)",
            color: "var(--site-primary)",
          }}
        >
          Hours
        </h2>
        <div className="space-y-2">
          {DAY_ORDER.map((day) => {
            const h = hours[day]
            if (!h) return null
            return (
              <div
                key={day}
                className="flex justify-between text-sm"
                style={{ fontFamily: "var(--site-font-body)" }}
              >
                <span className="font-medium">{day}</span>
                <span style={{ color: h.closed ? "#9ca3af" : "#374151" }}>
                  {h.closed
                    ? "Closed"
                    : `${formatTime(h.open)} – ${formatTime(h.close)}`}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
