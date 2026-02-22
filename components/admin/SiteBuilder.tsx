"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, Save, Sparkles, Loader2, Paintbrush, RefreshCw, Rocket, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import { getSiteContent, saveSiteContent, saveSiteDesign } from "@/lib/actions/site"
import { generateSiteContent, generateSiteDesign } from "@/lib/actions/generate"
import { deploySite, getDeployStatus } from "@/lib/actions/deploy"
import ImageUpload from "./ImageUpload"
import BusinessHoursEditor, { type BusinessHours } from "./BusinessHoursEditor"
import ServicesEditor, { type Service } from "./ServicesEditor"
import SocialLinksEditor, { type SocialLink } from "./SocialLinksEditor"
import ColorPicker from "./ColorPicker"

type Client = {
  id: number
  businessName: string
  slug: string
  notes: string | null
}

type SiteImage = {
  id: number
  s3Key: string
  url: string
  role: string
  altText: string | null
  sortOrder: number
}

const STYLE_PRESETS = [
  { value: "modern", label: "Modern", desc: "Clean sans-serif, rounded corners" },
  { value: "classic", label: "Classic", desc: "Serif headings, traditional layout" },
  { value: "bold", label: "Bold", desc: "Large type, high contrast" },
  { value: "minimal", label: "Minimal", desc: "Lots of white space, understated" },
]

export default function SiteBuilder({ client }: { client: Client }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatingDesign, setGeneratingDesign] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [siteContentId, setSiteContentId] = useState<number | null>(null)
  const [images, setImages] = useState<SiteImage[]>([])
  const [hasDesign, setHasDesign] = useState(false)
  const [deployStatus, setDeployStatus] = useState<{
    deployed: boolean
    url: string | null
    lastDeployedAt: Date | null
    hasUnpushedChanges: boolean
  } | null>(null)

  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")
  const [stylePreset, setStylePreset] = useState("modern")
  const [primaryColor, setPrimaryColor] = useState("#2563eb")
  const [secondaryColor, setSecondaryColor] = useState("#f97316")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  const [businessType, setBusinessType] = useState("")

  // Design preview
  const [previewHtml, setPreviewHtml] = useState("")
  const [previewCss, setPreviewCss] = useState("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const loadContent = useCallback(async () => {
    const content = await getSiteContent(client.id)
    if (content) {
      setSiteContentId(content.id)
      setTagline(content.tagline || "")
      setDescription(content.description || "")
      setStylePreset(content.stylePreset)
      setPrimaryColor(content.primaryColor)
      setSecondaryColor(content.secondaryColor)
      setPhone(content.phone || "")
      setEmail(content.email || "")
      setAddress(content.address || "")
      setBusinessHours((content.businessHours as BusinessHours) || null)
      setServices((content.services as Service[]) || [])
      setSocialLinks((content.socialLinks as SocialLink[]) || [])
      setImages(content.images)
      if (content.htmlContent && content.cssContent) {
        setHasDesign(true)
        setPreviewHtml(content.htmlContent)
        setPreviewCss(content.cssContent)
      }
    }
    const status = await getDeployStatus(client.id)
    setDeployStatus(status)
  }, [client.id])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  // Update iframe preview when design changes
  useEffect(() => {
    if (!iframeRef.current || !previewHtml) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return
    doc.open()
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${previewCss}</style>
</head>
<body>${previewHtml}</body>
</html>`)
    doc.close()
  }, [previewHtml, previewCss])

  async function handleSave() {
    setSaving(true)
    try {
      const result = await saveSiteContent(client.id, {
        tagline,
        description,
        stylePreset,
        primaryColor,
        secondaryColor,
        phone,
        email,
        address,
        businessHours,
        services,
        socialLinks,
      })
      if ("siteContentId" in result) {
        setSiteContentId(result.siteContentId)
      }
      toast.success("Site content saved")
      router.refresh()
    } catch {
      toast.error("Failed to save")
    }
    setSaving(false)
  }

  async function handleGenerate() {
    if (!businessType.trim()) {
      toast.error("Enter a business type first (e.g. 'barber shop', 'food truck')")
      return
    }
    setGenerating(true)
    try {
      const result = await generateSiteContent(
        client.businessName,
        businessType,
        client.notes || undefined
      )
      if (result.success) {
        setTagline(result.content.tagline)
        setDescription(result.content.description)
        setServices(result.content.services)
        toast.success("Content generated — review and edit before saving")
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Generation failed")
    }
    setGenerating(false)
  }

  async function handleGenerateDesign() {
    if (!businessType.trim()) {
      toast.error("Enter a business type above first")
      return
    }
    if (!siteContentId) {
      toast.error("Save your content first before generating a design")
      return
    }
    setGeneratingDesign(true)
    try {
      const heroImage = images.find((i) => i.role === "hero")
      const logo = images.find((i) => i.role === "logo")
      const galleryImages = images.filter((i) => i.role === "gallery")

      const result = await generateSiteDesign({
        businessName: client.businessName,
        businessType,
        tagline,
        description,
        services,
        phone,
        email,
        address,
        businessHours: businessHours as Record<string, { open: string; close: string; closed: boolean }> | null,
        socialLinks,
        primaryColor,
        secondaryColor,
        heroImageUrl: heroImage?.url || null,
        logoUrl: logo?.url || null,
        galleryImageUrls: galleryImages.map((i) => i.url),
      })

      if (result.success) {
        setPreviewHtml(result.html)
        setPreviewCss(result.css)

        // Save to database
        await saveSiteDesign(client.id, {
          htmlContent: result.html,
          cssContent: result.css,
        })

        setHasDesign(true)
        toast.success("Custom design generated and saved!")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Design generation failed")
    }
    setGeneratingDesign(false)
  }

  async function handleDeploy() {
    if (!hasDesign) {
      toast.error("Generate a design first before deploying")
      return
    }
    setDeploying(true)
    try {
      const result = await deploySite(client.id)
      if (result.success) {
        toast.success(`Site deployed to ${result.url}`)
        const status = await getDeployStatus(client.id)
        setDeployStatus(status)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Deployment failed")
    }
    setDeploying(false)
  }

  return (
    <div>
      <a
        href={`/admin?view=${client.slug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to client
      </a>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Build Site: {client.businessName}
          </h2>
          <p className="mt-1 font-mono text-sm text-muted">
            /sites/{client.slug}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/sites/${client.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted-bg"
          >
            <Eye className="h-4 w-4" />
            Preview
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* AI Generate Content */}
        <section className="rounded-xl border border-accent/20 bg-accent/5 p-6">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Content Generator
          </h3>
          <p className="mb-3 text-sm text-muted">
            Enter the business type and let AI draft your tagline, description,
            and services.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Business type (e.g. barber shop, food truck, nail salon)"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generating ? "Generating..." : "Generate Text"}
            </button>
          </div>
        </section>

        {/* Basics */}
        <section className="rounded-xl border border-border bg-background p-6">
          <h3 className="mb-4 font-semibold">Basics</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="A catchy one-liner for the hero section"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell visitors about this business..."
                rows={5}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {/* Style Preset */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Style Preset
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setStylePreset(preset.value)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      stylePreset === preset.value
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="font-medium">{preset.label}</div>
                    <div className="mt-0.5 text-xs text-muted">
                      {preset.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="flex flex-wrap gap-6">
              <ColorPicker
                label="Primary Color"
                value={primaryColor}
                onChange={setPrimaryColor}
              />
              <ColorPicker
                label="Secondary Color"
                value={secondaryColor}
                onChange={setSecondaryColor}
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="rounded-xl border border-border bg-background p-6">
          <h3 className="mb-4 font-semibold">Images</h3>
          <div className="space-y-6">
            <ImageUpload
              slug={client.slug}
              role="hero"
              siteContentId={siteContentId}
              images={images}
              label="Hero Image"
              onUpdate={loadContent}
            />
            <ImageUpload
              slug={client.slug}
              role="logo"
              siteContentId={siteContentId}
              images={images}
              label="Logo"
              onUpdate={loadContent}
            />
            <ImageUpload
              slug={client.slug}
              role="gallery"
              siteContentId={siteContentId}
              images={images}
              multiple
              label="Gallery Images"
              onUpdate={loadContent}
            />
          </div>
        </section>

        {/* Contact & Hours */}
        <section className="rounded-xl border border-border bg-background p-6">
          <h3 className="mb-4 font-semibold">Contact & Hours</h3>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@business.com"
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State ZIP"
                rows={2}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <BusinessHoursEditor
              value={businessHours}
              onChange={setBusinessHours}
            />
          </div>
        </section>

        {/* Services */}
        <section className="rounded-xl border border-border bg-background p-6">
          <ServicesEditor value={services} onChange={setServices} />
        </section>

        {/* Social Links */}
        <section className="rounded-xl border border-border bg-background p-6">
          <SocialLinksEditor value={socialLinks} onChange={setSocialLinks} />
        </section>

        {/* AI Design Generator */}
        <section className="rounded-xl border-2 border-dashed border-secondary/40 bg-secondary/5 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Paintbrush className="h-5 w-5 text-secondary" />
            AI Design Generator
          </h3>
          <p className="mb-4 text-sm text-muted">
            Save your content above first, then generate a fully custom website design.
            Claude will create unique HTML &amp; CSS with custom layout, typography, and colors.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateDesign}
              disabled={generatingDesign || !siteContentId}
              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90 disabled:opacity-50"
            >
              {generatingDesign ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : hasDesign ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <Paintbrush className="h-4 w-4" />
              )}
              {generatingDesign
                ? "Generating Design..."
                : hasDesign
                  ? "Regenerate Design"
                  : "Generate Design"}
            </button>
            {!siteContentId && (
              <span className="self-center text-xs text-muted">
                Save content first to enable design generation
              </span>
            )}
          </div>

          {/* Live Preview */}
          {previewHtml && (
            <div className="mt-6">
              <h4 className="mb-2 text-sm font-medium">Live Preview</h4>
              <div className="overflow-hidden rounded-lg border border-border bg-white">
                <iframe
                  ref={iframeRef}
                  title="Site design preview"
                  className="h-[600px] w-full border-0"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          )}
        </section>

        {/* Deploy & Publish */}
        {hasDesign && (
          <section className="rounded-xl border-2 border-green-500/30 bg-green-500/5 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Rocket className="h-5 w-5 text-green-600" />
              Deploy &amp; Publish
            </h3>

            {deployStatus?.deployed && (
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-green-600">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Live
                </span>
                {deployStatus.url && (
                  <a
                    href={deployStatus.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    {deployStatus.url} <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {deployStatus.lastDeployedAt && (
                  <span className="text-muted">
                    Last deployed{" "}
                    {new Date(deployStatus.lastDeployedAt).toLocaleString()}
                  </span>
                )}
                {deployStatus.hasUnpushedChanges && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-amber-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Content updated since last deploy
                  </span>
                )}
              </div>
            )}

            <p className="mb-4 text-sm text-muted">
              {deployStatus?.deployed
                ? "Push your latest design changes to the live site."
                : "Deploy this site to its own URL. Creates a GitHub repo and Vercel project automatically."}
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleDeploy}
                disabled={deploying}
                className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                {deploying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : deployStatus?.deployed ? (
                  <RefreshCw className="h-4 w-4" />
                ) : (
                  <Rocket className="h-4 w-4" />
                )}
                {deploying
                  ? "Deploying..."
                  : deployStatus?.deployed
                    ? "Redeploy"
                    : "Deploy to Vercel"}
              </button>
            </div>

            <p className="mt-3 text-xs text-muted">
              Preview always available at{" "}
              <a
                href={`/sites/${client.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                /sites/{client.slug}
              </a>
            </p>
          </section>
        )}

        {/* Bottom save */}
        <div className="flex justify-end gap-2">
          <a
            href={`/sites/${client.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted-bg"
          >
            <Eye className="h-4 w-4" />
            Preview Site
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Site Content"}
          </button>
        </div>
      </div>
    </div>
  )
}
