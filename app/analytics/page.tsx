"use client";

import { MapComponent } from "@/components/map-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
} from "lucide-react";

// Dummy analytics data
const analyticsData = {
  totalIncidents: 12345,
  activeIncidents: 6788,
  resolvedIncidents: 3458,
  trendingIncidents: [
    { type: "Traffic Accidents", count: 234, trend: "up", change: "+12%" },
    { type: "Road Closures", count: 156, trend: "down", change: "-8%" },
    { type: "Construction", count: 89, trend: "up", change: "+15%" },
    { type: "Weather Related", count: 67, trend: "down", change: "-5%" },
  ],
  recentActivity: [
    {
      time: "2 mins ago",
      event: "Traffic accident reported on MG Road",
      severity: "high",
    },
    {
      time: "15 mins ago",
      event: "Road closure on Brigade Road cleared",
      severity: "low",
    },
    {
      time: "1 hour ago",
      event: "Construction work started on Whitefield Road",
      severity: "medium",
    },
    {
      time: "2 hours ago",
      event: "Weather alert issued for Electronic City",
      severity: "medium",
    },
  ],
};

// Sample incidents for the heatmap
const heatmapIncidents = [
  {
    id: "1",
    lat: 12.9716,
    lng: 77.5946,
    type: "Traffic",
    description: "Heavy traffic",
    severity: "medium" as const,
  },
  {
    id: "2",
    lat: 12.9698,
    lng: 77.5986,
    type: "Construction",
    description: "Road work",
    severity: "low" as const,
  },
  {
    id: "3",
    lat: 12.975,
    lng: 77.59,
    type: "Accident",
    description: "Minor collision",
    severity: "high" as const,
  },
  {
    id: "4",
    lat: 12.965,
    lng: 77.6,
    type: "Weather",
    description: "Flooding",
    severity: "high" as const,
  },
  {
    id: "5",
    lat: 12.98,
    lng: 77.59,
    type: "Traffic",
    description: "Signal issue",
    severity: "medium" as const,
  },
];

export default function Analytics() {
  return (
    <div className='p-6 h-screen overflow-y-auto'>
      <div className='max-w-full mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold text-white shuttle-glow'>
            Citywide Insights
          </h1>
          <div className='flex items-center gap-4'>
            <Select defaultValue='7days'>
              <SelectTrigger className='w-40 bg-gray-800 border-gray-700 text-white focus:border-white transition-all duration-200'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-gray-800 border-gray-700'>
                <SelectItem value='24hours'>Last 24 Hours</SelectItem>
                <SelectItem value='7days'>Last 7 Days</SelectItem>
                <SelectItem value='30days'>Last 30 Days</SelectItem>
                <SelectItem value='90days'>Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <Card className='bg-gray-900 border-gray-800 shuttle-glow'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-400 text-sm'>Total Incidents</p>
                  <p className='text-3xl font-bold text-white'>
                    {analyticsData.totalIncidents.toLocaleString()}
                  </p>
                </div>
                <AlertTriangle className='h-8 w-8 text-white' />
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gray-900 border-gray-800 shuttle-glow'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-400 text-sm'>Active Incidents</p>
                  <p className='text-3xl font-bold text-white'>
                    {analyticsData.activeIncidents.toLocaleString()}
                  </p>
                </div>
                <div className='h-8 w-8 bg-red-500 rounded-full flex items-center justify-center'>
                  <div className='h-3 w-3 bg-white rounded-full' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gray-900 border-gray-800 shuttle-glow'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-400 text-sm'>Resolved Today</p>
                  <p className='text-3xl font-bold text-white'>
                    {analyticsData.resolvedIncidents.toLocaleString()}
                  </p>
                </div>
                <div className='h-8 w-8 bg-green-500 rounded-full flex items-center justify-center'>
                  <div className='h-3 w-3 bg-white rounded-full' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          {/* Trending Incidents */}
          <Card className='bg-gray-900 border-gray-800'>
            <CardHeader>
              <CardTitle className='text-white'>Incident Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {analyticsData.trendingIncidents.map((incident, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 hover:bg-gray-750'>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-white rounded-full' />
                      <div>
                        <p className='text-white font-medium'>
                          {incident.type}
                        </p>
                        <p className='text-gray-400 text-sm'>
                          {incident.count} incidents
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {incident.trend === "up" ? (
                        <TrendingUp className='h-4 w-4 text-red-400' />
                      ) : (
                        <TrendingDown className='h-4 w-4 text-green-400' />
                      )}
                      <span
                        className={`text-sm ${
                          incident.trend === "up"
                            ? "text-red-400"
                            : "text-green-400"
                        }`}>
                        {incident.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className='bg-gray-900 border-gray-800'>
            <CardHeader>
              <CardTitle className='text-white'>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {analyticsData.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 hover:bg-gray-750'>
                    <div className='flex-shrink-0 mt-1'>
                      <Badge
                        variant={
                          activity.severity === "high"
                            ? "destructive"
                            : activity.severity === "medium"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          activity.severity === "high"
                            ? "bg-red-900 text-red-300 border-red-700"
                            : activity.severity === "medium"
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-gray-600 text-gray-300 border-gray-500"
                        }>
                        {activity.severity}
                      </Badge>
                    </div>
                    <div className='flex-1'>
                      <p className='text-white text-sm'>{activity.event}</p>
                      <p className='text-gray-400 text-xs flex items-center gap-1 mt-1'>
                        <Calendar className='h-3 w-3' />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Map */}
        <Card className='bg-gray-900 border-gray-800'>
          <CardHeader>
            <CardTitle className='text-white'>Incident Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <MapComponent height='500px' incidents={heatmapIncidents} />
            <p className='text-gray-400 text-sm mt-2'>
              Interactive map showing incident density across the city
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
