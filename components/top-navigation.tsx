"use client"

import { Search, Bell, User, Home, MapPin, BarChart3, Shield, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: MapPin,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Manage Alerts",
    url: "/alerts",
    icon: Shield,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function TopNavigation() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
      {/* Top row with logo, search, and user actions */}
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 shuttle-glow">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">CP</span>
            </div>
            <h1 className="text-xl font-bold text-white">CityPulse</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-64 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white transition-all duration-200"
            />
          </div> */}

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <Avatar className="border-2 border-gray-600 shuttle-glow">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-white text-black">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Navigation tabs row */}
      <div className="h-12 flex items-center px-6 bg-gray-800 border-t border-gray-700">
        <nav className="flex space-x-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <Link
                key={item.title}
                href={item.url}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive ? "bg-white text-black" : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
