import type React from "react"
import DonorSidebar from "@/components/donor-sidebar"

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <DonorSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
