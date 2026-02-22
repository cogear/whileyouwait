"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { addSiteImage, deleteSiteImage } from "@/lib/actions/site"

type SiteImage = {
  id: number
  s3Key: string
  url: string
  role: string
  altText: string | null
  sortOrder: number
}

export default function ImageUpload({
  slug,
  role,
  siteContentId,
  images,
  multiple = false,
  label,
  onUpdate,
}: {
  slug: string
  role: string
  siteContentId: number | null
  images: SiteImage[]
  multiple?: boolean
  label: string
  onUpdate: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0 || !siteContentId) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            role,
            contentType: file.type,
            filename: file.name,
          }),
        })
        const { uploadUrl, s3Key, publicUrl } = await res.json()

        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        })

        await addSiteImage({
          siteContentId,
          s3Key,
          url: publicUrl,
          role,
          altText: file.name.replace(/\.[^.]+$/, ""),
        })
      }
      toast.success("Image uploaded")
      onUpdate()
    } catch {
      toast.error("Upload failed")
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ""
  }

  async function handleDelete(imageId: number) {
    await deleteSiteImage(imageId)
    toast.success("Image removed")
    onUpdate()
  }

  const roleImages = images.filter((i) => i.role === role)

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-3">
        {roleImages.map((img) => (
          <div
            key={img.id}
            className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border"
          >
            <img
              src={img.url}
              alt={img.altText || ""}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleDelete(img.id)}
              className="absolute right-1 top-1 rounded-full bg-danger p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {(multiple || roleImages.length === 0) && (
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted transition-colors hover:border-accent hover:text-accent">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="mt-1 text-xs">Upload</span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleUpload}
              className="hidden"
              disabled={uploading || !siteContentId}
            />
          </label>
        )}
      </div>
      {!siteContentId && (
        <p className="mt-1 text-xs text-muted">
          Save site content first to enable uploads
        </p>
      )}
    </div>
  )
}
