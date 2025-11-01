"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOutClient } from "@/lib/client/auth"

export function RoleSelector() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null
    setUserRole(role)
    setToken(t)
  }, [])

  const roles = [
    { id: "donor", label: "Donor" },
    { id: "volunteer", label: "Volunteer" },
    { id: "admin", label: "Admin" },
  ]

  const roleRoutes: { [key: string]: string } = {
    donor: "/donor/dashboard",
    volunteer: "/volunteer/dashboard",
    admin: "/admin/dashboard",
  }

  const handleSwitchRole = useCallback((newRole: string) => {
    if (typeof window === "undefined") return
    localStorage.setItem("userRole", newRole)
    setUserRole(newRole)
    const href = roleRoutes[newRole] || "/"
    router.push(href)
  }, [router])

  const handleSignOut = useCallback(() => {
    // call server + client cleanup
    signOutClient()
  }, [router])

  return (
    <div className="p-3 max-w-xs bg-card border border-border rounded-md shadow-sm">
      <div className="mb-2">
        <p className="text-sm font-semibold">Sign in / Sign out (by role)</p>
        <p className="text-xs text-muted-foreground">Choose how you want to sign in or sign out.</p>
      </div>

      <div className="space-y-2">
        {roles.map((role) => {
          const isActive = userRole === role.id
          if (!token) {
            // Not authenticated: offer sign-in link with role query
            return (
              <Link
                  key={role.id}
                  href={`/login/${role.id}`}
                  className="block w-full px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground text-center"
                >
                  Sign in as {role.label}
                </Link>
            )
          }

          // Authenticated: if current role show Sign out option, otherwise allow switching
          return isActive ? (
            <button
              key={role.id}
              onClick={handleSignOut}
              className="w-full px-3 py-2 text-sm rounded-md bg-red-600 text-white"
            >
              Sign out as {role.label}
            </button>
          ) : (
            <button
              key={role.id}
              onClick={() => handleSwitchRole(role.id)}
              className="w-full px-3 py-2 text-sm rounded-md bg-muted hover:bg-muted/80"
            >
              Switch to {role.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
