"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { deleteS3Object } from "@/lib/s3"
import { revalidatePath } from "next/cache"

async function requireAuth() {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")
  return session
}

export async function getSiteContent(clientId: number) {
  await requireAuth()
  return prisma.siteContent.findUnique({
    where: { clientId },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  })
}

export async function getSiteContentBySlug(slug: string) {
  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      siteContent: {
        include: { images: { orderBy: { sortOrder: "asc" } } },
      },
    },
  })

  if (!client || !client.siteContent) return null
  if (client.siteStatus === "suspended") return null

  return {
    businessName: client.businessName,
    slug: client.slug,
    ...client.siteContent,
  }
}

export async function saveSiteDesign(
  clientId: number,
  data: { htmlContent: string; cssContent: string }
) {
  await requireAuth()

  await prisma.siteContent.update({
    where: { clientId },
    data: {
      htmlContent: data.htmlContent,
      cssContent: data.cssContent,
    },
  })

  const client = await prisma.client.findUnique({ where: { id: clientId }, select: { slug: true } })
  if (client) revalidatePath(`/sites/${client.slug}`)
  revalidatePath("/admin")
  return { success: true }
}

export async function saveSiteContent(
  clientId: number,
  data: {
    tagline?: string
    description?: string
    stylePreset?: string
    primaryColor?: string
    secondaryColor?: string
    phone?: string
    email?: string
    address?: string
    businessHours?: unknown
    services?: unknown
    socialLinks?: unknown
  }
) {
  await requireAuth()

  const result = await prisma.siteContent.upsert({
    where: { clientId },
    create: {
      clientId,
      tagline: data.tagline || null,
      description: data.description || null,
      stylePreset: data.stylePreset || "modern",
      primaryColor: data.primaryColor || "#2563eb",
      secondaryColor: data.secondaryColor || "#f97316",
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      businessHours: data.businessHours as never ?? undefined,
      services: data.services as never ?? undefined,
      socialLinks: data.socialLinks as never ?? undefined,
    },
    update: {
      tagline: data.tagline || null,
      description: data.description || null,
      stylePreset: data.stylePreset || "modern",
      primaryColor: data.primaryColor || "#2563eb",
      secondaryColor: data.secondaryColor || "#f97316",
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      businessHours: data.businessHours as never ?? undefined,
      services: data.services as never ?? undefined,
      socialLinks: data.socialLinks as never ?? undefined,
    },
  })

  revalidatePath("/admin")
  revalidatePath(`/sites/${clientId}`)
  return { success: true, siteContentId: result.id }
}

export async function addSiteImage(data: {
  siteContentId: number
  s3Key: string
  url: string
  role: string
  altText?: string
}) {
  await requireAuth()

  const maxSort = await prisma.siteImage.findFirst({
    where: { siteContentId: data.siteContentId, role: data.role },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  })

  await prisma.siteImage.create({
    data: {
      siteContentId: data.siteContentId,
      s3Key: data.s3Key,
      url: data.url,
      role: data.role,
      altText: data.altText || null,
      sortOrder: (maxSort?.sortOrder ?? -1) + 1,
    },
  })

  revalidatePath("/admin")
  return { success: true }
}

export async function deleteSiteImage(imageId: number) {
  await requireAuth()

  const image = await prisma.siteImage.findUnique({ where: { id: imageId } })
  if (!image) return { error: "Image not found" }

  await deleteS3Object(image.s3Key)
  await prisma.siteImage.delete({ where: { id: imageId } })

  revalidatePath("/admin")
  return { success: true }
}

export async function reorderImages(imageIds: number[]) {
  await requireAuth()

  await Promise.all(
    imageIds.map((id, index) =>
      prisma.siteImage.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  )

  revalidatePath("/admin")
  return { success: true }
}
