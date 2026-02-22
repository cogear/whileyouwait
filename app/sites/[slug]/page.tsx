import { notFound } from "next/navigation"
import { getSiteContentBySlug } from "@/lib/actions/site"
import SiteHero from "@/components/sites/SiteHero"
import SiteAbout from "@/components/sites/SiteAbout"
import SiteServices from "@/components/sites/SiteServices"
import SiteGallery from "@/components/sites/SiteGallery"
import SiteHours from "@/components/sites/SiteHours"
import SiteContact from "@/components/sites/SiteContact"
import SiteFooter from "@/components/sites/SiteFooter"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ slug: string }>
}

const STYLE_PRESETS: Record<string, Record<string, string>> = {
  modern: {
    "--site-font-heading": "system-ui, -apple-system, sans-serif",
    "--site-font-body": "system-ui, -apple-system, sans-serif",
    "--site-radius": "12px",
    "--site-spacing": "5rem",
  },
  classic: {
    "--site-font-heading": "Georgia, 'Times New Roman', serif",
    "--site-font-body": "Georgia, 'Times New Roman', serif",
    "--site-radius": "4px",
    "--site-spacing": "4rem",
  },
  bold: {
    "--site-font-heading": "'Impact', 'Arial Black', sans-serif",
    "--site-font-body": "system-ui, -apple-system, sans-serif",
    "--site-radius": "0px",
    "--site-spacing": "5rem",
  },
  minimal: {
    "--site-font-heading": "'Courier New', monospace",
    "--site-font-body": "system-ui, -apple-system, sans-serif",
    "--site-radius": "2px",
    "--site-spacing": "6rem",
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const site = await getSiteContentBySlug(slug)
  if (!site) return { title: "Not Found" }

  return {
    title: site.businessName,
    description: site.tagline || site.description?.slice(0, 160) || undefined,
    openGraph: {
      title: site.businessName,
      description: site.tagline || undefined,
    },
  }
}

export default async function ClientSitePage({ params }: Props) {
  const { slug } = await params
  const site = await getSiteContentBySlug(slug)
  if (!site) notFound()

  const presetVars = STYLE_PRESETS[site.stylePreset] || STYLE_PRESETS.modern
  const cssVars = {
    ...presetVars,
    "--site-primary": site.primaryColor,
    "--site-secondary": site.secondaryColor,
    "--site-primary-light": `${site.primaryColor}10`,
  } as React.CSSProperties

  const heroImage = site.images.find((i) => i.role === "hero") || null
  const logo = site.images.find((i) => i.role === "logo") || null
  const galleryImages = site.images.filter((i) => i.role === "gallery")
  const services = (site.services as { name: string; description: string; price?: string }[]) || []
  const businessHours = site.businessHours as Record<string, { open: string; close: string; closed: boolean }> | null
  const socialLinks = (site.socialLinks as { platform: string; url: string }[]) || []

  return (
    <div style={cssVars} className="min-h-screen bg-white">
      <SiteHero
        businessName={site.businessName}
        tagline={site.tagline}
        heroImage={heroImage}
      />

      {site.description && (
        <SiteAbout description={site.description} logo={logo} />
      )}

      <SiteServices services={services} />

      <SiteGallery images={galleryImages} />

      {businessHours && <SiteHours hours={businessHours} />}

      <SiteContact
        phone={site.phone}
        email={site.email}
        address={site.address}
        socialLinks={socialLinks}
      />

      <SiteFooter businessName={site.businessName} />
    </div>
  )
}
