"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "donor"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Login failed')
        setIsLoading(false)
        return
      }

      // Successful login: server sets HttpOnly cookie. Redirect based on role.
      // We can optionally fetch /api/auth/me to determine role, but we'll use role query param for now.
      const roleRoutes: { [key: string]: string } = {
        donor: '/donor/dashboard',
        ngo: '/ngo/dashboard',
        volunteer: '/volunteer/dashboard',
        admin: '/admin/dashboard',
      }
      window.location.href = roleRoutes[role] || '/donor/dashboard'
    } catch (err) {
      console.error(err)
      alert('Login failed')
      setIsLoading(false)
    }
  }

  const roleNames: { [key: string]: string } = {
    donor: "Donor",
    ngo: "NGO",
    volunteer: "Volunteer",
    admin: "Admin",
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle>Welcome to ReShare</CardTitle>
          <CardDescription>Sign in as {roleNames[role]}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground mb-4">
              Demo Credentials:
              <br />
              Email: test@reshare.com
              <br />
              Password: demo123
            </p>
          </div>

          <div className="text-center text-sm space-y-2">
            <p>
              Don't have an account?{" "}
              <Link href={role === 'donor' ? '/signup/donor' : role === 'volunteer' ? '/signup/volunteer' : '/signup?role=' + role} className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-muted-foreground text-xs">
              <Link href="/" className="text-primary hover:underline">
                Back to home
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
