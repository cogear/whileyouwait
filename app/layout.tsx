import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "While U Wait Website | Custom Websites Built On the Spot",
  description:
    "Get a professional, mobile-friendly website built while you wait — right at your booth, market, or event. Live in 15 minutes. $100 setup, hosting included.",
  keywords: ["website builder", "flea market", "small business website", "custom website"],
  openGraph: {
    title: "While U Wait Website",
    description: "Your website, built while you wait.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
