"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

async function requireAuth() {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")
  return session
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function getClients() {
  await requireAuth()
  return prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getClient(slug: string) {
  await requireAuth()
  return prisma.client.findUnique({ where: { slug } })
}

export async function getClientBySlug(slug: string) {
  return prisma.client.findUnique({
    where: { slug },
    select: {
      businessName: true,
      slug: true,
      siteUrl: true,
      paymentStatus: true,
    },
  })
}

export async function createClient(formData: FormData) {
  await requireAuth()

  const businessName = formData.get("businessName") as string
  if (!businessName) return { error: "Business name is required" }

  const slug = (formData.get("slug") as string) || generateSlug(businessName)

  const existing = await prisma.client.findUnique({ where: { slug } })
  if (existing) return { error: "A client with this slug already exists" }

  await prisma.client.create({
    data: {
      businessName,
      clientName: (formData.get("clientName") as string) || null,
      clientEmail: (formData.get("clientEmail") as string) || null,
      clientPhone: (formData.get("clientPhone") as string) || null,
      slug,
      siteUrl: (formData.get("siteUrl") as string) || null,
      customDomain: (formData.get("customDomain") as string) || null,
      notes: (formData.get("notes") as string) || null,
    },
  })

  revalidatePath("/admin")
  return { success: true }
}

export async function updateClient(slug: string, formData: FormData) {
  await requireAuth()

  const newSlug = (formData.get("slug") as string) || slug

  if (newSlug !== slug) {
    const existing = await prisma.client.findUnique({ where: { slug: newSlug } })
    if (existing) return { error: "A client with this slug already exists" }
  }

  await prisma.client.update({
    where: { slug },
    data: {
      businessName: formData.get("businessName") as string,
      clientName: (formData.get("clientName") as string) || null,
      clientEmail: (formData.get("clientEmail") as string) || null,
      clientPhone: (formData.get("clientPhone") as string) || null,
      slug: newSlug,
      siteUrl: (formData.get("siteUrl") as string) || null,
      customDomain: (formData.get("customDomain") as string) || null,
      notes: (formData.get("notes") as string) || null,
      siteStatus: (formData.get("siteStatus") as string) || "building",
    },
  })

  revalidatePath("/admin")
  return { success: true }
}

export async function deleteClient(slug: string) {
  await requireAuth()
  await prisma.client.delete({ where: { slug } })
  revalidatePath("/admin")
  return { success: true }
}

export async function updateSiteStatus(slug: string, status: string) {
  await requireAuth()
  await prisma.client.update({
    where: { slug },
    data: { siteStatus: status },
  })
  revalidatePath("/admin")
  return { success: true }
}
