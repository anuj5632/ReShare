"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Leaf } from "lucide-react"

export default function SignupVolunteerPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "", skills: "", availability: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'VOLUNTEER',
          meta: { phone: formData.phone, skills: formData.skills, availability: formData.availability }
        })
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Signup failed')
        setIsLoading(false)
        return
      }
      // auto-login
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email, password: formData.password })
      })
      if (!loginRes.ok) {
        alert('Signup succeeded but login failed')
        setIsLoading(false)
        return
      }
      window.location.href = '/volunteer/dashboard'
    } catch (err) {
      console.error(err)
      alert('Signup failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4"><div className="bg-primary/10 p-3 rounded-lg"><Leaf className="w-6 h-6 text-primary" /></div></div>
          <CardTitle>Create Volunteer Account</CardTitle>
          <CardDescription>Help distribute items in your community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium">Full Name</label><Input name="name" value={formData.name} onChange={handleInput} required /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input type="email" name="email" value={formData.email} onChange={handleInput} required /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Phone</label><Input name="phone" value={formData.phone} onChange={handleInput} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Skills (comma separated)</label><Input name="skills" value={formData.skills} onChange={handleInput} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Availability</label><Input name="availability" value={formData.availability} onChange={handleInput} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Password</label><Input type="password" name="password" value={formData.password} onChange={handleInput} required /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Confirm Password</label><Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInput} required /></div>
            <div className="space-y-3 pt-2"><Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Creating account...' : 'Create Account'}</Button></div>
          </form>
          <div className="text-center text-sm mt-6"><p className="text-muted-foreground">Already have an account? <Link href="/login/volunteer" className="text-primary hover:underline">Sign in</Link></p></div>
        </CardContent>
      </Card>
    </div>
  )
}
