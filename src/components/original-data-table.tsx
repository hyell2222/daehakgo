import { useMemo, useState } from "react"

import { Input } from "@/components/ui/input"
import { useDataset } from "@/context/dataset-context"
import { formatCell, formatNumber } from "@/lib/analytics"
import {
  COLUMN_ACCENT_CLASS,
  COLUMN_GROUP_META,
  consecutiveSpans,
  excelColumnsForDataset,
  type ColumnGroupId,
  type ExcelColumnView,
} from "@/lib/columns"
import { cn } from "@/lib/utils"

function groupClass(group: ColumnGroupId, kind: "header" | "sub" | "cell") {
  const meta = COLUMN_GROUP_META[group]
  if (kind === "header") {
    return meta.headerClass
  }
  if (kind === "sub") {
    return meta.subHeaderClass
  }
  return meta.cellClass
}

function headClass(column: ExcelColumnView) {
  if (column.accent) {
    return COLUMN_ACCENT_CLASS[column.accent].head
  }
  return groupClass(column.group, "sub")
}

function cellClass(column: ExcelColumnView) {
  if (column.accent) {
    return COLUMN_ACCENT_CLASS[column.accent].cell
  }
  return groupClass(column.group, "cell")
}

function ExcelHeader({ columns }: { columns: ExcelColumnView[] }) {
  const groups = consecutiveSpans(columns, (column) => column.group)
  const subgroups = consecutiveSpans(
    columns,
    (column) => `${column.group}::${column.subgroup}`,
  )

  return (
    <thead className="sticky top-0 z-30">
      <tr>
        <th
          rowSpan={3}
          className="w-12 min-w-12 border-r border-b bg-zinc-100 px-2 text-center text-xs font-semibold text-zinc-600"
        >
          #
        </th>
        {groups.map((span, index) => {
          const group = span.key as ColumnGroupId
          return (
            <th
              key={`group-${group}-${index}`}
              colSpan={span.count}
              className={cn(
                "border-b border-r px-0 py-1.5 text-left text-sm font-semibold tracking-tight",
                groupClass(group, "header"),
              )}
            >
              <span className="inline-block px-3">{COLUMN_GROUP_META[group].title}</span>
            </th>
          )
        })}
      </tr>
      <tr>
        {subgroups.map((span, index) => {
          const [group, subgroup] = span.key.split("::") as [ColumnGroupId, string]
          return (
            <th
              key={`sub-${span.key}-${index}`}
              colSpan={span.count}
              className={cn(
                "border-b border-r px-0 py-1 text-left text-[11px] font-medium",
                groupClass(group, "sub"),
              )}
            >
              <span className="inline-block px-3">{subgroup || "\u00a0"}</span>
            </th>
          )
        })}
      </tr>
      <tr>
        {columns.map((column) => (
          <th
            key={`col-${column.key}`}
            className={cn(
              "border-b border-r px-2 py-1.5 text-center text-[11px] font-semibold whitespace-nowrap",
              headClass(column),
            )}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export function OriginalDataTable() {
  const { dataset } = useDataset()
  const [query, setQuery] = useState("")

  const columns = useMemo(
    () => (dataset ? excelColumnsForDataset(dataset.keys) : []),
    [dataset],
  )

  const filteredRows = useMemo(() => {
    if (!dataset) {
      return []
    }
    const keyword = query.trim().toLowerCase()
    if (!keyword) {
      return dataset.rows
    }
    return dataset.rows.filter((row) =>
      columns.some((column) =>
        String(row[column.key] ?? "")
          .toLowerCase()
          .includes(keyword),
      ),
    )
  }, [columns, dataset, query])

  if (!dataset || !columns.length) {
    return null
  }

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="학번, 이름, 대학, 전형명으로 검색"
          className="max-w-sm"
        />
        <p className="text-sm text-muted-foreground">
          {formatNumber(filteredRows.length)}행 · {formatNumber(columns.length)}열
        </p>
      </div>

      <div className="max-h-[min(72vh,820px)] min-w-0 overflow-auto rounded-xl border">
        <table className="w-max min-w-full border-separate border-spacing-0 text-xs">
          <ExcelHeader columns={columns} />
          <tbody>
            {filteredRows.length ? (
              filteredRows.map((row, index) => (
                <tr key={index} className="hover:brightness-[0.97]">
                  <td className="border-b border-r bg-zinc-50 px-2 py-1.5 text-center text-muted-foreground">
                    {index + 1}
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "border-b border-r px-2 py-1.5 whitespace-nowrap",
                        cellClass(column),
                      )}
                    >
                      {formatCell(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
