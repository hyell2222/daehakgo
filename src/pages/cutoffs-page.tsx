import { useMemo, useState } from "react"
import { SchoolIcon } from "lucide-react"

import { EmptyDataset } from "@/components/empty-dataset"
import { MappingNotice } from "@/components/mapping-notice"
import { PageShell } from "@/components/page-shell"
import { Section } from "@/components/section"
import { StatCard } from "@/components/stat-card"
import { Input } from "@/components/ui/input"
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
  formatScoreDash,
} from "@/lib/analytics"
import { cutoffReport } from "@/lib/reports"

export function CutoffsPage() {
  const { dataset } = useDataset()
  const [query, setQuery] = useState("")

  const rows = useMemo(() => (dataset ? cutoffReport(dataset.rows) : []), [dataset])
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) {
      return rows
    }
    return rows.filter((row) =>
      `${row.university} ${row.admissionName} ${row.typeLabel}`.toLowerCase().includes(keyword),
    )
  }, [query, rows])

  const withPassers = filtered.filter((row) => row.passed > 0)

  if (!dataset) {
    return (
      <PageShell
        title="합격선"
        description="대학·전형별로 합격자의 내신·수능 분포로 올해 컷을 가늠합니다."
      >
        <EmptyDataset />
      </PageShell>
    )
  }

  return (
    <PageShell
      title="합격선"
      description="같은 대학·전형에 붙은 학생의 전과목 내신과 국어·수학 백분위 평균입니다. 내신은 숫자가 낮을수록 좋은 성적입니다."
    >
      <MappingNotice mapped={dataset.mapped} />

      <Section title="읽는 법" description="표본이 적은 전형은 참고용으로만 보세요.">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="대학·전형"
            value={formatNumber(rows.length)}
            hint={`합격자 있는 전형 ${formatNumber(withPassers.length)}`}
            icon={SchoolIcon}
          />
          <div className="rounded-xl border p-4 text-sm leading-6 sm:col-span-2">
            <p>
              <strong>내신 최고</strong>는 합격자 중 전과목 평균이 가장 좋은(숫자가 작은)
              성적입니다. <strong>내신 컷</strong>은 합격자 중 가장 아슬한(숫자가 큰)
              성적입니다. 수능 백분위는 국어·수학 백분위의 평균입니다.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="대학 × 전형 합격선"
        description="내신 최고는 합격자 중 가장 좋은 성적, 컷은 합격자 중 가장 아슬한 성적입니다."
      >
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="대학, 전형명"
          className="max-w-md"
        />
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>대학</TableHead>
                <TableHead>전형</TableHead>
                <TableHead>구분</TableHead>
                <TableHead className="text-right">지원</TableHead>
                <TableHead className="text-right">합격</TableHead>
                <TableHead className="text-right">등록</TableHead>
                <TableHead className="text-right">합격률</TableHead>
                <TableHead className="text-right">내신 평균</TableHead>
                <TableHead className="text-right">내신 최고</TableHead>
                <TableHead className="text-right">내신 컷</TableHead>
                <TableHead className="text-right">수능 백분위</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length ? (
                filtered.map((row) => (
                  <TableRow key={`${row.university}-${row.admissionName}-${row.kind}`}>
                    <TableCell className="font-medium">{row.university}</TableCell>
                    <TableCell>
                      {row.admissionName}
                      <span className="ml-1 text-muted-foreground">({row.typeLabel})</span>
                    </TableCell>
                    <TableCell>{row.kind}</TableCell>
                    <TableCell className="text-right">{formatNumber(row.applications)}</TableCell>
                    <TableCell className="text-right">{formatNumber(row.passed)}</TableCell>
                    <TableCell className="text-right">{formatNumber(row.enrolled)}</TableCell>
                    <TableCell className="text-right">{formatPercent(row.rate)}</TableCell>
                    <TableCell className="text-right">{formatScoreDash(row.gpaAvg)}</TableCell>
                    <TableCell className="text-right">{formatScoreDash(row.gpaBest)}</TableCell>
                    <TableCell className="text-right">{formatScoreDash(row.gpaCutoff)}</TableCell>
                    <TableCell className="text-right">
                      {formatScoreDash(row.percentileAvg, 0)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Section>
    </PageShell>
  )
}
