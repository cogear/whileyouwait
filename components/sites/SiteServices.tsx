type Service = {
  name: string
  description: string
  price?: string
}

export default function SiteServices({ services }: { services: Service[] }) {
  if (!services || services.length === 0) return null

  return (
    <section
      className="px-6 py-16"
      style={{
        paddingBlock: "var(--site-spacing)",
        backgroundColor: "var(--site-primary-light)",
      }}
    >
      <div className="mx-auto max-w-4xl">
        <h2
          className="mb-8 text-3xl font-bold"
          style={{
            fontFamily: "var(--site-font-heading)",
            color: "var(--site-primary)",
          }}
        >
          Our Services
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white p-6 shadow-sm"
              style={{ borderRadius: "var(--site-radius)" }}
            >
              <div className="flex items-start justify-between">
                <h3
                  className="font-semibold text-lg"
                  style={{ fontFamily: "var(--site-font-heading)" }}
                >
                  {service.name}
                </h3>
                {service.price && (
                  <span
                    className="ml-2 flex-shrink-0 font-semibold"
                    style={{ color: "var(--site-secondary)" }}
                  >
                    {service.price}
                  </span>
                )}
              </div>
              {service.description && (
                <p
                  className="mt-2 text-sm"
                  style={{
                    fontFamily: "var(--site-font-body)",
                    color: "#6b7280",
                  }}
                >
                  {service.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
