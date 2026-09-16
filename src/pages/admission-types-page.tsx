import { UsersIcon, CopyIcon, PercentIcon, ShieldCheckIcon } from "lucide-react"

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
import { formatNumber, formatPercent } from "@/lib/analytics"
import {
  admissionTypeReport,
  duplicatePassCount,
  minScoreReport,
  uniqueStudentIds,
  type RateRow,
} from "@/lib/reports"

function RateTable({ rows }: { rows: RateRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>구분</TableHead>
          <TableHead>전형</TableHead>
          <TableHead className="text-right">지원</TableHead>
          <TableHead className="text-right">합격</TableHead>
          <TableHead className="text-right">등록</TableHead>
          <TableHead className="text-right">합격률</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={`${row.group}-${row.name}`} className={row.name === "소계" ? "font-medium" : undefined}>
            <TableCell>{row.group}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell className="text-right">{formatNumber(row.applications)}</TableCell>
            <TableCell className="text-right">{formatNumber(row.passed)}</TableCell>
            <TableCell className="text-right">{formatNumber(row.enrolled)}</TableCell>
            <TableCell className="text-right">{formatPercent(row.rate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function AdmissionTypesPage() {
  const { dataset } = useDataset()

  if (!dataset) {
    return (
      <PageShell
        title="전형별 합격률"
        description="4년제는 종합·교과·논술·실기, 전문대는 수시 1·2차로 나눠 봅니다."
      >
        <EmptyDataset />
      </PageShell>
    )
  }

  const people = uniqueStudentIds(dataset.rows)
  const duplicates = duplicatePassCount(dataset.rows)
  const minScore = minScoreReport(dataset.rows)
  const report = admissionTypeReport(dataset.rows)

  return (
    <PageShell
      title="전형별 합격률"
      description="4년제(종합, 교과, 논술, 실기)와 전문대(수시 1차, 2차) 합격률, 중복합격, 수능최저를 함께 집계합니다."
    >
      <MappingNotice mapped={dataset.mapped} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="총 인원"
          value={formatNumber(people)}
          hint={`학번 기준 · 지원 ${formatNumber(dataset.rows.length)}건`}
          icon={UsersIcon}
        />
        <StatCard
          title="중복 합격자"
          value={formatNumber(duplicates)}
          hint={`비율 ${formatPercent(people ? duplicates / people : 0)}`}
          icon={CopyIcon}
        />
        <StatCard
          title="수능최저 필요 인원"
          value={formatNumber(minScore.neededPeople)}
          hint={`최저 있는 지원 ${formatNumber(minScore.neededApplications)}건`}
          icon={ShieldCheckIcon}
        />
        <StatCard
          title="수능 최저 달성률"
          value={formatPercent(minScore.rate)}
          hint="1단계 또는 최종 합격으로 추정"
          icon={PercentIcon}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>4년제</CardTitle>
            <CardDescription>종합, 교과, 논술, 실기 소계</CardDescription>
          </CardHeader>
          <CardContent>
            <RateTable rows={report.fourYear} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>전문대</CardTitle>
            <CardDescription>수시 1차, 수시 2차 소계</CardDescription>
          </CardHeader>
          <CardContent>
            <RateTable rows={report.junior} />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
