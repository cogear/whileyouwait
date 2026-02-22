import { ArrowRight, Zap } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-secondary/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-light px-4 py-1.5 text-sm font-medium text-accent">
              <Zap className="h-4 w-4" />
              Live in 15 minutes
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your Website,{" "}
              <span className="text-accent">Built While You Wait.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              I come to you at the flea market, farmers market, or local event.
              I snap some photos, get your details, and build you a professional
              website — all before you pack up for the day.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30"
              >
                Get Your Site — $100
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3.5 text-lg font-semibold transition-colors hover:bg-muted-bg"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-success" />
                No contracts
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-success" />
                Hosting included
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-success" />
                Mobile friendly
              </span>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/logo.png"
              alt="While U Wait Website logo"
              width={500}
              height={502}
              priority
              className="w-full max-w-[400px] lg:max-w-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
