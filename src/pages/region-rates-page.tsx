import { EmptyDataset } from "@/components/empty-dataset"
import { MappingNotice } from "@/components/mapping-notice"
import { PageShell } from "@/components/page-shell"
import { CategoryBarChart } from "@/components/charts/category-bar-chart"
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
import { formatNumber, formatPercent } from "@/lib/analytics"
import { regionCollegeReport, regionUniversityReport } from "@/lib/reports"

export function RegionRatesPage() {
  const { dataset } = useDataset()

  if (!dataset) {
    return (
      <PageShell
        title="지역별 합격률"
        description="응시(대학 소재) 지역별로 4년제·전문대 합격률을 봅니다."
      >
        <EmptyDataset />
      </PageShell>
    )
  }

  const regionKind = regionCollegeReport(dataset.rows)
  const regionUniversity = regionUniversityReport(dataset.rows).slice(0, 30)

  return (
    <PageShell
      title="지역별 합격률"
      description="지역 컬럼을 응시 지역으로 보고, 4년제와 전문대 합격률을 대학별로 나눕니다."
    >
      <MappingNotice mapped={dataset.mapped} />

      <Card>
        <CardHeader>
          <CardTitle>지역 × 4년제/전문대</CardTitle>
          <CardDescription>같은 지역 안에서도 대학 유형별 합격률이 갈립니다.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-2">
          <CategoryBarChart
            data={regionKind.map((item) => ({
              name: `${item.group} ${item.name}`,
              value: Math.round(item.rate * 1000) / 10,
            }))}
            label="합격률(%)"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>지역</TableHead>
                <TableHead>구분</TableHead>
                <TableHead className="text-right">지원</TableHead>
                <TableHead className="text-right">합격</TableHead>
                <TableHead className="text-right">합격률</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regionKind.map((item) => (
                <TableRow key={`${item.group}-${item.name}`}>
                  <TableCell>{item.group}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.applications)}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.passed)}</TableCell>
                  <TableCell className="text-right">{formatPercent(item.rate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>지역별 대학 합격률</CardTitle>
          <CardDescription>지원 건수가 많은 순으로 최대 30곳을 보여 줍니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>지역</TableHead>
                <TableHead>구분</TableHead>
                <TableHead>대학</TableHead>
                <TableHead className="text-right">지원</TableHead>
                <TableHead className="text-right">합격</TableHead>
                <TableHead className="text-right">합격률</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regionUniversity.map((item) => (
                <TableRow key={`${item.group}-${item.kind}-${item.name}`}>
                  <TableCell>{item.group}</TableCell>
                  <TableCell>{item.kind}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.applications)}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.passed)}</TableCell>
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
