"use client";

import { useState, useEffect } from "react";
import { MapComponent } from "@/components/map-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, AlertTriangle, User, Navigation } from "lucide-react";
import { useAuthContext } from "@/components/auth-provider";
import { useLocation } from "@/components/location-provider";
import { LocationPermissionModal } from "@/components/location-permission-modal";

// Dummy incidents data - using static timestamps to avoid hydration issues
const dummyIncidents = [
  {
    id: "1",
    lat: 12.9716,
    lng: 77.5946,
    type: "Traffic Accident",
    description: "Multi-vehicle collision on MG Road",
    severity: "high" as const,
    timestamp: new Date("2024-01-15T10:30:00Z"), // Static timestamp
    location: "MG Road, Bengaluru",
    status: "active" as const,
    timeAgo: "2 mins ago", // Pre-calculated relative time
  },
  {
    id: "2",
    lat: 12.9698,
    lng: 77.5986,
    type: "Road Closure",
    description: "Construction work blocking lane",
    severity: "medium" as const,
    timestamp: new Date("2024-01-15T10:15:00Z"),
    location: "Brigade Road, Bengaluru",
    status: "active" as const,
    timeAgo: "15 mins ago",
  },
  {
    id: "3",
    lat: 12.975,
    lng: 77.59,
    type: "Water Logging",
    description: "Heavy rainfall causing waterlogging",
    severity: "low" as const,
    timestamp: new Date("2024-01-15T09:30:00Z"),
    location: "Cubbon Park Area",
    status: "active" as const,
    timeAgo: "1 hour ago",
  },
  {
    id: "4",
    lat: 12.965,
    lng: 77.6,
    type: "Emergency",
    description: "Medical emergency reported",
    severity: "high" as const,
    timestamp: new Date("2024-01-15T10:00:00Z"),
    location: "Koramangala",
    status: "active" as const,
    timeAgo: "30 mins ago",
  },
  {
    id: "5",
    lat: 12.98,
    lng: 77.59,
    type: "Traffic",
    description: "Signal malfunction causing delays",
    severity: "medium" as const,
    timestamp: new Date("2024-01-15T09:45:00Z"),
    location: "Indiranagar",
    status: "active" as const,
    timeAgo: "45 mins ago",
  },
];

export default function Dashboard() {
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [dateRange, setDateRange] = useState("today");
  const [showLocationModal, setShowLocationModal] = useState(false);

  const { user } = useAuthContext();
  const { location, hasPermission, error, requestLocation } = useLocation();

  // Show location permission modal when component mounts if no location is set
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!location && hasPermission === null) {
        setShowLocationModal(true);
      }
    }, 1000); // Small delay to let the UI settle

    return () => clearTimeout(timer);
  }, [location, hasPermission]);

  // Filter incidents based on selected filters
  const filteredIncidents = dummyIncidents.filter((incident) => {
    if (
      selectedEventType !== "all" &&
      !incident.type.toLowerCase().includes(selectedEventType)
    ) {
      return false;
    }
    if (
      selectedLocation &&
      !incident.location.toLowerCase().includes(selectedLocation.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Transform incidents for MapComponent (only the fields it needs)
  const mapIncidents = filteredIncidents.map((incident) => ({
    id: incident.id,
    lat: incident.lat,
    lng: incident.lng,
    type: incident.type,
    description: incident.description,
    severity: incident.severity,
  }));

  return (
    <>
      <div className='flex h-full'>
        {/* Filters Sidebar */}
        <div className='w-80 bg-gray-900 border-r border-gray-800 p-6 overflow-y-auto'>
          <div className='flex items-center gap-3 mb-6'>
            <h2 className='text-lg font-semibold text-white shuttle-glow'>
              Filters
            </h2>
            {user && (
              <div className='flex items-center gap-2 text-sm text-gray-400'>
                <User className='h-4 w-4' />
                <span>Welcome, {user.name.split(" ")[0]}</span>
              </div>
            )}
          </div>

          {/* Location Status */}
          <div className='mb-6 p-3 bg-gray-800 rounded-lg border border-gray-700'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-white text-sm font-medium'>
                Location Status
              </span>
              {hasPermission === true && (
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              )}
              {hasPermission === false && (
                <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
              )}
            </div>
            {location ? (
              <div className='text-gray-400 text-xs'>
                {hasPermission
                  ? "Using your current location"
                  : "Using default location (Bengaluru)"}
              </div>
            ) : (
              <div className='text-gray-400 text-xs'>
                Location not available
              </div>
            )}
            {error && <div className='text-red-400 text-xs mt-1'>{error}</div>}
            {!hasPermission && (
              <Button
                onClick={() => setShowLocationModal(true)}
                size='sm'
                className='mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs'>
                <Navigation className='h-3 w-3 mr-1' />
                Enable Location
              </Button>
            )}
          </div>

          <div className='space-y-6'>
            <div>
              <Label htmlFor='location' className='text-white'>
                Location
              </Label>
              <Input
                id='location'
                placeholder='Enter location...'
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className='mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white transition-all duration-200'
              />
            </div>

            <div>
              <Label className='text-white'>Event Types</Label>
              <Select
                value={selectedEventType}
                onValueChange={setSelectedEventType}>
                <SelectTrigger className='mt-2 bg-gray-800 border-gray-700 text-white focus:border-white transition-all duration-200'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-gray-800 border-gray-700'>
                  <SelectItem value='all'>All Events</SelectItem>
                  <SelectItem value='traffic'>Traffic Incidents</SelectItem>
                  <SelectItem value='construction'>Construction</SelectItem>
                  <SelectItem value='weather'>Weather Related</SelectItem>
                  <SelectItem value='emergency'>Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className='text-white'>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className='mt-2 bg-gray-800 border-gray-700 text-white focus:border-white transition-all duration-200'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-gray-800 border-gray-700'>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className='w-full bg-white text-black hover:bg-gray-200 transition-all duration-200 shuttle-glow'>
              Apply Filters
            </Button>

            {/* User Info Card */}
            {user && (
              <div className='mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700'>
                <div className='flex items-center gap-3 mb-2'>
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt='Profile'
                    className='w-8 h-8 rounded-full'
                  />
                  <div>
                    <p className='text-white text-sm font-medium'>
                      {user.name}
                    </p>
                    <p className='text-gray-400 text-xs'>{user.email}</p>
                  </div>
                </div>
                <p className='text-gray-300 text-xs'>
                  You can now report incidents and manage alerts
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 flex h-full'>
          {/* Map Area */}
          <div className='flex-1 p-6'>
            <Card className='h-full bg-gray-900 border-gray-800 shuttle-glow'>
              <CardHeader>
                <CardTitle className='text-white'>
                  Live Incident Map ({mapIncidents.length} incidents)
                </CardTitle>
              </CardHeader>
              <CardContent className='h-full'>
                <div className='h-[calc(100%-60px)]'>
                  <MapComponent incidents={mapIncidents} height='100%' />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Incident Feed */}
          <div className='w-96 p-6 pl-0'>
            <Card className='h-full bg-gray-900 border-gray-800'>
              <CardHeader>
                <CardTitle className='text-white flex items-center gap-2 shuttle-glow'>
                  <AlertTriangle className='h-5 w-5' />
                  Real-time Incident Feed ({filteredIncidents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 overflow-y-auto max-h-[calc(100%-80px)]'>
                {filteredIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className='p-4 bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 hover:bg-gray-750'>
                    <div className='flex items-start justify-between mb-2'>
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
                        }>
                        {incident.type}
                      </Badge>
                      <span className='text-xs text-gray-400 flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {incident.timeAgo}
                      </span>
                    </div>
                    <p className='text-white text-sm mb-2'>
                      {incident.description}
                    </p>
                    <div className='flex items-center gap-1 text-xs text-gray-400'>
                      <MapPin className='h-3 w-3' />
                      {incident.location}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </>
  );
}
