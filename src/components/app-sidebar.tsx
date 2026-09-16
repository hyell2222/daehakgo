import type { LucideIcon } from "lucide-react"
import {
  FileSpreadsheetIcon,
  GaugeIcon,
  GraduationCapIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  PercentIcon,
  SearchIcon,
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
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  to: string
  icon: LucideIcon
}

const overviewItems: NavItem[] = [
  { title: "대시보드", to: "/", icon: LayoutDashboardIcon },
]

const analysisItems: NavItem[] = [
  { title: "대학별 결과 검색", to: "/search", icon: SearchIcon },
  { title: "전형별 합격률", to: "/admission-types", icon: PercentIcon },
  { title: "지역별 합격률", to: "/regions", icon: MapPinIcon },
  { title: "주요·지역 대학", to: "/major-regional", icon: LandmarkIcon },
  { title: "점수별 지원현황", to: "/scores", icon: GaugeIcon },
]

const dataItems: NavItem[] = [
  { title: "데이터", to: "/upload", icon: FileSpreadsheetIcon },
]

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string
  items: NavItem[]
  pathname: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.to}
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
  )
}

export function AppSidebar() {
  const location = useLocation()
  const { dataset } = useDataset()

  return (
    <Sidebar collapsible="none">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
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
        <NavGroup label="개요" items={overviewItems} pathname={location.pathname} />
        <NavGroup label="분석 결과" items={analysisItems} pathname={location.pathname} />
        <NavGroup label="데이터" items={dataItems} pathname={location.pathname} />
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-lg bg-sidebar-accent px-2 py-2 text-xs text-sidebar-accent-foreground">
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
    </Sidebar>
  )
}
