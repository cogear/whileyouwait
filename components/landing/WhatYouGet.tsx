import {
  Paintbrush,
  Smartphone,
  Globe,
  Link,
  Server,
  RefreshCw,
} from "lucide-react"

const features = [
  {
    icon: Paintbrush,
    title: "Custom Designed",
    description: "A unique single-page site designed specifically for your business — not a cookie-cutter template.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Looks great on phones, tablets, and desktops. Your customers can find you from anywhere.",
  },
  {
    icon: Globe,
    title: "Your Own Subdomain",
    description: "Get yourname.whileuwaitwebsite.com — a professional web address ready to share.",
  },
  {
    icon: Link,
    title: "Custom Domain Ready",
    description: "Want to use your own domain name? No problem — I'll help you connect it.",
  },
  {
    icon: Server,
    title: "Hosting Included",
    description: "First year of fast, reliable hosting is included in your setup fee. No hidden costs.",
  },
  {
    icon: RefreshCw,
    title: "$50/Year Renewal",
    description: "After your first year, keep your site live for just $50/year. Cancel anytime.",
  },
]

export default function WhatYouGet() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            What You Get
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Everything you need to get your business online — no fuss, no
            upsells.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-4 rounded-xl border border-border p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex-shrink-0">
                <div className="inline-flex rounded-lg bg-accent-light p-2.5">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="font-bold">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
