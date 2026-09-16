import * as XLSX from "xlsx"

import {
  COLUMN_DEFS,
  looksLikeAdmissionHeader,
} from "@/lib/columns"
import type { DataRow, Dataset } from "@/lib/dataset"

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024

function isBlank(value: unknown) {
  return value === null || value === undefined || String(value).trim() === ""
}

function cellToValue(value: string | number | boolean | Date | null | undefined) {
  if (value === undefined) {
    return ""
  }
  return value
}

function resolveHeaderRow(
  table: (string | number | boolean | Date | null)[][],
) {
  const first = (table[0] ?? []).map((cell) => String(cell ?? "").trim())
  if (looksLikeAdmissionHeader(first)) {
    return { headerRow: first, dataStart: 1 }
  }

  const second = (table[1] ?? []).map((cell) => String(cell ?? "").trim())
  if (looksLikeAdmissionHeader(second)) {
    return { headerRow: second, dataStart: 2 }
  }

  return {
    headerRow: first.map((label, index) => label || `열 ${index + 1}`),
    dataStart: 1,
  }
}

export function mapAdmissionColumns(rawHeaders: string[]) {
  const mapped = looksLikeAdmissionHeader(rawHeaders)
  const columns: string[] = []
  const keys: string[] = []

  if (mapped) {
    const count = Math.max(rawHeaders.length, COLUMN_DEFS.length)
    for (let index = 0; index < count; index += 1) {
      const def = COLUMN_DEFS[index]
      if (def) {
        columns.push(def.label)
        keys.push(def.key)
      } else {
        const extra = rawHeaders[index]?.trim() || `열 ${index + 1}`
        columns.push(extra)
        keys.push(`extra_${index}`)
      }
    }
    return { columns, keys, mapped: true }
  }

  const used = new Map<string, number>()
  rawHeaders.forEach((header, index) => {
    const base = header.trim() || `열 ${index + 1}`
    const seen = used.get(base) ?? 0
    used.set(base, seen + 1)
    const label = seen === 0 ? base : `${base} (${seen + 1})`
    columns.push(label)
    keys.push(label)
  })

  return { columns, keys, mapped: false }
}

export async function parseSpreadsheet(file: File): Promise<Dataset> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("파일 크기는 20MB 이하여야 합니다.")
  }

  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true })

  if (!workbook.SheetNames.length) {
    throw new Error("시트 정보를 찾을 수 없습니다.")
  }

  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  if (!sheet) {
    throw new Error("첫 번째 시트를 읽을 수 없습니다.")
  }

  const table = XLSX.utils.sheet_to_json<(string | number | boolean | Date | null)[]>(
    sheet,
    {
      header: 1,
      defval: "",
      raw: false,
      blankrows: false,
    },
  )

  const { headerRow, dataStart } = resolveHeaderRow(table)
  if (!headerRow.length) {
    throw new Error("헤더 행을 찾을 수 없습니다.")
  }

  const { columns, keys, mapped } = mapAdmissionColumns(headerRow)

  const rows: DataRow[] = table
    .slice(dataStart)
    .map((row) => {
      const record: DataRow = {}
      keys.forEach((key, index) => {
        record[key] = cellToValue(row[index])
      })
      return record
    })
    .filter((record) => Object.values(record).some((value) => !isBlank(value)))

  if (!rows.length) {
    throw new Error("데이터 행이 없습니다. 헤더와 데이터가 있는 파일을 올려 주세요.")
  }

  return {
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
    sheetName,
    sheetNames: workbook.SheetNames,
    columns,
    keys,
    rows,
    mapped,
  }
}

export function isSpreadsheetFile(file: File) {
  const name = file.name.toLowerCase()
  return (
    name.endsWith(".xlsx") ||
    name.endsWith(".xls") ||
    name.endsWith(".csv") ||
    file.type.includes("spreadsheet") ||
    file.type === "text/csv"
  )
}
