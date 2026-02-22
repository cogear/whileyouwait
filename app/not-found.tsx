import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-accent">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page Not Found</h1>
        <p className="mt-2 text-muted">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </a>
      </div>
    </div>
  )
}
