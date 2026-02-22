"use client"

import { useState } from "react"
import { toast } from "sonner"

export default function CheckoutButton({
  clientSlug,
}: {
  clientSlug: string
}) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientSlug }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || "Something went wrong")
        setLoading(false)
      }
    } catch {
      toast.error("Failed to start checkout")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full rounded-xl bg-accent py-3.5 text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl disabled:opacity-50"
    >
      {loading ? "Redirecting to payment..." : "Pay $100 — Get Your Website"}
    </button>
  )
}
