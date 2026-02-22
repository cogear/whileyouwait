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
      model: "claude-opus-4-6",
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

export interface SiteDesignInput {
  businessName: string
  businessType: string
  tagline?: string
  description?: string
  services?: { name: string; description: string; price?: string }[]
  phone?: string
  email?: string
  address?: string
  businessHours?: Record<string, { open: string; close: string; closed: boolean }> | null
  socialLinks?: { platform: string; url: string }[]
  primaryColor?: string
  secondaryColor?: string
  heroImageUrl?: string | null
  logoUrl?: string | null
  galleryImageUrls?: string[]
}

export async function generateSiteDesign(
  input: SiteDesignInput
): Promise<{ success: true; html: string; css: string } | { success: false; error: string }> {
  await requireAuth()

  try {
    const anthropic = getAnthropic()

    const servicesBlock = input.services?.length
      ? input.services.map((s) => `- ${s.name}${s.price ? ` ($${s.price})` : ""}: ${s.description}`).join("\n")
      : "No services listed yet."

    const hoursBlock = input.businessHours
      ? Object.entries(input.businessHours)
          .map(([day, h]) => `- ${day}: ${h.closed ? "Closed" : `${h.open} – ${h.close}`}`)
          .join("\n")
      : ""

    const socialBlock = input.socialLinks?.length
      ? input.socialLinks.map((l) => `- ${l.platform}: ${l.url}`).join("\n")
      : ""

    const imageInstructions = []
    if (input.heroImageUrl) {
      imageInstructions.push(`Hero image URL (use as a large banner/background): ${input.heroImageUrl}`)
    }
    if (input.logoUrl) {
      imageInstructions.push(`Logo URL (use in the header/navigation): ${input.logoUrl}`)
    }
    if (input.galleryImageUrls?.length) {
      imageInstructions.push(`Gallery images:\n${input.galleryImageUrls.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}`)
    }

    const prompt = `You are an expert web designer. Create a completely unique, beautiful, single-page website for this business. Every site you create should look different — vary the layout structure, typography pairings, spacing, color usage, and visual style.

BUSINESS DETAILS:
- Name: ${input.businessName}
- Type: ${input.businessType}
- Tagline: ${input.tagline || "None provided"}
- Description: ${input.description || "None provided"}

SERVICES:
${servicesBlock}

CONTACT INFO:
${input.phone ? `- Phone: ${input.phone}` : ""}
${input.email ? `- Email: ${input.email}` : ""}
${input.address ? `- Address: ${input.address}` : ""}

${hoursBlock ? `BUSINESS HOURS:\n${hoursBlock}` : ""}

${socialBlock ? `SOCIAL LINKS:\n${socialBlock}` : ""}

COLOR PALETTE:
- Primary: ${input.primaryColor || "#2563eb"}
- Secondary: ${input.secondaryColor || "#f97316"}
Use these as a starting point but feel free to derive complementary shades, tints, and accent colors.

${imageInstructions.length ? `IMAGES:\n${imageInstructions.join("\n\n")}` : "No images uploaded — use solid color gradients and creative CSS for visual interest."}

REQUIREMENTS:
1. Output exactly TWO blocks: a <style> block and the HTML body content. No <html>, <head>, <body>, or <script> tags.
2. Use Google Fonts — include the <link> tag(s) at the very top of your HTML output for the font(s) you choose.
3. Make the design fully responsive (mobile-first, looks great 320px to 1920px).
4. Create a unique layout — don't just stack sections vertically in the same order every time. Be creative with grids, asymmetric layouts, overlapping elements, split sections, cards, or other design patterns appropriate for this business type.
5. Include ALL provided content: services, hours, contact info, social links.
6. If hero/gallery images are provided, use them with proper img tags and alt text. Use object-fit: cover for hero images.
7. If NO hero image is provided, create an eye-catching gradient or pattern-based hero.
8. End with a footer that includes: "Powered by <a href='https://whileuwait.website'>While U Wait Website</a>"
9. No JavaScript. No <script> tags. Pure HTML + CSS only.
10. Use semantic HTML (nav, main, section, footer, etc.)

OUTPUT FORMAT — respond with ONLY this, no explanation:

<style>
...all CSS here...
</style>

...all HTML body content here (including Google Font <link> tags at the top)...`

    const message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 16000,
      messages: [{ role: "user", content: prompt }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""

    // Parse out the <style> block and the HTML content
    const styleMatch = text.match(/<style>([\s\S]*?)<\/style>/)
    const css = styleMatch ? styleMatch[1].trim() : ""
    const html = text.replace(/<style>[\s\S]*?<\/style>/, "").trim()

    if (!css && !html) {
      return { success: false, error: "AI returned empty design. Try again." }
    }

    return { success: true, html, css }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to generate design"
    return { success: false, error: msg }
  }
}
