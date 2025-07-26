"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface LocationContextType {
  location: { lat: number; lng: number } | null
  error: string | null
  loading: boolean
  requestLocation: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
        // Fallback to Bengaluru coordinates
        setLocation({ lat: 12.9716, lng: 77.5946 })
      },
    )
  }

  useEffect(() => {
    requestLocation()
  }, [])

  return (
    <LocationContext.Provider value={{ location, error, loading, requestLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
