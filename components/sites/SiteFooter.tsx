export default function SiteFooter({ businessName }: { businessName: string }) {
  return (
    <footer
      className="px-6 py-8 text-center text-sm"
      style={{
        backgroundColor: "var(--site-primary)",
        color: "rgba(255,255,255,0.8)",
        fontFamily: "var(--site-font-body)",
      }}
    >
      <p>
        &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
      </p>
      <p className="mt-2 text-xs opacity-60">
        Powered by{" "}
        <a
          href="https://whileuwaitwebsite.com"
          className="underline hover:opacity-100"
        >
          While U Wait Website
        </a>
      </p>
    </footer>
  )
}
