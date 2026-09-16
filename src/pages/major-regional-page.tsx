import { LandmarkIcon, MapPinnedIcon } from "lucide-react"

import { CategoryBarChart } from "@/components/charts/category-bar-chart"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDataset } from "@/context/dataset-context"
import { formatNumber } from "@/lib/analytics"
import { universityGroupReport } from "@/lib/reports"

function UniversityCountTable({
  rows,
}: {
  rows: { name: string; count: number }[]
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>대학</TableHead>
          <TableHead className="text-right">합격자 수</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length ? (
          rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell className="text-right">{formatNumber(row.count)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="text-center text-muted-foreground">
              해당 구분의 합격자가 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export function MajorRegionalPage() {
  const { dataset } = useDataset()

  if (!dataset) {
    return (
      <PageShell
        title="주요·지역 대학"
        description="주요대학과 지역대학 합격자 수를 비교합니다."
      >
        <EmptyDataset />
      </PageShell>
    )
  }

  const report = universityGroupReport(dataset.rows)

  return (
    <PageShell
      title="주요·지역 대학"
      description="수도권 주요대학과 그 외 지역대학의 최종 합격자 수입니다."
    >
      <MappingNotice mapped={dataset.mapped} />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="주요대학 합격"
          value={formatNumber(report.majorCount)}
          hint="SKY·서성한·중경외시·이공특대 등"
          icon={LandmarkIcon}
        />
        <StatCard
          title="지역대학 합격"
          value={formatNumber(report.regionalCount)}
          hint="주요대학 목록에 없는 대학"
          icon={MapPinnedIcon}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>합격자 수 비교</CardTitle>
          <CardDescription>최종 합격 건수 기준입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryBarChart
            data={[
              { name: "주요대학", value: report.majorCount },
              { name: "지역대학", value: report.regionalCount },
            ]}
            label="합격자 수"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>주요대학</CardTitle>
            <CardDescription>대학별 합격 건수</CardDescription>
          </CardHeader>
          <CardContent>
            <UniversityCountTable rows={report.majorUniversities} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>지역대학</CardTitle>
            <CardDescription>대학별 합격 건수</CardDescription>
          </CardHeader>
          <CardContent>
            <UniversityCountTable rows={report.regionalUniversities} />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
