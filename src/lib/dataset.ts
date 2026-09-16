import type { ColumnKey } from "@/lib/columns"

export type CellValue = string | number | boolean | Date | null

export type DataRow = Record<string, CellValue>

export type Dataset = {
  fileName: string
  uploadedAt: string
  sheetName: string
  sheetNames: string[]
  columns: string[]
  keys: string[]
  rows: DataRow[]
  mapped: boolean
}

export function getValue(row: DataRow, key: ColumnKey | string): CellValue {
  return row[key] ?? ""
}

export function getString(row: DataRow, key: ColumnKey | string): string {
  const value = getValue(row, key)
  if (value === null || value === undefined) {
    return ""
  }
  if (value instanceof Date) {
    return value.toLocaleDateString("ko-KR")
  }
  return String(value).trim()
}
