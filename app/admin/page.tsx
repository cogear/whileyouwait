import { getClients, getClient } from "@/lib/actions/clients"
import ClientTable from "@/components/admin/ClientTable"
import ClientForm from "@/components/admin/ClientForm"
import ClientDetail from "@/components/admin/ClientDetail"

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; edit?: string; view?: string }>
}) {
  const params = await searchParams
  const clients = await getClients()

  if (params.action === "add") {
    return <ClientForm />
  }

  if (params.edit) {
    const client = await getClient(params.edit)
    if (client) return <ClientForm client={client} />
  }

  if (params.view) {
    const client = await getClient(params.view)
    if (client) return <ClientDetail client={client} />
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Clients{" "}
          <span className="text-lg font-normal text-muted">
            ({clients.length})
          </span>
        </h2>
        <a
          href="/admin?action=add"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          + Add Client
        </a>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-lg font-medium text-muted">No clients yet</p>
          <p className="mt-1 text-sm text-muted">
            Add your first client to get started.
          </p>
        </div>
      ) : (
        <ClientTable clients={clients} />
      )}
    </div>
  )
}
