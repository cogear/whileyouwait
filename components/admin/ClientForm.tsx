"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient, updateClient } from "@/lib/actions/clients"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

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
  siteStatus: string
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function ClientForm({ client }: { client?: Client }) {
  const router = useRouter()
  const isEditing = !!client
  const [businessName, setBusinessName] = useState(client?.businessName || "")
  const [slug, setSlug] = useState(client?.slug || "")
  const [autoSlug, setAutoSlug] = useState(!isEditing)
  const [isPending, setIsPending] = useState(false)

  function handleBusinessNameChange(value: string) {
    setBusinessName(value)
    if (autoSlug) {
      setSlug(slugify(value))
    }
  }

  function handleSlugChange(value: string) {
    setSlug(value)
    setAutoSlug(false)
  }

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    const result = isEditing
      ? await updateClient(client!.slug, formData)
      : await createClient(formData)

    if ("error" in result) {
      toast.error(result.error)
      setIsPending(false)
      return
    }

    toast.success(isEditing ? "Client updated" : "Client created")
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

      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-xl font-bold">
          {isEditing ? "Edit Client" : "Add New Client"}
        </h2>

        <form action={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Business Name *
              </label>
              <input
                name="businessName"
                value={businessName}
                onChange={(e) => handleBusinessNameChange(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Slug</label>
              <input
                name="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="auto-generated-from-name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Client Name
              </label>
              <input
                name="clientName"
                defaultValue={client?.clientName || ""}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Client Email
              </label>
              <input
                name="clientEmail"
                type="email"
                defaultValue={client?.clientEmail || ""}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Client Phone
              </label>
              <input
                name="clientPhone"
                type="tel"
                defaultValue={client?.clientPhone || ""}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Site URL
              </label>
              <input
                name="siteUrl"
                type="url"
                defaultValue={client?.siteUrl || ""}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Custom Domain
              </label>
              <input
                name="customDomain"
                defaultValue={client?.customDomain || ""}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="www.example.com"
              />
            </div>

            {isEditing && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Site Status
                </label>
                <select
                  name="siteStatus"
                  defaultValue={client?.siteStatus || "building"}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  <option value="building">Building</option>
                  <option value="live">Live</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={client?.notes || ""}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="Any notes about this client..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Client"}
            </button>
            <a
              href="/admin"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted-bg"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
