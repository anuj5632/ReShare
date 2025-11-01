"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, MapPin, Clock, Check } from "lucide-react"

export default function PostDonationPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    category: "clothing",
    description: "",
    quantity: "1",
    condition: "new",
    expiryDate: "",
    urgency: "normal",
    location: "",
    latitude: "",
    longitude: "",
    images: [] as File[],
  })
  const [submitted, setSubmitted] = useState(false)

  const categories = ["Clothing", "Books", "Electronics", "Furniture", "Food", "Medical", "Other"]
  const conditions = ["New", "Like New", "Good", "Fair"]
  const urgencies = ["Low", "Normal", "High", "Critical"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files].slice(0, 5) }))
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    ;(async () => {
      try {
        const res = await fetch('/api/donor/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            quantity: formData.quantity,
            category: formData.category,
            description: formData.description,
            condition: formData.condition,
            expiryDate: formData.expiryDate,
            urgency: formData.urgency,
            location: formData.location,
            latitude: formData.latitude,
            longitude: formData.longitude,
          }),
        })
        if (!res.ok) {
          const err = await res.json()
          alert(err.error || 'Failed to post donation')
          return
        }
        setSubmitted(true)
        setTimeout(() => {
          window.location.href = "/donor/dashboard"
        }, 1200)
      } catch (err) {
        console.error(err)
        alert('Failed to post donation')
      }
    })()
  }

  const useCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }))
      })
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Check className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Donation Posted!</h2>
            <p className="text-muted-foreground mb-6">
              Your donation is now visible to NGOs in your area. You'll be notified when someone claims it.
            </p>
            <Button onClick={() => (window.location.href = "/donor/dashboard")} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Post a Donation</h1>
          <p className="text-muted-foreground">Share your surplus items with organizations in need</p>
        </div>

        {/* Progress Steps */}
        <div className="flex gap-4 justify-between">
          {["Details", "Location", "Photos"].map((label, idx) => (
            <button
              key={idx}
              onClick={() => setStep(idx + 1)}
              className={`flex-1 py-3 rounded-lg font-medium transition ${
                step === idx + 1
                  ? "bg-primary text-primary-foreground"
                  : idx < step - 1
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {idx + 1}. {label}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{["Donation Details", "Location", "Photos"][step - 1]}</CardTitle>
            <CardDescription>
              {["Tell us about your donation", "Where is it located?", "Add photos of the items"][step - 1]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Item Title *</label>
                    <Input
                      name="title"
                      placeholder="e.g., Winter Clothing Bundle"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat.toLowerCase()}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Condition *</label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                        required
                      >
                        {conditions.map((cond) => (
                          <option key={cond} value={cond.toLowerCase()}>
                            {cond}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      name="description"
                      placeholder="Describe the items in detail..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full min-h-24 p-3 border border-border rounded-md text-sm resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantity *</label>
                      <Input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Urgency</label>
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm"
                      >
                        {urgencies.map((urg) => (
                          <option key={urg} value={urg.toLowerCase()}>
                            {urg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date (Optional)</label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pickup Location *</label>
                    <Input
                      name="location"
                      placeholder="Enter your address"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={useCurrentLocation}
                    className="w-full bg-transparent"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Use Current Location
                  </Button>

                  {(formData.latitude || formData.longitude) && (
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <p className="text-sm">
                        <span className="font-semibold">Location Coordinates:</span>
                        <br />
                        {formData.latitude}, {formData.longitude}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Latitude</label>
                      <Input
                        type="number"
                        name="latitude"
                        step="0.0001"
                        placeholder="e.g., 40.7128"
                        value={formData.latitude}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Longitude</label>
                      <Input
                        type="number"
                        name="longitude"
                        step="0.0001"
                        placeholder="e.g., -74.0060"
                        value={formData.longitude}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      Your location helps NGOs find items close to them. You can adjust the exact coordinates or leave
                      it for pickup coordination.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Photos */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Photos (Max 5)</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
                      <label className="cursor-pointer">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG or JPG (max. 10MB each)</p>
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{formData.images.length} photos uploaded</p>
                      <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((file, idx) => (
                          <div key={idx} className="relative bg-muted rounded-lg p-2">
                            <p className="text-xs truncate text-center">{file.name}</p>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-900">
                      Good photos help NGOs understand what they're receiving. Include clear images from multiple
                      angles.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 justify-between pt-6 border-t border-border">
                <Button type="button" variant="outline" onClick={handlePrev} disabled={step === 1}>
                  Previous
                </Button>
                {step < 3 ? (
                  <Button type="button" onClick={handleNext} className="ml-auto">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="ml-auto">
                    Post Donation
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
