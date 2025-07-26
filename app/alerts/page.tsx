"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, MapPin, Trash2, Edit } from "lucide-react";

// Dummy alert subscriptions data
const dummySubscriptions = [
  {
    id: "1",
    location: "MG Road, Bengaluru",
    eventTypes: ["Traffic", "Emergency"],
    frequency: "Immediate",
    status: "Active",
  },
  {
    id: "2",
    location: "Whitefield, Bengaluru",
    eventTypes: ["Construction", "Road Closure"],
    frequency: "Daily Digest",
    status: "Active",
  },
  {
    id: "3",
    location: "Electronic City",
    eventTypes: ["Weather", "Traffic"],
    frequency: "Weekly Summary",
    status: "Paused",
  },
];

export default function ManageAlerts() {
  const [newAlertLocation, setNewAlertLocation] = useState("");
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("");
  const [subscriptions, setSubscriptions] = useState(dummySubscriptions);

  const handleCreateSubscription = () => {
    const newSubscription = {
      id: Date.now().toString(),
      location: newAlertLocation,
      eventTypes: selectedEventTypes,
      frequency,
      status: "Active",
    };

    setSubscriptions([...subscriptions, newSubscription]);
    setNewAlertLocation("");
    setSelectedEventTypes([]);
    setFrequency("");
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  return (
    <div className='p-6 h-screen overflow-y-auto'>
      <div className='max-w-full mx-auto'>
        <h1 className='text-2xl font-bold text-white mb-6 shuttle-glow'>
          Manage Alerts
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Create New Subscription */}
          <div className='space-y-6'>
            <Card className='bg-gray-900 border-gray-800 shuttle-glow'>
              <CardHeader>
                <CardTitle className='text-white flex items-center gap-2'>
                  <Bell className='h-5 w-5' />
                  Create New Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='alert-location' className='text-white'>
                    Select Location
                  </Label>
                  <Input
                    id='alert-location'
                    placeholder='Enter location or area...'
                    value={newAlertLocation}
                    onChange={(e) => setNewAlertLocation(e.target.value)}
                    className='mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white transition-all duration-200'
                  />
                </div>

                <div>
                  <Label className='text-white'>Event Types</Label>
                  <div className='mt-2 space-y-2'>
                    {[
                      "Traffic",
                      "Emergency",
                      "Construction",
                      "Weather",
                      "Road Closure",
                    ].map((type) => (
                      <div key={type} className='flex items-center space-x-2'>
                        <Switch
                          id={type}
                          checked={selectedEventTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedEventTypes([
                                ...selectedEventTypes,
                                type,
                              ]);
                            } else {
                              setSelectedEventTypes(
                                selectedEventTypes.filter((t) => t !== type)
                              );
                            }
                          }}
                          className='data-[state=checked]:bg-white'
                        />
                        <Label htmlFor={type} className='text-white'>
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className='text-white'>Notification Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className='mt-2 bg-gray-800 border-gray-700 text-white focus:border-white transition-all duration-200'>
                      <SelectValue placeholder='Select frequency' />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-800 border-gray-700'>
                      <SelectItem value='immediate'>Immediate</SelectItem>
                      <SelectItem value='hourly'>Hourly Digest</SelectItem>
                      <SelectItem value='daily'>Daily Digest</SelectItem>
                      <SelectItem value='weekly'>Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleCreateSubscription}
                  className='w-full bg-white text-black hover:bg-gray-200 transition-all duration-200 shuttle-glow'
                  disabled={
                    !newAlertLocation ||
                    selectedEventTypes.length === 0 ||
                    !frequency
                  }>
                  Create Subscription
                </Button>
              </CardContent>
            </Card>

            {/* Map for Location Selection */}
            <Card className='bg-gray-900 border-gray-800'>
              <CardHeader>
                <CardTitle className='text-white'>Select Alert Area</CardTitle>
              </CardHeader>
              <CardContent>
                <MapComponent height='400px' />
              </CardContent>
            </Card>
          </div>

          {/* Active Subscriptions */}
          <Card className='bg-gray-900 border-gray-800'>
            <CardHeader>
              <CardTitle className='text-white'>Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4 max-h-[700px] overflow-y-auto'>
                {subscriptions.map((subscription, index) => (
                  <div
                    key={subscription.id}
                    className='p-4 bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 hover:bg-gray-750'>
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        <MapPin className='h-4 w-4 text-white' />
                        <span className='text-white font-medium'>
                          {subscription.location}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant={
                            subscription.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            subscription.status === "Active"
                              ? "bg-gray-700 text-white border-gray-600"
                              : "bg-gray-600 text-gray-300 border-gray-500"
                          }>
                          {subscription.status}
                        </Badge>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6 text-gray-400 hover:text-white transition-all duration-200'>
                          <Edit className='h-3 w-3' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6 text-gray-400 hover:text-red-400 transition-all duration-200'
                          onClick={() =>
                            handleDeleteSubscription(subscription.id)
                          }>
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>

                    <div className='flex flex-wrap gap-1 mb-2'>
                      {subscription.eventTypes.map((type) => (
                        <Badge
                          key={type}
                          variant='outline'
                          className='text-xs border-gray-600 text-gray-300'>
                          {type}
                        </Badge>
                      ))}
                    </div>

                    <div className='text-sm text-gray-400'>
                      Frequency: {subscription.frequency}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
