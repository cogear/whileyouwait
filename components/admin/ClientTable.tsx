"use client"

import { toast } from "sonner"
import { useState } from "react"
import { deleteClient } from "@/lib/actions/clients"
import { useRouter } from "next/navigation"
import { Copy, Eye, Pencil, Trash2 } from "lucide-react"

type Client = {
  id: number
  businessName: string
  slug: string
  siteUrl: string | null
  paymentStatus: string
  siteStatus: string
  createdAt: Date
}

const statusColors: Record<string, string> = {
  paid: "bg-success/10 text-success",
  unpaid: "bg-muted-bg text-muted",
  overdue: "bg-danger/10 text-danger",
  cancelled: "bg-warning/10 text-warning",
}

const siteStatusColors: Record<string, string> = {
  building: "bg-accent/10 text-accent",
  live: "bg-success/10 text-success",
  suspended: "bg-danger/10 text-danger",
}

export default function ClientTable({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  function copyCheckoutLink(slug: string) {
    const url = `${window.location.origin}/checkout/${slug}`
    navigator.clipboard.writeText(url)
    toast.success("Checkout link copied to clipboard")
  }

  async function handleDelete(slug: string) {
    if (deletingSlug !== slug) {
      setDeletingSlug(slug)
      return
    }
    const result = await deleteClient(slug)
    if (result.success) {
      toast.success("Client deleted")
      setDeletingSlug(null)
      router.refresh()
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-background">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-3 font-semibold">Business</th>
            <th className="px-4 py-3 font-semibold">Slug</th>
            <th className="px-4 py-3 font-semibold">Payment</th>
            <th className="px-4 py-3 font-semibold">Site</th>
            <th className="px-4 py-3 font-semibold">Created</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              className="border-b border-border last:border-0 hover:bg-muted-bg/50"
            >
              <td className="px-4 py-3 font-medium">{client.businessName}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted">
                {client.slug}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    statusColors[client.paymentStatus] || statusColors.unpaid
                  }`}
                >
                  {client.paymentStatus}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    siteStatusColors[client.siteStatus] ||
                    siteStatusColors.building
                  }`}
                >
                  {client.siteStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-muted">
                {new Date(client.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <a
                    href={`/admin?view=${client.slug}`}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                  <a
                    href={`/admin?edit=${client.slug}`}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => copyCheckoutLink(client.slug)}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
                    title="Copy checkout link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.slug)}
                    className={`rounded-lg p-1.5 transition-colors ${
                      deletingSlug === client.slug
                        ? "bg-danger/10 text-danger"
                        : "text-muted hover:bg-muted-bg hover:text-foreground"
                    }`}
                    title={
                      deletingSlug === client.slug
                        ? "Click again to confirm"
                        : "Delete"
                    }
                    onBlur={() => setDeletingSlug(null)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
