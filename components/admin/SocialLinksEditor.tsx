"use client"

import { Plus, Trash2 } from "lucide-react"

const PLATFORMS = [
  "Facebook",
  "Instagram",
  "Yelp",
  "Google Business",
  "TikTok",
  "X / Twitter",
  "YouTube",
  "LinkedIn",
  "Pinterest",
]

export type SocialLink = {
  platform: string
  url: string
}

export default function SocialLinksEditor({
  value,
  onChange,
}: {
  value: SocialLink[]
  onChange: (links: SocialLink[]) => void
}) {
  function update(index: number, field: keyof SocialLink, val: string) {
    const updated = [...value]
    updated[index] = { ...updated[index], [field]: val }
    onChange(updated)
  }

  function add() {
    const usedPlatforms = value.map((l) => l.platform)
    const nextPlatform =
      PLATFORMS.find((p) => !usedPlatforms.includes(p)) || PLATFORMS[0]
    onChange([...value, { platform: nextPlatform, url: "" }])
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium">Social Links</label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent hover:bg-accent/20"
        >
          <Plus className="h-3 w-3" />
          Add Link
        </button>
      </div>
      <div className="space-y-2">
        {value.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={link.platform}
              onChange={(e) => update(i, "platform", e.target.value)}
              className="w-40 rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              type="url"
              placeholder="https://..."
              value={link.url}
              onChange={(e) => update(i, "url", e.target.value)}
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1 text-muted hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {value.length === 0 && (
          <p className="py-3 text-center text-sm text-muted">
            No social links yet.
          </p>
        )}
      </div>
    </div>
  )
}
