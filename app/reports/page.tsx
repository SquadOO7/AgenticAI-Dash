"use client";

import { useState } from "react";
import { MapComponent } from "@/components/map-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, MapPin, Camera } from "lucide-react";

export default function Reports() {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleSubmitReport = () => {
    // TODO: API integration for submitting reports
    console.log("Report submitted:", {
      issueType,
      description,
      selectedLocation,
    });
    alert("Report submitted successfully!");
  };

  return (
    <div className='p-6 h-screen overflow-y-auto'>
      <div className='max-w-full mx-auto'>
        <h1 className='text-2xl font-bold text-white mb-6 shuttle-glow'>
          Report an Issue
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Report Form */}
          <Card className='bg-gray-900 border-gray-800 shuttle-glow'>
            <CardHeader>
              <CardTitle className='text-white'>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <Label htmlFor='issue-type' className='text-white'>
                  Issue Type
                </Label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger className='mt-2 bg-gray-800 border-gray-700 text-white focus:border-white transition-all duration-200'>
                    <SelectValue placeholder='Select issue type' />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-800 border-gray-700'>
                    <SelectItem value='traffic'>Traffic Incident</SelectItem>
                    <SelectItem value='road-damage'>Road Damage</SelectItem>
                    <SelectItem value='construction'>
                      Construction Issue
                    </SelectItem>
                    <SelectItem value='weather'>Weather Related</SelectItem>
                    <SelectItem value='emergency'>Emergency</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='description' className='text-white'>
                  Description
                </Label>
                <Textarea
                  id='description'
                  placeholder='Describe the issue in detail...'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white min-h-[120px] transition-all duration-200'
                />
              </div>

              <div>
                <Label className='text-white'>Location</Label>
                <div className='mt-2 p-3 bg-gray-800 rounded-md border border-gray-700'>
                  {selectedLocation ? (
                    <div className='flex items-center gap-2 text-white'>
                      <MapPin className='h-4 w-4 text-white' />
                      <span>
                        {selectedLocation.lat.toFixed(6)},{" "}
                        {selectedLocation.lng.toFixed(6)}
                      </span>
                    </div>
                  ) : (
                    <span className='text-gray-400'>
                      Click on the map to select location
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label className='text-white'>Add Media</Label>
                <div className='mt-2 border-2 border-dashed border-gray-700 rounded-lg p-6 text-center bg-gray-800 shuttle-glow'>
                  <Upload className='h-8 w-8 text-white mx-auto mb-2' />
                  <p className='text-gray-400 text-sm'>
                    Drag and drop files here, or click to select
                  </p>
                  <Button
                    variant='outline'
                    className='mt-2 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200'>
                    <Camera className='h-4 w-4 mr-2' />
                    Choose Files
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleSubmitReport}
                className='w-full bg-white text-black hover:bg-gray-200 transition-all duration-200 shuttle-glow'
                disabled={!issueType || !description || !selectedLocation}>
                Submit Report
              </Button>
            </CardContent>
          </Card>

          {/* Map for Location Selection */}
          <Card className='bg-gray-900 border-gray-800'>
            <CardHeader>
              <CardTitle className='text-white'>Select Location</CardTitle>
            </CardHeader>
            <CardContent>
              <MapComponent
                height='600px'
                onLocationSelect={handleLocationSelect}
              />
              <p className='text-gray-400 text-sm mt-2'>
                Click on the map to select the incident location
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
