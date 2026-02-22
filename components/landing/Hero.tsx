import { ArrowRight, Zap } from "lucide-react"

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

          {/* Decorative card mockup */}
          <div className="relative hidden lg:block">
            <div className="rounded-2xl border border-border bg-background p-6 shadow-2xl">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-danger" />
                <div className="h-3 w-3 rounded-full bg-warning" />
                <div className="h-3 w-3 rounded-full bg-success" />
              </div>
              <div className="space-y-3">
                <div className="h-8 w-3/4 rounded bg-accent-light" />
                <div className="h-4 w-full rounded bg-muted-bg" />
                <div className="h-4 w-5/6 rounded bg-muted-bg" />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="h-24 rounded-lg bg-accent-light" />
                  <div className="h-24 rounded-lg bg-accent-light" />
                </div>
                <div className="h-4 w-2/3 rounded bg-muted-bg" />
                <div className="h-10 w-1/3 rounded-lg bg-accent" />
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-background px-4 py-3 shadow-lg">
              <p className="text-sm font-semibold text-success">Site is Live!</p>
              <p className="text-xs text-muted">yourbiz.whileuwaitwebsite.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
