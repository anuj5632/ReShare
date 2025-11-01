"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Package, Users } from "lucide-react"

export default function HowItWorksPage() {
  const donorSteps = [
    {
      step: 1,
      title: "Post Your Donation",
      description: "Upload photos, add details about your surplus items, and set the expiry date.",
    },
    {
      step: 2,
      title: "NGOs Claim Items",
      description: "Nearby NGOs see your donation and claim items that match their needs.",
    },
    {
      step: 3,
      title: "Schedule Pickup",
      description: "Arrange convenient pickup with volunteers or NGO representatives.",
    },
    {
      step: 4,
      title: "Track Impact",
      description: "See where your items went and the impact they created.",
    },
  ]

  const ngoSteps = [
    {
      step: 1,
      title: "Register Your NGO",
      description: "Complete verification process to become a trusted organization.",
    },
    {
      step: 2,
      title: "Browse Available Items",
      description: "Search donations by category, urgency, and location near you.",
    },
    {
      step: 3,
      title: "Claim & Coordinate",
      description: "Claim items and coordinate pickup with donors through the platform.",
    },
    {
      step: 4,
      title: "Report Distribution",
      description: "Track beneficiaries and report the impact of distributed items.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold">How ReShare Works</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and efficient. Here's how surplus items transform into community impact.
            </p>
          </div>

          {/* Donor Flow */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Package className="w-8 h-8 text-primary" />
                For Donors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {donorSteps.map((item, idx) => (
                  <div key={idx} className="relative">
                    <Card className="p-6 h-full">
                      <div className="text-4xl font-bold text-accent mb-4">{item.step}</div>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </Card>
                    {idx < donorSteps.length - 1 && (
                      <div className="hidden md:block absolute -right-2 top-8 text-primary font-bold">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NGO Flow */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                For NGOs & Organizations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {ngoSteps.map((item, idx) => (
                  <div key={idx} className="relative">
                    <Card className="p-6 h-full">
                      <div className="text-4xl font-bold text-accent mb-4">{item.step}</div>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </Card>
                    {idx < ngoSteps.length - 1 && (
                      <div className="hidden md:block absolute -right-2 top-8 text-primary font-bold">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-secondary/10 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Verified Organizations</h3>
                  <p className="text-sm text-muted-foreground">
                    All NGOs and volunteers are verified for trust and safety.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Location-Based Matching</h3>
                  <p className="text-sm text-muted-foreground">Find nearby opportunities with interactive map view.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Impact Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time metrics on sustainability and community impact.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Secure Communication</h3>
                  <p className="text-sm text-muted-foreground">Safe messaging and coordination between parties.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Preview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Common Questions</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Is my personal information safe?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, we use industry-standard encryption and only share necessary information between donors and
                  recipients.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">How are items verified?</h3>
                <p className="text-sm text-muted-foreground">
                  Donors provide photos and details. Our verification process ensures quality and safety standards.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Can I donate anonymously?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, but organizations need to contact you for pickup coordination, so some information is required.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
