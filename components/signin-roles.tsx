"use client"

import Link from "next/link"

export default function SigninRoles() {
  const roles = [
  { id: "donor", label: "Donor", href: "/login/donor" },
  { id: "volunteer", label: "Volunteer", href: "/login/volunteer" },
  { id: "ngo", label: "NGO", href: "/login/ngo" },
  { id: "admin", label: "Admin", href: "/login/admin" },
  ]

  return (
    <div className="w-full bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-lg md:text-xl font-semibold">Sign in quickly</h2>
          <p className="text-sm text-muted-foreground">Choose your role to continue — Donor, Volunteer or Admin.</p>
        </div>

        <div className="flex gap-3">
          {roles.map((r) => (
            <Link key={r.id} href={r.href} className="inline-block">
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:brightness-95 transition">
                Sign in as {r.label}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
