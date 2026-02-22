"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { deleteClient, updateSiteStatus } from "@/lib/actions/clients"
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Globe,
  Pencil,
  Trash2,
  CreditCard,
  Link2,
  Hammer,
} from "lucide-react"

type Client = {
  id: number
  businessName: string
  clientName: string | null
  clientEmail: string | null
  clientPhone: string | null
  slug: string
  siteUrl: string | null
  customDomain: string | null
  notes: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  paymentStatus: string
  siteStatus: string
  createdAt: Date
  updatedAt: Date
}

export default function ClientDetail({ client }: { client: Client }) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [generatingLink, setGeneratingLink] = useState(false)

  function copyCheckoutLink() {
    const url = `${window.location.origin}/checkout/${client.slug}`
    navigator.clipboard.writeText(url)
    toast.success("Checkout link copied to clipboard")
  }

  async function generateStripeLink() {
    setGeneratingLink(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientSlug: client.slug }),
      })
      const data = await res.json()
      if (data.url) {
        navigator.clipboard.writeText(data.url)
        toast.success("Stripe checkout link copied to clipboard")
      } else {
        toast.error(data.error || "Failed to generate link")
      }
    } catch {
      toast.error("Failed to generate Stripe link")
    }
    setGeneratingLink(false)
  }

  async function toggleSiteStatus() {
    const newStatus = client.siteStatus === "live" ? "suspended" : "live"
    await updateSiteStatus(client.slug, newStatus)
    toast.success(`Site marked as ${newStatus}`)
    router.refresh()
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    await deleteClient(client.slug)
    toast.success("Client deleted")
    router.push("/admin")
    router.refresh()
  }

  return (
    <div>
      <a
        href="/admin"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to clients
      </a>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{client.businessName}</h2>
            <p className="mt-1 font-mono text-sm text-muted">{client.slug}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={`/admin?build=${client.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              <Hammer className="h-4 w-4" />
              Build Site
            </a>
            <a
              href={`/admin?edit=${client.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted-bg"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </a>
            <button
              onClick={handleDelete}
              onBlur={() => setConfirmDelete(false)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                confirmDelete
                  ? "bg-danger text-white"
                  : "border border-border text-danger hover:bg-danger/5"
              }`}
            >
              <Trash2 className="h-4 w-4" />
              {confirmDelete ? "Confirm Delete" : "Delete"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Client info */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="mb-4 font-semibold">Client Information</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Contact Name</dt>
                <dd>{client.clientName || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Email</dt>
                <dd>
                  {client.clientEmail ? (
                    <a
                      href={`mailto:${client.clientEmail}`}
                      className="text-accent hover:underline"
                    >
                      {client.clientEmail}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Phone</dt>
                <dd>{client.clientPhone || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Site URL</dt>
                <dd>
                  {client.siteUrl ? (
                    <a
                      href={client.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:underline"
                    >
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Custom Domain</dt>
                <dd>{client.customDomain || "—"}</dd>
              </div>
              {client.notes && (
                <div className="border-t border-border pt-3">
                  <dt className="mb-1 text-muted">Notes</dt>
                  <dd className="whitespace-pre-wrap">{client.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Status & Stripe */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="mb-4 font-semibold">Status</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Payment</dt>
                  <dd>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.paymentStatus === "paid"
                          ? "bg-success/10 text-success"
                          : client.paymentStatus === "overdue"
                            ? "bg-danger/10 text-danger"
                            : "bg-muted-bg text-muted"
                      }`}
                    >
                      {client.paymentStatus}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Site Status</dt>
                  <dd>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.siteStatus === "live"
                          ? "bg-success/10 text-success"
                          : client.siteStatus === "suspended"
                            ? "bg-danger/10 text-danger"
                            : "bg-accent/10 text-accent"
                      }`}
                    >
                      {client.siteStatus}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Created</dt>
                  <dd>{new Date(client.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="mb-4 font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Stripe
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Customer ID</dt>
                  <dd className="font-mono text-xs">
                    {client.stripeCustomerId || "Not connected"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Subscription ID</dt>
                  <dd className="font-mono text-xs">
                    {client.stripeSubscriptionId || "Not connected"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-border bg-background p-6">
          <h3 className="mb-4 font-semibold">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyCheckoutLink}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted-bg"
            >
              <Copy className="h-4 w-4" />
              Copy Checkout Link
            </button>
            <button
              onClick={generateStripeLink}
              disabled={generatingLink}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted-bg disabled:opacity-50"
            >
              <Link2 className="h-4 w-4" />
              {generatingLink ? "Generating..." : "Generate Stripe Link"}
            </button>
            <button
              onClick={toggleSiteStatus}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                client.siteStatus === "live"
                  ? "border border-danger/20 text-danger hover:bg-danger/5"
                  : "border border-success/20 text-success hover:bg-success/5"
              }`}
            >
              <Globe className="h-4 w-4" />
              {client.siteStatus === "live" ? "Suspend Site" : "Mark as Live"}
            </button>
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted opacity-50"
              title="Coming soon"
            >
              Send Renewal Reminder (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
