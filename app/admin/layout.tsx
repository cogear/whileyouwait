import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-muted-bg">
      <nav className="border-b border-border bg-background px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-xl font-bold">
              While U Wait Admin
            </a>
            <a
              href="/"
              className="text-sm text-muted hover:text-foreground"
              target="_blank"
            >
              View Site
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{session.user?.email}</span>
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
            >
              <button
                type="submit"
                className="text-sm text-muted hover:text-foreground"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  )
}
