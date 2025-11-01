"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MapPin, Search, Sliders, X, AlertCircle } from "lucide-react"

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedUrgency, setSelectedUrgency] = useState("all")
  const [radiusKm, setRadiusKm] = useState(10)
  const [searchLocation, setSearchLocation] = useState("")
  const [selectedItem, setSelectedItem] = useState<(typeof mapItems)[0] | null>(null)

  const categories = ["All", "Clothing", "Books", "Electronics", "Furniture", "Food", "Medical"]
  const urgencies = ["All", "Low", "Normal", "High", "Critical"]

  // Mock data for map items
  const mapItems = [
    {
      id: 1,
      title: "Winter Clothing Bundle",
      donor: "Sarah Johnson",
      category: "Clothing",
      quantity: 12,
      urgency: "Normal",
      location: "Downtown Center",
      lat: 40.7128,
      lng: -74.006,
      distance: 0.5,
      status: "Available",
    },
    {
      id: 2,
      title: "Educational Books",
      donor: "Michael Chen",
      category: "Books",
      quantity: 45,
      urgency: "High",
      location: "Midtown Library",
      lat: 40.7505,
      lng: -73.9755,
      distance: 2.3,
      status: "Available",
    },
    {
      id: 3,
      title: "Kitchen Equipment",
      donor: "Emily Rodriguez",
      category: "Furniture",
      quantity: 8,
      urgency: "Normal",
      location: "Uptown Community Center",
      lat: 40.7689,
      lng: -73.983,
      distance: 3.8,
      status: "Claimed",
    },
    {
      id: 4,
      title: "Medical Supplies",
      donor: "John Smith",
      category: "Medical",
      quantity: 32,
      urgency: "Critical",
      location: "Downtown Clinic",
      lat: 40.718,
      lng: -73.995,
      distance: 1.2,
      status: "Available",
    },
    {
      id: 5,
      title: "Electronics Bundle",
      donor: "Lisa Wang",
      category: "Electronics",
      quantity: 6,
      urgency: "Low",
      location: "Tech Hub Downtown",
      lat: 40.7069,
      lng: -74.0113,
      distance: 2.1,
      status: "Available",
    },
    {
      id: 6,
      title: "Food Supplies",
      donor: "Community Restaurant",
      category: "Food",
      quantity: 50,
      urgency: "High",
      location: "Food Bank Warehouse",
      lat: 40.7614,
      lng: -73.9776,
      distance: 4.2,
      status: "Available",
    },
  ]

  // Filter items based on selected filters
  const filteredItems = mapItems.filter((item) => {
    const categoryMatch = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory.toLowerCase()
    const urgencyMatch = selectedUrgency === "all" || item.urgency.toLowerCase() === selectedUrgency.toLowerCase()
    const radiusMatch = item.distance <= radiusKm
    const searchMatch =
      searchLocation === "" ||
      item.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
      item.title.toLowerCase().includes(searchLocation.toLowerCase())
    return categoryMatch && urgencyMatch && radiusMatch && searchMatch
  })

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Claimed":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find Donations Near You</h1>
            <p className="text-muted-foreground">Browse available items from donors in your area</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Filters & List */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Search Location</label>
                      <div className="flex gap-2">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <Input
                          placeholder="City or area..."
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sliders className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Category</label>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat.toLowerCase())}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                            selectedCategory === cat.toLowerCase()
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Urgency Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Urgency</label>
                    <div className="space-y-2">
                      {urgencies.map((urg) => (
                        <button
                          key={urg}
                          onClick={() => setSelectedUrgency(urg.toLowerCase())}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                            selectedUrgency === urg.toLowerCase()
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {urg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Radius Slider */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Radius: {radiusKm} km</label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">{filteredItems.length} results found</div>
            </div>

            {/* Main Content - Map & List */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Map Placeholder */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Donation Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                        <p className="text-muted-foreground">Interactive map with {filteredItems.length} locations</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Map visualization showing donor locations and available donations in your area
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* List View */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="font-semibold text-lg">Available Donations</h2>

                  {filteredItems.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No donations found matching your filters.</p>
                        <p className="text-xs text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredItems.map((item) => (
                      <Card
                        key={item.id}
                        className="hover:border-primary/50 transition cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">From: {item.donor}</p>
                              </div>
                              <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{item.category}</Badge>
                              <Badge className={getUrgencyColor(item.urgency)}>{item.urgency}</Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {item.location} ({item.distance} km)
                              </div>
                              <div>{item.quantity} items</div>
                            </div>

                            <Button className="w-full" disabled={item.status === "Claimed"}>
                              {item.status === "Claimed" ? "Already Claimed" : "Claim This Donation"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{selectedItem.title}</CardTitle>
                <CardDescription>{selectedItem.donor}</CardDescription>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-1 hover:bg-muted rounded-md transition">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Category</p>
                  <p className="font-semibold">{selectedItem.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Quantity</p>
                  <p className="font-semibold">{selectedItem.quantity} items</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Urgency</p>
                  <Badge className={getUrgencyColor(selectedItem.urgency)}>{selectedItem.urgency}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Status</p>
                  <Badge className={getStatusColor(selectedItem.status)}>{selectedItem.status}</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Location</p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedItem.location} ({selectedItem.distance} km away)
                </p>
              </div>

              <div className="pt-4 border-t border-border flex gap-2">
                <Button className="flex-1" disabled={selectedItem.status === "Claimed"}>
                  {selectedItem.status === "Claimed" ? "Already Claimed" : "Claim This Donation"}
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedItem(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}
