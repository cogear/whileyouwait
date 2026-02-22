import { Check, Sparkles } from "lucide-react"

const included = [
  "Custom single-page website",
  "Mobile-friendly design",
  "Your own subdomain",
  "Custom domain support",
  "First year of hosting included",
  "Ongoing updates by request",
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Simple, Honest Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            One price. No surprises. No monthly fees for the first year.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-2">
          {/* Main pricing card */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-accent bg-background p-8 shadow-xl shadow-accent/10">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />

            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Website Package
            </p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">$100</span>
              <span className="text-muted">one-time</span>
            </div>

            <p className="mt-2 text-muted">
              Then <span className="font-semibold text-foreground">$50/year</span> for
              hosting renewal (starting Year 2).
            </p>

            <ul className="mt-8 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="mailto:david@whileuwaitwebsite.com?subject=I want a website!"
              className="mt-8 block w-full rounded-xl bg-accent py-3.5 text-center text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl"
            >
              Get Started
            </a>
          </div>

          {/* Coming soon card */}
          <div className="flex flex-col justify-center rounded-2xl border border-dashed border-border bg-muted-bg p-8">
            <div className="inline-flex self-start rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
              <Sparkles className="mr-1.5 h-4 w-4" />
              Coming Soon
            </div>

            <h3 className="mt-4 text-2xl font-bold">Online Store Package</h3>

            <p className="mt-3 leading-relaxed text-muted">
              Need to sell products online? An e-commerce tier is in the works
              with inventory management, payment processing, and shipping
              integration.
            </p>

            <a
              href="mailto:david@whileuwaitwebsite.com?subject=Interested in Store Package"
              className="mt-6 inline-flex self-start rounded-xl border border-border px-5 py-2.5 font-semibold transition-colors hover:bg-background"
            >
              Get Notified
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
