"use server"

import { auth } from "@/lib/auth"
import { getAnthropic } from "@/lib/anthropic"

async function requireAuth() {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")
  return session
}

export interface GeneratedContent {
  tagline: string
  description: string
  services: { name: string; description: string; price?: string }[]
}

export async function generateSiteContent(
  businessName: string,
  businessType: string,
  notes?: string
): Promise<{ success: true; content: GeneratedContent } | { success: false; error: string }> {
  await requireAuth()

  try {
    const anthropic = getAnthropic()

    const prompt = `You are helping create website content for a small local business. Generate content for:

Business Name: ${businessName}
Business Type: ${businessType}
${notes ? `Additional Notes: ${notes}` : ""}

Return a JSON object with exactly this structure (no markdown, no code fences, just valid JSON):
{
  "tagline": "A catchy tagline for the business (under 100 characters)",
  "description": "A compelling 2-3 paragraph description of the business. Write it in a warm, professional tone. Mention the business by name. Focus on what makes them special and why customers should choose them.",
  "services": [
    { "name": "Service Name", "description": "Brief description of the service" }
  ]
}

Generate 5-8 relevant services based on the business type. Do not include prices — the owner will add those.`

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""
    const content = JSON.parse(text) as GeneratedContent

    return { success: true, content }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to generate content"
    return { success: false, error: msg }
  }
}
