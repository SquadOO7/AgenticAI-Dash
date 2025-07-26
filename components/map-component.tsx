"use client";

import { useEffect, useRef } from "react";
// Assuming this path is correct for your project structure
import { useLocation } from "./location-provider";

// Import Leaflet CSS directly (preferred for Next.js 13+ App Router)
// If you are using pages router, you might put this in _app.tsx or a global css file
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  incidents?: Array<{
    id: string;
    lat: number;
    lng: number;
    type: string;
    description: string;
    severity: "low" | "medium" | "high";
  }>;
  height?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export function MapComponent({
  incidents = [],
  height = "400px",
  onLocationSelect,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // To store the Leaflet map instance
  const markersRef = useRef<any[]>([]); // To store Leaflet markers for incidents
  const { location } = useLocation(); // Get current location from context

  useEffect(() => {
    // Type guard: Ensures mapRef.current is not null and location is available
    // before attempting to initialize or update the map.
    if (!mapRef.current || !location) {
      console.log("Map not initialized: mapRef.current or location is null");
      return;
    }

    const initializeMap = async () => {
      // Dynamically import Leaflet to ensure it runs only on the client-side
      // and avoids issues with Server-Side Rendering (SSR).
      const L = (await import("leaflet")).default;

      // --- Fix for default marker icons in Leaflet with bundlers like Webpack/Vite/Next.js ---
      // Leaflet's default icon paths often don't work correctly when bundled.
      // This workaround overrides the default icon paths to use CDN URLs.
      delete (L.Icon.Default.prototype as any)._getIconUrl; // Remove existing method
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
      // -------------------------------------------------------------------------------------

      // Initialize map only if it hasn't been created yet
      if (!mapInstanceRef.current) {
        // L.map(element) expects an HTMLElement or its ID.
        // Because of the 'if (!mapRef.current)' check above, TypeScript knows
        // that mapRef.current is an HTMLDivElement at this point,
        // satisfying Leaflet's type requirements.
        mapInstanceRef.current = L.map(mapRef.current, {
          zoomControl: false // Disable default zoom control if you plan to add custom ones
        }).setView(
          [location.lat, location.lng],
          13 // Initial zoom level
        );

        // Add standard OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current);

        // Add user location marker with a custom blue dot icon
        const userIcon = L.divIcon({
          className: "user-location-marker", // Custom class for styling (optional)
          html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>',
          iconSize: [22, 22], // Size of the icon
          iconAnchor: [11, 11], // Point of the icon which will correspond to marker's location
        });

        L.marker([location.lat, location.lng], { icon: userIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(
            '<div style="color: black; font-weight: bold;">Your Location</div>'
          )
          .openPopup(); // Open popup initially

        // If onLocationSelect callback is provided, attach a click listener to the map
        if (onLocationSelect) {
          mapInstanceRef.current.on("click", (e: any) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
          });
        }

        // Add zoom controls
        L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);

      } else {
        // If map already exists, just update its view to the current location
        // This prevents re-initializing the map on every location change
        mapInstanceRef.current.setView([location.lat, location.lng], mapInstanceRef.current.getZoom());
      }


      // --- Incident Markers Handling ---
      // Clear all existing incident markers before adding new ones
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = []; // Reset the array of markers

      // Add incident markers based on the 'incidents' prop
      incidents.forEach((incident) => {
        const severityColors = {
          high: "#ef4444", // Red
          medium: "#f59e0b", // Orange
          low: "#10b981", // Green
        };

        // Create a custom HTML icon for incidents
        const incidentIcon = L.divIcon({
          className: "incident-marker", // Custom class for styling
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
          ">!</div>`, // Exclamation mark inside the circle
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        // Create and add the marker to the map
        const marker = L.marker([incident.lat, incident.lng], {
          icon: incidentIcon,
        })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
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

        markersRef.current.push(marker); // Keep a reference to the marker for cleanup
      });
    };

    initializeMap();

    // Cleanup function: This runs when the component unmounts or
    // when the dependencies (location, incidents, onLocationSelect) change.
    // It's crucial to clean up Leaflet map instances to prevent memory leaks.
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove(); // Destroys the map and clears all event listeners
        mapInstanceRef.current = null; // Reset the ref
      }
    };
  }, [location, incidents, onLocationSelect]); // Dependencies array

  return (
    <>
      {/*
        Leaflet CSS is typically best imported globally or via `import 'leaflet/dist/leaflet.css';`
        in Next.js 13+ App Router.
        However, if you must include it here, make sure it's loaded before the map renders.
        The direct import at the top of the file is generally preferred.
        The <link> tag below is redundant if you use the import statement above.
      */}
      {/*
      <link
        rel='stylesheet'
        href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        integrity='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
        crossOrigin=''
      />
      */}

      <div className='relative'>
        <div
          ref={mapRef} // This is where the map will be rendered
          style={{ height }} // Apply the height prop
          className='w-full rounded-lg border border-gray-700 z-10'
        />

        {/* Map controls overlay - provides a legend for markers */}
        <div className='absolute top-4 right-4 z-20 bg-gray-900 bg-opacity-90 rounded-lg p-2 text-white text-xs'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-3 h-3 bg-blue-500 rounded-full border border-white'></div>
            <span>Your Location</span>
          </div>
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

        {/* Loading indicator shown when location is not yet available */}
        {!location && (
          <div className='absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center z-30'>
            <div className='text-center text-gray-300'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2'></div>
              <div className='text-sm'>Loading map...</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}