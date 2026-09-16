import { Building2Icon, CalendarRangeIcon, LayersIcon } from "lucide-react"

import {
  CategoryBarChart,
  GroupedBarChart,
} from "@/components/charts/category-bar-chart"
import { CategoryPieChart } from "@/components/charts/category-pie-chart"
import { EmptyDataset } from "@/components/empty-dataset"
import { MappingNotice } from "@/components/mapping-notice"
import { PageShell } from "@/components/page-shell"
import { StatCard } from "@/components/stat-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDataset } from "@/context/dataset-context"
import { formatNumber, funnelCounts, groupCount, groupRates } from "@/lib/analytics"

export function ApplicationsPage() {
  const { dataset } = useDataset()

  if (!dataset) {
    return (
      <PageShell
        title="지원 현황"
        description="대학·전형·모집단위별 지원 건수를 보여 줍니다."
      >
        <EmptyDataset description="엑셀을 올리면 지원 현황 그래프를 그릴 수 있습니다." />
      </PageShell>
    )
  }

  const funnel = funnelCounts(dataset.rows)
  const universityRates = groupRates(dataset.rows, "university").slice(0, 10)
  const admissionCounts = groupCount(dataset.rows, "admissionName").slice(0, 8)
  const trackCounts = groupCount(dataset.rows, "track")
  const kindCounts = groupCount(dataset.rows, "admissionKind")

  return (
    <PageShell
      title="지원 현황"
      description="어디로, 어떤 전형으로 지원했는지 학교 전체 분포입니다."
    >
      <MappingNotice mapped={dataset.mapped} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="총 지원"
          value={formatNumber(funnel.applications)}
          icon={Building2Icon}
        />
        <StatCard
          title="전형명 수"
          value={formatNumber(admissionCounts.length)}
          icon={LayersIcon}
        />
        <StatCard
          title="1단계 통과"
          value={formatNumber(funnel.stage1)}
          hint="1단계 컬럼 기준"
          icon={CalendarRangeIcon}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>대학별 지원·합격</CardTitle>
          <CardDescription>지원이 많았던 대학 10곳입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <GroupedBarChart data={universityRates} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>전형명</CardTitle>
            <CardDescription>학생부교과·종합·논술·정시 등</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBarChart
              data={admissionCounts.map((item) => ({ name: item.name, value: item.count }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>계열 · 전형종류</CardTitle>
            <CardDescription>인문/자연, 수시/정시 비중</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <CategoryPieChart
              data={trackCounts.map((item) => ({ name: item.name, value: item.count }))}
            />
            <CategoryPieChart
              data={kindCounts.map((item) => ({ name: item.name, value: item.count }))}
            />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
