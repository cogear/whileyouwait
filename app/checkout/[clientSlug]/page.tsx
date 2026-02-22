import { getClientBySlug } from "@/lib/actions/clients"
import { notFound } from "next/navigation"
import CheckoutButton from "./CheckoutButton"

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientSlug: string }>
  searchParams: Promise<{ cancelled?: string }>
}) {
  const { clientSlug } = await params
  const { cancelled } = await searchParams

  const client = await getClientBySlug(clientSlug)
  if (!client) notFound()

  if (client.paymentStatus === "paid") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted-bg px-6">
        <div className="max-w-md text-center">
          <div className="mb-4 text-5xl">&#9989;</div>
          <h1 className="text-2xl font-bold">Payment Already Received</h1>
          <p className="mt-3 text-muted">
            Thanks! Your site for{" "}
            <span className="font-semibold text-foreground">
              {client.businessName}
            </span>{" "}
            is all set.
          </p>
          {client.siteUrl && (
            <a
              href={client.siteUrl}
              className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-hover"
            >
              Visit Your Website
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted-bg px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-background p-8 shadow-lg">
          <h1 className="text-2xl font-bold">{client.businessName}</h1>
          {client.siteUrl && (
            <p className="mt-2 text-sm text-muted">
              Preview:{" "}
              <a
                href={client.siteUrl}
                className="text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {client.siteUrl}
              </a>
            </p>
          )}

          <div className="mt-6 border-t border-border pt-6">
            <h2 className="font-semibold">Your Website Package</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Custom website setup</span>
                <span className="font-medium">$100.00</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>First year hosting</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Annual renewal (starts Year 2)</span>
                <span>$50/year</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
              <span>Due today</span>
              <span>$100.00</span>
            </div>
          </div>

          {cancelled && (
            <p className="mt-4 rounded-lg bg-danger/5 px-4 py-3 text-sm text-danger">
              Payment was cancelled. You can try again below.
            </p>
          )}

          <div className="mt-6">
            <CheckoutButton clientSlug={clientSlug} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  )
}
