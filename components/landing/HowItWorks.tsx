import { MapPin, Camera, Globe } from "lucide-react"

const steps = [
  {
    icon: MapPin,
    title: "Meet Me at the Market",
    description:
      "I visit your booth at the flea market, farmers market, or local event — or you can swing by mine.",
    step: "01",
  },
  {
    icon: Camera,
    title: "Share Your Story",
    description:
      "I snap some photos, grab your business details, and learn what makes you unique. That's all I need.",
    step: "02",
  },
  {
    icon: Globe,
    title: "Walk Away with a Live Site",
    description:
      "Your custom, mobile-friendly website goes live before you leave. It's really that fast.",
    step: "03",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted-bg py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Three simple steps to your new website. No tech skills needed.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-border bg-background p-8 transition-shadow hover:shadow-lg"
            >
              <span className="absolute -top-4 left-6 rounded-full bg-accent px-3 py-1 text-sm font-bold text-white">
                {step.step}
              </span>
              <div className="mb-4 inline-flex rounded-xl bg-accent-light p-3">
                <step.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
              <p className="text-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
