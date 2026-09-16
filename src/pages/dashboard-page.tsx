import {
  CheckCircle2Icon,
  ClipboardListIcon,
  GraduationCapIcon,
  LandmarkIcon,
} from "lucide-react"
import { Link } from "react-router-dom"

import {
  CategoryBarChart,
  GroupedBarChart,
} from "@/components/charts/category-bar-chart"
import { CategoryPieChart } from "@/components/charts/category-pie-chart"
import { EmptyDataset } from "@/components/empty-dataset"
import { MappingNotice } from "@/components/mapping-notice"
import { PageShell } from "@/components/page-shell"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDataset } from "@/context/dataset-context"
import {
  formatNumber,
  formatPercent,
  funnelCounts,
  groupCount,
  groupRates,
} from "@/lib/analytics"

export function DashboardPage() {
  const { dataset } = useDataset()

  if (!dataset) {
    return (
      <PageShell
        title="대시보드"
        description="진학 데이터를 올리면 지원 현황과 합격·등록 요약이 여기에 나타납니다."
      >
        <EmptyDataset />
      </PageShell>
    )
  }

  const funnel = funnelCounts(dataset.rows)
  const passRate = funnel.applications ? funnel.passed / funnel.applications : 0
  const enrollRate = funnel.passed ? funnel.enrolled / funnel.passed : 0
  const trackRates = groupRates(dataset.rows, "track").slice(0, 8)
  const kindRates = groupRates(dataset.rows, "admissionCategory").slice(0, 8)
  const periodCounts = groupCount(dataset.rows, "period")
  const universityRates = groupRates(dataset.rows, "university").slice(0, 10)
  const universityCount = groupRates(dataset.rows, "university").length
  const regionCounts = groupCount(dataset.rows, "region").slice(0, 8)

  return (
    <PageShell
      title="대시보드"
      description={`${dataset.fileName} 기준 학교 전체 진학 요약입니다.`}
      actions={
        <Button asChild variant="outline">
          <Link to="/upload">다른 파일 올리기</Link>
        </Button>
      }
    >
      <MappingNotice mapped={dataset.mapped} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="총 지원"
          value={formatNumber(funnel.applications)}
          hint="지원서 기준 건수"
          icon={ClipboardListIcon}
        />
        <StatCard
          title="최종 합격"
          value={formatNumber(funnel.passed)}
          hint={`합격률 ${formatPercent(passRate)}`}
          icon={CheckCircle2Icon}
        />
        <StatCard
          title="등록(진학)"
          value={formatNumber(funnel.enrolled)}
          hint={`합격 대비 등록률 ${formatPercent(enrollRate)}`}
          icon={GraduationCapIcon}
        />
        <StatCard
          title="대학 수"
          value={formatNumber(universityCount)}
          hint="지원이 있었던 대학"
          icon={LandmarkIcon}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>전형 분류별 지원·합격</CardTitle>
            <CardDescription>교과·종합·논술·정시 비중을 한눈에 봅니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <GroupedBarChart data={kindRates} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>지원시기</CardTitle>
            <CardDescription>수시와 정시 비중입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart
              data={periodCounts.map((item) => ({ name: item.name, value: item.count }))}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>계열별 합격률</CardTitle>
            <CardDescription>인문·자연 등 계열 편차입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBarChart
              data={trackRates.map((item) => ({
                name: item.name,
                value: Math.round(item.rate * 1000) / 10,
              }))}
              label="합격률(%)"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>지역별 지원</CardTitle>
            <CardDescription>대학 소재지 기준 지원 분포입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBarChart
              data={regionCounts.map((item) => ({ name: item.name, value: item.count }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>대학별 진학 요약</CardTitle>
          <CardDescription>지원이 많았던 대학 순입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>대학</TableHead>
                <TableHead className="text-right">지원</TableHead>
                <TableHead className="text-right">합격</TableHead>
                <TableHead className="text-right">등록</TableHead>
                <TableHead className="text-right">합격률</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universityRates.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.applications)}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.passed)}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.enrolled)}</TableCell>
                  <TableCell className="text-right">{formatPercent(item.rate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  )
}
