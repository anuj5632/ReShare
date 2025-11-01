"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const initialRole = searchParams.get("role") || null
  const [step, setStep] = useState<"role" | "form">(initialRole ? "form" : "role")
  const [selectedRole, setSelectedRole] = useState<string>(initialRole || "")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const roles = [
    {
      id: "donor",
      name: "Donor",
      description: "I want to share surplus items",
      icon: "🎁",
    },
    {
      id: "ngo",
      name: "NGO/Organization",
      description: "We receive and distribute items",
      icon: "🤝",
    },
    {
      id: "volunteer",
      name: "Volunteer",
      description: "I want to help distribute items",
      icon: "👥",
    },
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setStep("form")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      // call register API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole.toUpperCase(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Signup failed')
        setIsLoading(false)
        return
      }

      // Auto-login after successful registration
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })

      if (!loginRes.ok) {
        const err = await loginRes.json()
        alert(err.error || 'Login after signup failed')
        setIsLoading(false)
        return
      }

      // Redirect based on role
      if (selectedRole === 'ngo') {
        window.location.href = '/ngo/register'
      } else {
        const roleRoutes: { [key: string]: string } = {
          donor: '/donor/dashboard',
          volunteer: '/volunteer/dashboard',
        }
        window.location.href = roleRoutes[selectedRole] || '/donor/dashboard'
      }
    } catch (err) {
      console.error(err)
      alert('Signup failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle>{step === "role" ? "Join ReShare" : "Create Your Account"}</CardTitle>
          <CardDescription>
            {step === "role"
              ? "Choose your role to get started"
              : `Sign up as ${roles.find((r) => r.id === selectedRole)?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "role" ? (
            <div className="space-y-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="w-full p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-1">{role.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{role.name}</p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-3 pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setStep("role")
                    setSelectedRole("")
                  }}
                >
                  Back
                </Button>
              </div>
            </form>
          )}

          <div className="text-center text-sm mt-6">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
