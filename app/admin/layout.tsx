import type React from "react"
import AdminSidebar from "@/components/admin-sidebar"
import { getUserFromCookie } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserFromCookie()
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/login/admin')
  }
  
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
