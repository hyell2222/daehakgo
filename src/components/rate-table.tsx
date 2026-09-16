import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber, formatPercent } from "@/lib/analytics"
import type { RateRow } from "@/lib/reports"

export function RateTable({
  rows,
  showGroup = true,
  groupHeader = "구분",
  nameHeader = "전형",
}: {
  rows: RateRow[]
  showGroup?: boolean
  groupHeader?: string
  nameHeader?: string
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showGroup ? <TableHead>{groupHeader}</TableHead> : null}
          <TableHead>{nameHeader}</TableHead>
          <TableHead className="text-right">인원</TableHead>
          <TableHead className="text-right">지원</TableHead>
          <TableHead className="text-right">1단계</TableHead>
          <TableHead className="text-right">합격</TableHead>
          <TableHead className="text-right">예비</TableHead>
          <TableHead className="text-right">등록</TableHead>
          <TableHead className="text-right">합격률</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={`${row.group}-${row.name}`}
            className={row.name === "소계" ? "font-medium" : undefined}
          >
            {showGroup ? <TableCell>{row.group}</TableCell> : null}
            <TableCell>{row.name}</TableCell>
            <TableCell className="text-right">{formatNumber(row.people)}</TableCell>
            <TableCell className="text-right">{formatNumber(row.applications)}</TableCell>
            <TableCell className="text-right">{formatNumber(row.stage1)}</TableCell>
            <TableCell className="text-right">{formatNumber(row.passed)}</TableCell>
            <TableCell className="text-right">{formatNumber(row.waitlist)}</TableCell>
            <TableCell className="text-right">{formatNumber(row.enrolled)}</TableCell>
            <TableCell className="text-right">{formatPercent(row.rate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
