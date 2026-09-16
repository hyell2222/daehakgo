import type { ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="min-h-0 overflow-hidden">
        <div className="h-full overflow-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
