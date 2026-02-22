import { ImageIcon } from "lucide-react"

const examples = [
  { name: "Coming Soon", image: null, url: "#" },
  { name: "Coming Soon", image: null, url: "#" },
  { name: "Coming Soon", image: null, url: "#" },
]

export default function Examples() {
  return (
    <section className="bg-muted-bg py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Recent Projects
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Check out some of the websites I&apos;ve built for local businesses.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((example, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-shadow hover:shadow-lg"
            >
              {/* Screenshot area */}
              <div className="flex h-48 items-center justify-center bg-muted-bg">
                {example.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={example.image}
                    alt={example.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted">
                    <ImageIcon className="h-10 w-10" />
                    <span className="text-sm font-medium">Coming Soon</span>
                  </div>
                )}
              </div>

              {/* Card content */}
              <div className="p-5">
                <h3 className="font-bold text-lg">{example.name}</h3>
                {example.url !== "#" && (
                  <a
                    href={example.url}
                    className="mt-1 inline-block text-sm text-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Site
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
