"use client"

import { useState } from "react"
import { MapComponent } from "@/components/map-component"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, AlertTriangle } from "lucide-react"

// Dummy incident data - Replace with API integration
const dummyIncidents = [
  {
    id: "1",
    lat: 12.9716,
    lng: 77.5946,
    type: "Traffic Accident",
    description: "Multi-vehicle collision on MG Road",
    severity: "high" as const,
    timestamp: "2 mins ago",
    location: "MG Road, Bengaluru",
  },
  {
    id: "2",
    lat: 12.9698,
    lng: 77.5986,
    type: "Road Closure",
    description: "Construction work blocking lane",
    severity: "medium" as const,
    timestamp: "15 mins ago",
    location: "Brigade Road, Bengaluru",
  },
  {
    id: "3",
    lat: 12.975,
    lng: 77.59,
    type: "Water Logging",
    description: "Heavy rainfall causing waterlogging",
    severity: "low" as const,
    timestamp: "1 hour ago",
    location: "Cubbon Park Area",
  },
]

export default function Dashboard() {
  const [selectedEventType, setSelectedEventType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [dateRange, setDateRange] = useState("today")

  return (
    <div className="flex h-screen">
      {/* Filters Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-gray-800 p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold text-white mb-6 shuttle-glow">Filters</h2>

        <div className="space-y-6">
          <div>
            <Label htmlFor="location" className="text-white">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Enter location..."
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white transition-all duration-200"
            />
          </div>

          <div>
            <Label className="text-white">Event Types</Label>
            <Select value={selectedEventType} onValueChange={setSelectedEventType}>
              <SelectTrigger className="mt-2 bg-gray-800 border-gray-700 text-white focus:border-white transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="traffic">Traffic Incidents</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="weather">Weather Related</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="mt-2 bg-gray-800 border-gray-700 text-white focus:border-white transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-white text-black hover:bg-gray-200 transition-all duration-200 shuttle-glow">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex h-full">
        {/* Map Area */}
        <div className="flex-1 p-6">
          <Card className="h-full bg-gray-900 border-gray-800 shuttle-glow">
            <CardHeader>
              <CardTitle className="text-white">Live Incident Map</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <MapComponent incidents={dummyIncidents} height="calc(100vh - 240px)" />
            </CardContent>
          </Card>
        </div>

        {/* Real-time Incident Feed */}
        <div className="w-96 p-6 pl-0">
          <Card className="h-full bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 shuttle-glow">
                <AlertTriangle className="h-5 w-5" />
                Real-time Incident Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto">
              {dummyIncidents.map((incident, index) => (
                <div
                  key={incident.id}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 hover:bg-gray-750"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant={
                        incident.severity === "high"
                          ? "destructive"
                          : incident.severity === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className={
                        incident.severity === "high"
                          ? "bg-red-900 text-red-300 border-red-700"
                          : incident.severity === "medium"
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-gray-600 text-gray-300 border-gray-500"
                      }
                    >
                      {incident.type}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {incident.timestamp}
                    </span>
                  </div>
                  <p className="text-white text-sm mb-2">{incident.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" />
                    {incident.location}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
