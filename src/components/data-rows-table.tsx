import { formatCell } from "@/lib/analytics"
import type { DataRow } from "@/lib/dataset"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function DataRowsTable({
  rows,
  keys,
  columns,
  hideKeys = [],
}: {
  rows: DataRow[]
  keys: string[]
  columns: string[]
  hideKeys?: string[]
}) {
  const hidden = new Set(hideKeys)
  const visible = keys
    .map((key, index) => ({ key, column: columns[index] ?? key }))
    .filter((column) => !hidden.has(column.key))

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            {visible.map((column) => (
              <TableHead key={column.key}>{column.column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                {visible.map((column) => (
                  <TableCell key={column.key}>{formatCell(row[column.key])}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={visible.length + 1}
                className="h-24 text-center text-muted-foreground"
              >
                해당하는 지원 데이터가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
