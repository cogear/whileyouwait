type GalleryImage = {
  url: string
  altText: string | null
}

export default function SiteGallery({ images }: { images: GalleryImage[] }) {
  if (!images || images.length === 0) return null

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
          Gallery
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden"
              style={{ borderRadius: "var(--site-radius)" }}
            >
              <img
                src={img.url}
                alt={img.altText || `Gallery image ${i + 1}`}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
