type Props = {
  businessName: string
  tagline?: string | null
  heroImage?: { url: string; altText: string | null } | null
}

export default function SiteHero({ businessName, tagline, heroImage }: Props) {
  return (
    <section
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden"
      style={{
        background: heroImage
          ? undefined
          : "linear-gradient(135deg, var(--site-primary), var(--site-secondary))",
      }}
    >
      {heroImage && (
        <>
          <img
            src={heroImage.url}
            alt={heroImage.altText || businessName}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}
      <div className="relative z-10 px-6 text-center text-white">
        <h1
          className="text-4xl font-bold sm:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--site-font-heading)" }}
        >
          {businessName}
        </h1>
        {tagline && (
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90 sm:text-xl">
            {tagline}
          </p>
        )}
      </div>
    </section>
  )
}
