"use client";

import { useEffect, useRef } from "react";

interface LeafletMapProps {
  incidents: Array<{
    id: string;
    lat: number;
    lng: number;
    type: string;
    description: string;
    severity: "low" | "medium" | "high";
  }>;
  height: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  location: { lat: number; lng: number } | null;
}

export default function LeafletMap({
  incidents,
  height,
  onLocationSelect,
  location,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Use default location (Bengaluru) if no location is provided
    const defaultLocation = { lat: 12.9716, lng: 77.5946 };
    const mapCenter = location || defaultLocation;

    // Dynamically import Leaflet to avoid SSR issues
    const initializeMap = async () => {
      try {
        const L = (await import("leaflet")).default;

        // Fix for default markers in Leaflet with Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Initialize map if not already created
        if (!mapInstanceRef.current && mapRef.current) {
          console.log("Initializing map with location:", mapCenter);
          mapInstanceRef.current = L.map(mapRef.current).setView(
            [mapCenter.lat, mapCenter.lng],
            13
          );

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(mapInstanceRef.current);

          // Add user location marker only if we have actual user location
          if (location) {
            const userIcon = L.divIcon({
              className: "user-location-marker",
              html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>',
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            });

            L.marker([location.lat, location.lng], { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup(
                '<div style="color: black; font-weight: bold;">Your Location</div>'
              );
          }

          // Handle location selection
          if (onLocationSelect) {
            mapInstanceRef.current.on("click", (e: any) => {
              onLocationSelect(e.latlng.lat, e.latlng.lng);
            });
          }

          console.log("Map initialized successfully");
        }

        // Clear existing incident markers
        if (mapInstanceRef.current) {
          markersRef.current.forEach((marker) => {
            mapInstanceRef.current.removeLayer(marker);
          });
          markersRef.current = [];

          console.log("Adding incidents to map:", incidents.length);

          // Add incident markers
          incidents.forEach((incident) => {
            const severityColors = {
              high: "#ef4444",
              medium: "#f59e0b",
              low: "#10b981",
            };

            const incidentIcon = L.divIcon({
              className: "incident-marker",
              html: `<div style="
                background: ${severityColors[incident.severity]}; 
                width: 20px; 
                height: 20px; 
                border-radius: 50%; 
                border: 2px solid white; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: white;
                font-weight: bold;
              ">!</div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });

            const marker = L.marker([incident.lat, incident.lng], {
              icon: incidentIcon,
            }).addTo(mapInstanceRef.current).bindPopup(`
                <div style="color: black; min-width: 200px;">
                  <div style="font-weight: bold; margin-bottom: 8px; color: ${
                    severityColors[incident.severity]
                  };">
                    ${incident.type}
                  </div>
                  <div style="margin-bottom: 8px; font-size: 14px;">
                    ${incident.description}
                  </div>
                  <div style="font-size: 12px; color: #666;">
                    Severity: <span style="color: ${
                      severityColors[incident.severity]
                    }; font-weight: bold;">
                      ${incident.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              `);

            markersRef.current.push(marker);
          });

          console.log("Added", markersRef.current.length, "incident markers");
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        console.log("Cleaning up map");
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [location, incidents, onLocationSelect]);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel='stylesheet'
        href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        integrity='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
        crossOrigin=''
      />

      <div className='relative w-full h-full'>
        <div
          ref={mapRef}
          style={{ height: "100%", width: "100%" }}
          className='rounded-lg border border-gray-700 z-10'
        />

        {/* Map controls overlay */}
        <div className='absolute top-4 right-4 z-20 bg-gray-900 bg-opacity-90 rounded-lg p-2 text-white text-xs'>
          {location && (
            <div className='flex items-center gap-2 mb-1'>
              <div className='w-3 h-3 bg-blue-500 rounded-full border border-white'></div>
              <span>Your Location</span>
            </div>
          )}
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-3 h-3 bg-red-500 rounded-full border border-white'></div>
            <span>High Priority</span>
          </div>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-3 h-3 bg-yellow-500 rounded-full border border-white'></div>
            <span>Medium Priority</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-green-500 rounded-full border border-white'></div>
            <span>Low Priority</span>
          </div>
        </div>

        {/* Location status indicator */}
        {!location && (
          <div className='absolute bottom-4 left-4 z-20 bg-yellow-900 bg-opacity-90 rounded-lg p-2 text-yellow-200 text-xs'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-yellow-400 rounded-full'></div>
              <span>Using default location (Bengaluru)</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
