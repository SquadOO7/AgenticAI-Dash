import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TopNavigation } from "@/components/top-navigation"
import { LocationProvider } from "@/components/location-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CityPulse - Real-time City Incident Monitoring",
  description: "Monitor and report city incidents in real-time",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <LocationProvider>
          <div className="min-h-screen w-full bg-zinc-900">
            <TopNavigation />
            <main className="w-full h-full">{children}</main>
          </div>
        </LocationProvider>
      </body>
    </html>
  )
}
