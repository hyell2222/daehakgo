import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
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
import { formatCell, formatNumber } from "@/lib/analytics"

const PAGE_SIZE = 50

export function OriginalDataTable() {
  const { dataset } = useDataset()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(0)

  const filteredRows = useMemo(() => {
    if (!dataset) {
      return []
    }
    const keyword = query.trim().toLowerCase()
    if (!keyword) {
      return dataset.rows
    }
    return dataset.rows.filter((row) =>
      dataset.keys.some((key) =>
        String(row[key] ?? "")
          .toLowerCase()
          .includes(keyword),
      ),
    )
  }, [dataset, query])

  if (!dataset) {
    return null
  }

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const visibleRows = filteredRows.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(0)
          }}
          placeholder="원본 표에서 값으로 검색"
          className="max-w-sm"
        />
        <p className="text-sm text-muted-foreground">
          {formatNumber(filteredRows.length)}행 · {currentPage + 1} / {pageCount} 페이지
        </p>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 0}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
          >
            이전
          </Button>
          <Button
            variant="outline"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage((value) => value + 1)}
          >
            다음
          </Button>
        </div>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              {dataset.columns.map((column, index) => (
                <TableHead key={`${dataset.keys[index]}-${index}`}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.length ? (
              visibleRows.map((row, index) => (
                <TableRow key={`${currentPage}-${index}`}>
                  <TableCell className="text-muted-foreground">
                    {currentPage * PAGE_SIZE + index + 1}
                  </TableCell>
                  {dataset.keys.map((key) => (
                    <TableCell key={key}>{formatCell(row[key])}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={dataset.columns.length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
