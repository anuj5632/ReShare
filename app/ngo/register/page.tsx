"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Upload, CheckCircle } from "lucide-react"

type Step = "org-info" | "contact" | "documents" | "verification"

export default function NGORegisterPage() {
  const [currentStep, setCurrentStep] = useState<Step>("org-info")
  const [completed, setCompleted] = useState(false)

  const [formData, setFormData] = useState({
    orgName: "",
    registrationId: "",
    act: "npo",
    foundingYear: new Date().getFullYear().toString(),
    address: "",
    areaOfService: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
    certificateFile: null as File | null,
    logoFile: null as File | null,
  })

  const steps: { id: Step; title: string; description: string }[] = [
    { id: "org-info", title: "Organization Info", description: "Basic details about your organization" },
    { id: "contact", title: "Contact Details", description: "How can we reach you?" },
    { id: "documents", title: "Documents", description: "Upload verification documents" },
    { id: "verification", title: "Verification", description: "Review and submit for approval" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }))
    }
  }

  const handleNext = () => {
    const stepOrder: Step[] = ["org-info", "contact", "documents", "verification"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const handlePrev = () => {
    const stepOrder: Step[] = ["org-info", "contact", "documents", "verification"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCompleted(true)
    // In a real app, would send to API here
    localStorage.setItem("userRole", "ngo")
    setTimeout(() => {
      window.location.href = "/ngo/status"
    }, 2000)
  }

  const stepIndex = steps.findIndex((s) => s.id === currentStep)
  const isLastStep = stepIndex === steps.length - 1

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for registering with ReShare. Your NGO will be verified within 10 days. You'll receive an email
              once verification is complete.
            </p>
            <Button onClick={() => (window.location.href = "/ngo/status")} className="w-full">
              View Status
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">NGO Registration</h1>
          <p className="text-muted-foreground mt-2">Complete your organization's profile</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between gap-2 mb-4">
            {steps.map((step, idx) => {
              const isActive = step.id === currentStep
              const isPassed = steps.findIndex((s) => s.id === currentStep) > idx

              return (
                <div key={step.id} className="flex-1 flex flex-col items-center">
                  <button
                    onClick={() => {
                      if (isPassed) {
                        setCurrentStep(step.id)
                      }
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isPassed
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isPassed ? "✓" : idx + 1}
                  </button>
                  <p className="text-xs font-medium mt-2 text-center">{step.title}</p>
                </div>
              )
            })}
          </div>
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[stepIndex].title}</CardTitle>
            <CardDescription>{steps[stepIndex].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Organization Info */}
              {currentStep === "org-info" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Name *</label>
                    <Input
                      name="orgName"
                      placeholder="Enter your NGO name"
                      value={formData.orgName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Registration ID *</label>
                    <Input
                      name="registrationId"
                      placeholder="e.g., NGO/2024/001234"
                      value={formData.registrationId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Registration Act *</label>
                    <select
                      name="act"
                      value={formData.act}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm"
                      required
                    >
                      <option value="npo">NPO Act</option>
                      <option value="societies">Societies Registration Act</option>
                      <option value="trust">Trust Act</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Founding Year *</label>
                    <Input
                      type="number"
                      name="foundingYear"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.foundingYear}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === "contact" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Person Name *</label>
                    <Input
                      name="contactName"
                      placeholder="Full name"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      name="contactEmail"
                      placeholder="contact@ngo.com"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input
                      name="contactPhone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Office Address *</label>
                    <Input
                      name="address"
                      placeholder="Street address, city, state, zip"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area of Service *</label>
                    <Input
                      name="areaOfService"
                      placeholder="e.g., Education, Healthcare, Food Security"
                      value={formData.areaOfService}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {currentStep === "documents" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Logo *</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition cursor-pointer">
                      <label className="cursor-pointer">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG or JPG (max. 2MB)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "logoFile")}
                          className="hidden"
                          required
                        />
                      </label>
                    </div>
                    {formData.logoFile && <p className="text-sm text-accent mt-2">✓ {formData.logoFile.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Registration Certificate *</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition cursor-pointer">
                      <label className="cursor-pointer">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF or image (max. 5MB)</p>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleFileChange(e, "certificateFile")}
                          className="hidden"
                          required
                        />
                      </label>
                    </div>
                    {formData.certificateFile && (
                      <p className="text-sm text-accent mt-2">✓ {formData.certificateFile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Description *</label>
                    <textarea
                      name="description"
                      placeholder="Tell us about your organization, mission, and the communities you serve..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full min-h-32 p-3 border border-border rounded-md text-sm resize-none"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === "verification" && (
                <div className="space-y-4">
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Review Your Information</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Organization:</span> {formData.orgName}
                      </p>
                      <p>
                        <span className="font-medium">Contact:</span> {formData.contactName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {formData.contactEmail}
                      </p>
                      <p>
                        <span className="font-medium">Area of Service:</span> {formData.areaOfService}
                      </p>
                    </div>
                  </div>

                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                    <p className="text-sm">
                      <span className="font-semibold">Verification Process:</span>
                      <br />
                      Your NGO will be verified within 10 days. You'll receive an email notification once the process is
                      complete. You can track the status in your dashboard.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 justify-between pt-6 border-t border-border">
                <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === "org-info"}>
                  Previous
                </Button>
                {isLastStep ? (
                  <Button type="submit" className="ml-auto">
                    Submit for Verification
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext} className="ml-auto">
                    Next
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
