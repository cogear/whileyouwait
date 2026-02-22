import DOMPurify from "isomorphic-dompurify"

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ADD_TAGS: ["link", "style"],
    ADD_ATTR: ["target", "rel", "href", "crossorigin"],
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
  })
}

export function sanitizeCss(dirty: string): string {
  // Strip JS-in-CSS vectors: expression(), url(javascript:), @import with JS
  return dirty
    .replace(/expression\s*\(/gi, "/* blocked */")
    .replace(/url\s*\(\s*['"]?\s*javascript:/gi, "url(/* blocked */")
    .replace(/@import\s+url\s*\(\s*['"]?\s*javascript:/gi, "/* blocked */")
    .replace(/-moz-binding\s*:/gi, "/* blocked */:")
    .replace(/behavior\s*:/gi, "/* blocked */:")
}
