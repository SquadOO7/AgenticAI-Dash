"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useLocation } from "./location-provider";

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

// Dynamically import the actual map component to avoid SSR issues
const DynamicMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div
      className='w-full bg-gray-800 rounded-lg flex items-center justify-center'
      style={{ height: "400px" }}>
      <div className='text-center text-gray-300'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2'></div>
        <div className='text-sm'>Loading map...</div>
      </div>
    </div>
  ),
});

export function MapComponent({
  incidents = [],
  height = "400px",
  onLocationSelect,
}: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { location } = useLocation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className='w-full bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700'
        style={{ height }}>
        <div className='text-center text-gray-300'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2'></div>
          <div className='text-sm'>Initializing map...</div>
        </div>
      </div>
    );
  }

  return (
    <DynamicMap
      incidents={incidents}
      height={height}
      onLocationSelect={onLocationSelect}
      location={location}
    />
  );
}
