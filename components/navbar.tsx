"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X } from "lucide-react"
import { signOutClient } from "@/lib/client/auth"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSignedIn(Boolean(localStorage.getItem('token')))
      const onStorage = () => setSignedIn(Boolean(localStorage.getItem('token')))
      window.addEventListener('storage', onStorage)
      return () => window.removeEventListener('storage', onStorage)
    }
  }, [])

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Leaf className="w-6 h-6 text-primary" />
            <span className="text-foreground">ReShare</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition">
              About
            </Link>
            <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition">
              How it Works
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!signedIn ? (
              <>
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            ) : (
              <Button variant="outline" onClick={() => signOutClient()}>Sign Out</Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-border pt-4">
            <Link href="/about" className="block text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/how-it-works" className="block text-muted-foreground hover:text-foreground">
              How it Works
            </Link>
            <Link href="/contact" className="block text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <div className="flex gap-2 pt-4">
              {!signedIn ? (
                <>
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              ) : (
                <Button className="w-full" onClick={() => signOutClient()}>Sign Out</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
