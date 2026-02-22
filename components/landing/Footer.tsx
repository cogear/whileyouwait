import { Mail, Instagram, Facebook, Twitter } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="While U Wait Website"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <div>
              <h3 className="text-xl font-extrabold">While U Wait Website</h3>
              <p className="mt-0.5 text-sm text-muted">
                Custom websites, built on the spot.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <a
              href="mailto:david@whileuwaitwebsite.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              <Mail className="h-4 w-4" />
              david@whileuwaitwebsite.com
            </a>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="rounded-lg border border-border p-2 text-muted transition-colors hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-lg border border-border p-2 text-muted transition-colors hover:text-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-lg border border-border p-2 text-muted transition-colors hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} While U Wait Website. All rights
          reserved.
        </div>
      </div>
    </footer>
  )
}
