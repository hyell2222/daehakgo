import type { LucideIcon } from "lucide-react"
import {
  BarChart3Icon,
  FileSpreadsheetIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  PercentIcon,
  Table2Icon,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { useDataset } from "@/context/dataset-context"
import { formatNumber } from "@/lib/analytics"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  to: string
  icon: LucideIcon
}

const analysisItems: NavItem[] = [
  { title: "대시보드", to: "/", icon: LayoutDashboardIcon },
  { title: "지원 현황", to: "/applications", icon: BarChart3Icon },
  { title: "합격률", to: "/admission", icon: PercentIcon },
]

const dataItems: NavItem[] = [
  { title: "데이터 업로드", to: "/upload", icon: FileSpreadsheetIcon },
  { title: "원본 데이터", to: "/table", icon: Table2Icon },
]

export function AppSidebar() {
  const location = useLocation()
  const { dataset } = useDataset()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="대학GO">
              <Link to="/">
                <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GraduationCapIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">대학GO</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    진학 데이터 분석
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>분석</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analysisItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                    tooltip={item.title}
                  >
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>데이터</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                    tooltip={item.title}
                  >
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-lg bg-sidebar-accent px-2 py-2 text-xs text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
          {dataset ? (
            <>
              <p className="truncate font-medium">{dataset.fileName}</p>
              <p className="mt-0.5 text-sidebar-foreground/70">
                {formatNumber(dataset.rows.length)}행 · {dataset.columns.length}열
              </p>
            </>
          ) : (
            <p className="text-sidebar-foreground/70">업로드된 파일이 없습니다</p>
          )}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
