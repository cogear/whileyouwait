"use client"

import { useActionState, useEffect } from "react"
import { loginAction } from "@/lib/actions/auth"
import { toast } from "sonner"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted-bg px-6">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-background p-8 shadow-lg">
          <h1 className="text-2xl font-extrabold">Admin Login</h1>
          <p className="mt-1 text-sm text-muted">
            While U Wait Website Dashboard
          </p>

          <form action={formAction} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          <a href="/" className="hover:text-foreground">
            &larr; Back to site
          </a>
        </p>
      </div>
    </div>
  )
}
