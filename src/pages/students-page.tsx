import { useMemo, useState } from "react"
import {
  GraduationCapIcon,
  UserRoundXIcon,
  UsersIcon,
  CopyIcon,
} from "lucide-react"

import { DataRowsTable } from "@/components/data-rows-table"
import { EmptyDataset } from "@/components/empty-dataset"
import { MappingNotice } from "@/components/mapping-notice"
import { PageShell } from "@/components/page-shell"
import { Section } from "@/components/section"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDataset } from "@/context/dataset-context"
import { formatNumber, formatPercent, formatScoreDash } from "@/lib/analytics"
import { getString } from "@/lib/dataset"
import {
  overviewReport,
  studentOutcomes,
  type StudentStatus,
} from "@/lib/reports"

const FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "진학", label: "진학" },
  { value: "미진학", label: "미진학" },
  { value: "중복합격", label: "중복합격" },
  { value: "예비", label: "예비" },
  { value: "불합격", label: "불합격" },
]

export function StudentsPage() {
  const { dataset } = useDataset()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [selectedId, setSelectedId] = useState("")

  const students = useMemo(
    () => (dataset ? studentOutcomes(dataset.rows) : []),
    [dataset],
  )
  const overview = dataset ? overviewReport(dataset.rows) : null

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return students.filter((student) => {
      if (filter === "미진학" && student.status === "진학") {
        return false
      }
      if (filter === "중복합격" && !student.duplicatePass) {
        return false
      }
      if (
        filter !== "all" &&
        filter !== "미진학" &&
        filter !== "중복합격" &&
        student.status !== (filter as StudentStatus)
      ) {
        return false
      }
      if (!keyword) {
        return true
      }
      return `${student.id} ${student.name} ${student.enrolledUniversity}`
        .toLowerCase()
        .includes(keyword)
    })
  }, [filter, query, students])

  const selectedRows = useMemo(() => {
    if (!dataset || !selectedId) {
      return []
    }
    return dataset.rows.filter((row) => {
      const id = getString(row, "studentId") || `이름:${getString(row, "studentName")}`
      return id === selectedId
    })
  }, [dataset, selectedId])

  if (!dataset || !overview) {
    return (
      <PageShell
        title="학생별 결과"
        description="학번 기준으로 한 학생의 지원·합격·진학을 모아서 봅니다."
      >
        <EmptyDataset />
      </PageShell>
    )
  }

  return (
    <PageShell
      title="학생별 결과"
      description="담임·진로교사가 명단으로 바로 확인할 수 있게, 한 사람씩 진학 결과를 묶었습니다."
    >
      <MappingNotice mapped={dataset.mapped} />

      <Section title="인원 요약" description="지원 건수가 아니라 학번 기준 인원입니다.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="총원"
            value={formatNumber(overview.people)}
            hint={`1인당 평균 ${overview.avgApplications.toFixed(1)}건 지원`}
            icon={UsersIcon}
          />
          <StatCard
            title="최종 진학"
            value={formatNumber(overview.enrolledPeople)}
            hint={`진학률 ${formatPercent(overview.enrollPeopleRate)}`}
            icon={GraduationCapIcon}
          />
          <StatCard
            title="미진학"
            value={formatNumber(overview.unplacedPeople)}
            hint={`합격 미등록 ${formatNumber(overview.passedUnenrolled)}명`}
            icon={UserRoundXIcon}
          />
          <StatCard
            title="중복합격"
            value={formatNumber(overview.duplicates)}
            hint={`전체 대비 ${formatPercent(overview.duplicateRate)}`}
            icon={CopyIcon}
          />
        </div>
      </Section>

      <Section
        title="학생 명단"
        description="행을 누르면 그 학생의 지원 건이 아래에 펼쳐집니다."
      >
        <div className="flex flex-col gap-3">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="학번, 이름, 진학 대학"
            className="max-w-md"
          />
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList variant="line">
              {FILTERS.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>학번</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>진학 대학</TableHead>
                <TableHead>모집단위</TableHead>
                <TableHead className="text-right">지원</TableHead>
                <TableHead className="text-right">합격</TableHead>
                <TableHead className="text-right">내신</TableHead>
                <TableHead className="text-right">수능 백분위</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length ? (
                filtered.map((student) => (
                  <TableRow
                    key={student.id || student.name}
                    data-selected={selectedId === student.id}
                    className="cursor-pointer data-[selected=true]:bg-muted/50"
                    onClick={() => setSelectedId(student.id)}
                  >
                    <TableCell className="font-medium">{student.id || "—"}</TableCell>
                    <TableCell>{student.name || "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={student.status} />
                    </TableCell>
                    <TableCell>{student.enrolledUniversity || "—"}</TableCell>
                    <TableCell>{student.enrolledMajor || "—"}</TableCell>
                    <TableCell className="text-right">{formatNumber(student.applications)}</TableCell>
                    <TableCell className="text-right">{formatNumber(student.passes)}</TableCell>
                    <TableCell className="text-right">{formatScoreDash(student.gpa)}</TableCell>
                    <TableCell className="text-right">
                      {formatScoreDash(student.percentile, 0)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    조건에 맞는 학생이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground">{formatNumber(filtered.length)}명</p>
      </Section>

      {selectedId ? (
        <Section
          title="선택한 학생의 지원 건"
          description="같은 학번의 모든 지원 결과입니다."
        >
          <DataRowsTable rows={selectedRows} keys={dataset.keys} columns={dataset.columns} />
        </Section>
      ) : null}
    </PageShell>
  )
}
