import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  let businessName = ""
  let siteUrl: string | null = null

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      const clientSlug = session.metadata?.clientSlug
      if (clientSlug) {
        const client = await prisma.client.findUnique({
          where: { slug: clientSlug },
        })
        if (client) {
          businessName = client.businessName
          siteUrl = client.siteUrl
        }
      }
    } catch {
      // Session retrieval failed, show generic message
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted-bg px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">&#127881;</div>

        <h1 className="text-3xl font-extrabold">Your Site is Live!</h1>

        <p className="mt-4 text-lg text-muted">
          {businessName
            ? `Thanks for choosing While U Wait Website! ${businessName} is all set.`
            : "Thanks for choosing While U Wait Website! Your site is all set."}
        </p>

        {siteUrl && (
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-xl bg-accent px-6 py-3.5 text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl"
          >
            Visit Your Website
          </a>
        )}

        <div className="mt-10 space-y-3 border-t border-border pt-8 text-sm text-muted">
          <p>Your first year of hosting is included.</p>
          <p>Annual renewal of $50/year starts after 12 months.</p>
          <p>
            Need changes? Email me at{" "}
            <a
              href="mailto:david@whileuwaitwebsite.com"
              className="text-accent hover:underline"
            >
              david@whileuwaitwebsite.com
            </a>
          </p>
        </div>

        <a
          href="/"
          className="mt-8 inline-block text-sm text-muted hover:text-foreground"
        >
          &larr; Back to While U Wait Website
        </a>
      </div>
    </div>
  )
}
