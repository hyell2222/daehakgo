import { useMemo, useState } from "react"
import { PercentIcon, UserPlusIcon, XCircleIcon } from "lucide-react"

import { CategoryBarChart } from "@/components/charts/category-bar-chart"
import { EmptyDataset } from "@/components/empty-dataset"
import { FilterSelect } from "@/components/filter-select"
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
import { getString } from "@/lib/dataset"
import {
  formatNumber,
  formatPercent,
  formatScore,
  funnelCounts,
  groupRates,
  isFinalPass,
  scoreStats,
  uniqueValues,
} from "@/lib/analytics"

export function AdmissionPage() {
  const { dataset } = useDataset()
  const [university, setUniversity] = useState("")
  const [major, setMajor] = useState("")
  const [admissionName, setAdmissionName] = useState("")

  const filteredRows = useMemo(() => {
    if (!dataset) {
      return []
    }
    return dataset.rows.filter((row) => {
      if (university && getString(row, "university") !== university) {
        return false
      }
      if (major && getString(row, "major") !== major) {
        return false
      }
      if (admissionName && getString(row, "admissionName") !== admissionName) {
        return false
      }
      return true
    })
  }, [admissionName, dataset, major, university])

  if (!dataset) {
    return (
      <PageShell
        title="합격률"
        description="최종·등록 결과를 기준으로 합격률을 계산합니다."
      >
        <EmptyDataset description="엑셀을 올리면 합격률 차트를 그릴 수 있습니다." />
      </PageShell>
    )
  }

  const funnel = funnelCounts(filteredRows)
  const passRate = funnel.applications ? funnel.passed / funnel.applications : 0
  const enrollRate = funnel.passed ? funnel.enrolled / funnel.passed : 0
  const passedRows = filteredRows.filter(isFinalPass)
  const gpa = scoreStats(passedRows, "gpaAll")
  const korean = scoreStats(passedRows, "koreanPercentile")
  const math = scoreStats(passedRows, "mathPercentile")
  const categoryRates = groupRates(filteredRows, "admissionCategory")
  const universityRates = groupRates(filteredRows, "university").slice(0, 12)
  const trackRates = groupRates(filteredRows, "track")

  return (
    <PageShell
      title="합격률"
      description="최종·등록 결과와 합격자 내신·수능 분포를 함께 봅니다. 대학·모집단위로 좁혀 볼 수 있습니다."
    >
      <MappingNotice mapped={dataset.mapped} />

      <div className="flex flex-wrap gap-3 rounded-xl border bg-card p-4">
        <FilterSelect
          label="대학"
          value={university}
          onChange={setUniversity}
          options={uniqueValues(dataset.rows, "university")}
        />
        <FilterSelect
          label="모집단위"
          value={major}
          onChange={setMajor}
          options={uniqueValues(dataset.rows, "major")}
        />
        <FilterSelect
          label="전형명"
          value={admissionName}
          onChange={setAdmissionName}
          options={uniqueValues(dataset.rows, "admissionName")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="전체 합격률"
          value={formatPercent(passRate)}
          hint={`${formatNumber(funnel.passed)} / ${formatNumber(funnel.applications)}`}
          icon={PercentIcon}
        />
        <StatCard
          title="합격자 등록률"
          value={formatPercent(enrollRate)}
          hint={`${formatNumber(funnel.enrolled)}명 등록`}
          icon={UserPlusIcon}
        />
        <StatCard
          title="불합격"
          value={formatNumber(funnel.failed)}
          icon={XCircleIcon}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>합격자 평균 내신</CardTitle>
            <CardDescription>전과목 · 숫자가 낮을수록 좋은 성적</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{gpa ? formatScore(gpa.avg) : "—"}</p>
            {gpa ? (
              <p className="mt-1 text-xs text-muted-foreground">
                가장 좋은 {formatScore(gpa.best)} · 가장 높은 {formatScore(gpa.cutoff)}
              </p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>국어 백분위</CardTitle>
            <CardDescription>합격자 평균</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {korean ? formatScore(korean.avg, 0) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>수학 백분위</CardTitle>
            <CardDescription>합격자 평균</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{math ? formatScore(math.avg, 0) : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>전형분류 합격률</CardTitle>
            <CardDescription>교과·종합·논술·정시 비교</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBarChart
              data={categoryRates.map((item) => ({
                name: item.name,
                value: Math.round(item.rate * 1000) / 10,
              }))}
              label="합격률(%)"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>계열 합격률</CardTitle>
            <CardDescription>인문·자연 등</CardDescription>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>대학별 합격·등록</CardTitle>
          <CardDescription>지원 건수가 많은 순입니다.</CardDescription>
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
