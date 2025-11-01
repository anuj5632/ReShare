"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import SigninRoles from "@/components/signin-roles"
import Footer from "@/components/footer"
import { ArrowRight, Leaf, Users, TrendingUp, MapPin } from "lucide-react"

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [stats, setStats] = useState({
    itemsShared: "0",
    peopleHelped: "0",
    ngoPartners: "0",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/public/stats')
        if (!res.ok || !mounted) return
        const data = await res.json()
        if (!mounted) return
        
        // Format numbers with K/M suffixes for display
        const formatNumber = (num: number) => {
          if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
          if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
          return String(num)
        }
        
        setStats({
          itemsShared: formatNumber(data.totalItems || 0),
          peopleHelped: formatNumber(data.peopleHelped || 0),
          ngoPartners: formatNumber(data.verifiedNGOs || 0),
        })
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const roles = [
    {
      id: "donor",
      name: "Donor",
      description: "Share surplus items with organizations in need",
      icon: "🎁",
      href: "/login",
    },
    {
      id: "ngo",
      name: "NGO",
      description: "Receive donations and manage impact",
      icon: "🤝",
      href: "/login",
    },
    {
      id: "volunteer",
      name: "Volunteer",
      description: "Help distribute items to communities",
      icon: "👥",
      href: "/login",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Prominent sign-in by role on the landing page */}
      <SigninRoles />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
              Share Surplus, <span className="text-primary">Create Impact</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              ReShare connects donors with NGOs and volunteers to transform surplus items into meaningful help for
              communities in need.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login/donor">
              <Button size="lg" className="w-full sm:w-auto">
                Start Donating <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-12">
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-accent">{loading ? "0" : stats.itemsShared}</div>
              <div className="text-sm text-muted-foreground">Items Shared</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-accent">{loading ? "0" : stats.peopleHelped}</div>
              <div className="text-sm text-muted-foreground">People Helped</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-accent">{loading ? "0" : stats.ngoPartners}</div>
              <div className="text-sm text-muted-foreground">NGO Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Preview */}
      <section className="px-4 py-16 md:py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How You Can Participate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Link key={role.id} href={role.href}>
                <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="text-4xl mb-4">{role.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{role.name}</h3>
                  <p className="text-muted-foreground text-sm">{role.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why ReShare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Leaf className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Sustainable Impact</h3>
                <p className="text-muted-foreground text-sm">
                  Reduce waste while helping those in need. Every donation keeps items out of landfills.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Community Driven</h3>
                <p className="text-muted-foreground text-sm">
                  Connect with local NGOs and volunteers making a real difference in your community.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Track Your Impact</h3>
                <p className="text-muted-foreground text-sm">
                  See the real-world impact of your donations with detailed sustainability metrics.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Local & Easy</h3>
                <p className="text-muted-foreground text-sm">
                  Find NGOs and volunteers near you. Simple, transparent, and efficient donation process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
