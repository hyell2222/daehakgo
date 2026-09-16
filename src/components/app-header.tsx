import { useLocation } from "react-router-dom"

import { useDataset } from "@/context/dataset-context"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const PAGE_TITLES: Record<string, string> = {
  "/": "대시보드",
  "/applications": "지원 현황",
  "/admission": "합격률",
  "/upload": "데이터 업로드",
  "/table": "원본 데이터",
}

export function AppHeader() {
  const location = useLocation()
  const { dataset } = useDataset()
  const title = PAGE_TITLES[location.pathname] ?? "대학GO"

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
        {dataset ? (
          <Badge variant="secondary">데이터 연결됨</Badge>
        ) : (
          <Badge variant="outline">데이터 없음</Badge>
        )}
      </div>
    </header>
  )
}
