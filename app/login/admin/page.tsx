"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Leaf } from "lucide-react"

export default function LoginAdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [reshareName, setReshareName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const allowed = ['reshare1', 'reshare2']
    if (!allowed.includes(reshareName)) {
      alert(`Invalid ReShare name. Allowed values: ${allowed.join(', ')}`)
      setIsLoading(false)
      return
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, reshareName }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Login failed')
        setIsLoading(false)
        return
      }
      window.location.href = '/admin/dashboard'
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
          <CardTitle>Sign in as Admin</CardTitle>
          <CardDescription>Admin access is restricted</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="admin@reshare.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ReShare Admin Name</label>
              <Input type="text" placeholder="" value={reshareName} onChange={(e) => setReshareName(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</Button>
          </form>

          <div className="text-center text-sm mt-6">
            <p className="text-muted-foreground">Admin accounts are managed by the ReShare team. No self-registration available.</p>
            <p className="text-muted-foreground text-xs mt-2"><Link href="/" className="text-primary hover:underline">Back to home</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
