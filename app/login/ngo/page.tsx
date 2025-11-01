"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Leaf } from "lucide-react"

export default function LoginNGOPage() {
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
      window.location.href = '/ngo/dashboard'
    } catch (err) {
      console.error(err)
      alert('Login failed')
      setIsLoading(false)
    }
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
          <CardTitle>Sign in as NGO</CardTitle>
          <CardDescription>Access your NGO dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="ngo@organization.org" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</Button>
          </form>

          <div className="text-center text-sm mt-6 space-y-2">
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <p className="text-xs font-semibold mb-2 text-foreground">Test Credentials (Seeded):</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p><span className="font-medium">Email:</span> greenearth@ngo.org | <span className="font-medium">Password:</span> password123</p>
                <p><span className="font-medium">Email:</span> hope@ngo.org | <span className="font-medium">Password:</span> password123</p>
                <p><span className="font-medium">Email:</span> community@ngo.org | <span className="font-medium">Password:</span> password123</p>
                <p><span className="font-medium">Email:</span> helpinghands@ngo.org | <span className="font-medium">Password:</span> password123</p>
                <p><span className="font-medium">Email:</span> youth@ngo.org | <span className="font-medium">Password:</span> password123</p>
              </div>
              <p className="text-xs mt-2 text-muted-foreground">Run <code className="bg-background px-1 py-0.5 rounded">npm run seed</code> to seed these accounts</p>
            </div>
            <p className="text-muted-foreground text-xs"><Link href="/" className="text-primary hover:underline">Back to home</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
