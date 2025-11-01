import type React from "react"
import NGOSidebar from "@/components/ngo-sidebar"

export default function NGOLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <NGOSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
