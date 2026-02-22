"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ensureRepo, pushFile, repoFullName, repoName } from "@/lib/github"
import { ensureVercelProject } from "@/lib/vercel"
import { revalidatePath } from "next/cache"

async function requireAuth() {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")
  return session
}

function extractLinkTags(html: string): { links: string[]; body: string } {
  const linkRegex = /<link\b[^>]*>/gi
  const links: string[] = []
  const body = html.replace(linkRegex, (match) => {
    links.push(match)
    return ""
  }).trim()
  return { links, body }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function buildIndexHtml(params: {
  businessName: string
  tagline: string | null
  description: string | null
  htmlContent: string
  cssContent: string
}): string {
  const { links, body } = extractLinkTags(params.htmlContent)
  const metaDescription = params.tagline || params.description?.slice(0, 160) || ""

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(params.businessName)}</title>
  <meta name="description" content="${escapeHtml(metaDescription)}">
  <meta property="og:title" content="${escapeHtml(params.businessName)}">
  <meta property="og:description" content="${escapeHtml(metaDescription)}">
  <meta property="og:type" content="website">
${links.map((l) => `  ${l}`).join("\n")}
  <style>
${params.cssContent}
  </style>
</head>
<body>
${body}
</body>
</html>`
}

export async function deploySite(
  clientId: number
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  await requireAuth()

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { siteContent: true },
    })

    if (!client) return { success: false, error: "Client not found" }
    if (!client.siteContent?.htmlContent || !client.siteContent?.cssContent) {
      return { success: false, error: "Generate a design first before deploying" }
    }

    const slug = client.slug
    const projectName = repoName(slug)
    const fullRepo = repoFullName(slug)

    const indexHtml = buildIndexHtml({
      businessName: client.businessName,
      tagline: client.siteContent.tagline,
      description: client.siteContent.description,
      htmlContent: client.siteContent.htmlContent,
      cssContent: client.siteContent.cssContent,
    })

    // Create repo if needed
    const { created } = await ensureRepo(slug, `Website for ${client.businessName}`)

    // Small delay after repo creation so Vercel can discover it
    if (created) {
      await new Promise((r) => setTimeout(r, 2000))
    }

    // Push index.html
    await pushFile(
      slug,
      "index.html",
      indexHtml,
      client.githubRepo ? "Update site content" : "Initial site deploy"
    )

    // Create Vercel project if needed
    const { projectId, url } = await ensureVercelProject(projectName, fullRepo)

    // Update client record
    await prisma.client.update({
      where: { id: clientId },
      data: {
        githubRepo: fullRepo,
        vercelProjectId: projectId,
        siteUrl: url,
        siteStatus: "live",
        lastDeployedAt: new Date(),
      },
    })

    revalidatePath("/admin")
    return { success: true, url }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Deployment failed"
    console.error("Deploy error:", e)
    return { success: false, error: msg }
  }
}

export async function getDeployStatus(clientId: number): Promise<{
  deployed: boolean
  url: string | null
  lastDeployedAt: Date | null
  hasUnpushedChanges: boolean
}> {
  await requireAuth()

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { siteContent: { select: { updatedAt: true } } },
  })

  if (!client) {
    return { deployed: false, url: null, lastDeployedAt: null, hasUnpushedChanges: false }
  }

  const deployed = !!client.lastDeployedAt
  const hasUnpushedChanges = deployed && client.siteContent
    ? client.siteContent.updatedAt > client.lastDeployedAt!
    : false

  return {
    deployed,
    url: client.siteUrl,
    lastDeployedAt: client.lastDeployedAt,
    hasUnpushedChanges,
  }
}
