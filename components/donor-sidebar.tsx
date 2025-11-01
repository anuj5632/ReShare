"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Leaf, LogOut, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function DonorSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const links = [
    { href: "/donor/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/donor/post-donation", label: "Post Donation", icon: "+" },
    { href: "/donor/history", label: "History", icon: "📜" },
    { href: "/donor/impact", label: "My Impact", icon: "🌱" },
  ]

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-primary-foreground p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative w-64 h-full bg-card border-r border-border flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/donor/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Leaf className="w-6 h-6 text-primary" />
            <span>ReShare</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const isActive = mounted && pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button 
            onClick={() => { import('@/lib/client/auth').then(m => m.signOutClient()) }} 
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg transition"
            suppressHydrationWarning
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
