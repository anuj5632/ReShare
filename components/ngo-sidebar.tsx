"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Leaf, LogOut, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function NGOSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const links = [
    { href: "/ngo/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/ngo/claims", label: "Claims", icon: "📦" },
    { href: "/ngo/profile", label: "Profile", icon: "⚙️" },
  ]

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-primary-foreground p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={cn(
          "fixed md:relative w-64 h-full bg-card border-r border-border flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-border">
          <Link href="/ngo/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Leaf className="w-6 h-6 text-primary" />
            <span>ReShare</span>
          </Link>
        </div>

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

      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
