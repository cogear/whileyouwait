type Props = {
  description: string
  logo?: { url: string; altText: string | null } | null
}

export default function SiteAbout({ description, logo }: Props) {
  return (
    <section className="px-6 py-16" style={{ paddingBlock: "var(--site-spacing)" }}>
      <div className="mx-auto max-w-4xl">
        <h2
          className="mb-8 text-3xl font-bold"
          style={{
            fontFamily: "var(--site-font-heading)",
            color: "var(--site-primary)",
          }}
        >
          About Us
        </h2>
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          {logo && (
            <img
              src={logo.url}
              alt={logo.altText || "Logo"}
              className="h-32 w-32 flex-shrink-0 object-contain"
              style={{ borderRadius: "var(--site-radius)" }}
            />
          )}
          <div
            className="whitespace-pre-line text-lg leading-relaxed"
            style={{
              fontFamily: "var(--site-font-body)",
              color: "#374151",
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </section>
  )
}
