import type { ColumnKey } from "@/lib/columns"
import type { DataRow } from "@/lib/dataset"
import { getString } from "@/lib/dataset"

export type ResultKind = "pass" | "fail" | "waitlist" | "unknown" | "blank"

export type EnrollKind = "enrolled" | "notEnrolled" | "unknown" | "blank"

export type CategoryCount = {
  name: string
  count: number
}

export type CategoryRate = {
  name: string
  applications: number
  passed: number
  enrolled: number
  rate: number
}

export type ScoreStats = {
  count: number
  avg: number
  best: number
  cutoff: number
}

function compact(value: string) {
  return value.replace(/\s+/g, "")
}

export function classifyResult(value: unknown): ResultKind {
  const text = compact(String(value ?? ""))
  if (!text) {
    return "blank"
  }
  if (/불합|불합격|탈락|실패|^불$/.test(text)) {
    return "fail"
  }
  if (/예비/.test(text)) {
    return "waitlist"
  }
  if (/합격|충원|추가합|^합$/.test(text) || /^[Oo○●]$/.test(text)) {
    return "pass"
  }
  return "unknown"
}

export function classifyEnroll(value: unknown): EnrollKind {
  const text = compact(String(value ?? ""))
  if (!text) {
    return "blank"
  }
  if (/미등록|포기|환불|X|×/.test(text)) {
    return "notEnrolled"
  }
  if (/등록|진학|^[Yy○]$/.test(text)) {
    return "enrolled"
  }
  return "unknown"
}

export function isFinalPass(row: DataRow) {
  return classifyResult(getString(row, "finalResult")) === "pass"
}

export function isStage1Pass(row: DataRow) {
  return classifyResult(getString(row, "stage1")) === "pass"
}

export function isWaitlist(row: DataRow) {
  return classifyResult(getString(row, "finalResult")) === "waitlist"
}

export function isEnrolled(row: DataRow) {
  return classifyEnroll(getString(row, "enroll")) === "enrolled"
}

export function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  const text = String(value ?? "")
    .replace(/,/g, "")
    .replace(/등급/g, "")
    .trim()
  if (!text) {
    return null
  }
  const matched = text.match(/-?\d+(\.\d+)?/)
  if (!matched) {
    return null
  }
  const parsed = Number(matched[0])
  return Number.isFinite(parsed) ? parsed : null
}

export function parseWaitlistNumber(value: unknown): number | null {
  return parseNumber(value)
}

export function scoreStats(rows: DataRow[], key: ColumnKey): ScoreStats | null {
  const values = rows
    .map((row) => parseNumber(row[key]))
    .filter((value): value is number => value !== null)

  if (!values.length) {
    return null
  }

  const sum = values.reduce((total, value) => total + value, 0)
  return {
    count: values.length,
    avg: sum / values.length,
    best: Math.min(...values),
    cutoff: Math.max(...values),
  }
}

export function groupCount(rows: DataRow[], key: ColumnKey): CategoryCount[] {
  const counts = new Map<string, number>()
  rows.forEach((row) => {
    const name = getString(row, key) || "(빈 값)"
    counts.set(name, (counts.get(name) ?? 0) + 1)
  })
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function groupRates(rows: DataRow[], key: ColumnKey): CategoryRate[] {
  const groups = new Map<string, DataRow[]>()
  rows.forEach((row) => {
    const name = getString(row, key) || "(빈 값)"
    const list = groups.get(name) ?? []
    list.push(row)
    groups.set(name, list)
  })

  return [...groups.entries()]
    .map(([name, list]) => {
      const passed = list.filter(isFinalPass).length
      const enrolled = list.filter(isEnrolled).length
      return {
        name,
        applications: list.length,
        passed,
        enrolled,
        rate: list.length === 0 ? 0 : passed / list.length,
      }
    })
    .sort((a, b) => b.applications - a.applications)
}

export function funnelCounts(rows: DataRow[]) {
  return {
    applications: rows.length,
    stage1: rows.filter(isStage1Pass).length,
    passed: rows.filter(isFinalPass).length,
    enrolled: rows.filter(isEnrolled).length,
    waitlist: rows.filter(
      (row) => classifyResult(getString(row, "finalResult")) === "waitlist",
    ).length,
    failed: rows.filter(
      (row) => classifyResult(getString(row, "finalResult")) === "fail",
    ).length,
    pending: rows.filter((row) => {
      const result = classifyResult(getString(row, "finalResult"))
      return result === "blank" || result === "unknown"
    }).length,
  }
}

export function uniqueValues(rows: DataRow[], key: ColumnKey) {
  return [
    ...new Set(rows.map((row) => getString(row, key)).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "ko"))
}

export function formatNumber(value: number) {
  return value.toLocaleString("ko-KR")
}

export function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "—"
  }
  return `${Math.round(value * 1000) / 10}%`
}

export function formatScore(value: number, digits = 2) {
  return value.toLocaleString("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

export function formatScoreDash(value: number | null | undefined, digits = 2) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—"
  }
  return formatScore(value, digits)
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "—"
  }
  if (value instanceof Date) {
    return value.toLocaleDateString("ko-KR")
  }
  if (typeof value === "number") {
    return formatNumber(value)
  }
  return String(value)
}
