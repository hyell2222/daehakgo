export type ColumnKey =
  | "studentId"
  | "studentName"
  | "region"
  | "university"
  | "period"
  | "admissionName"
  | "track"
  | "major"
  | "stage1"
  | "finalResult"
  | "waitlist"
  | "enroll"
  | "note"
  | "admissionKind"
  | "admissionDate"
  | "stage1Date"
  | "finalDate"
  | "minScoreRule"
  | "quota"
  | "admissionCategory"
  | "admissionMethod"
  | "gpaAll"
  | "gpaKorMathEngSocSci"
  | "gpaKorMathEngSoc"
  | "gpaKorEngSci"
  | "gpaKorMathEng"
  | "gpaKorean"
  | "gpaMath"
  | "gpaEnglish"
  | "gpaSocial"
  | "gpaScience"
  | "gpaCompare"
  | "koreanSection"
  | "koreanStandard"
  | "koreanPercentile"
  | "koreanGrade"
  | "mathSection"
  | "mathStandard"
  | "mathPercentile"
  | "mathGrade"
  | "englishGrade"
  | "inquirySection"
  | "inquiry1Subject"
  | "inquiry1Standard"
  | "inquiry1Percentile"
  | "inquiry1Grade"
  | "inquiry2Subject"
  | "inquiry2Standard"
  | "inquiry2Percentile"
  | "inquiry2Grade"
  | "historyGrade"
  | "inquiry3Subject"
  | "inquiry3Grade"

export type ColumnGroupId = "student" | "application" | "record" | "csat"

export type ColumnAccent = "stage1" | "final" | "waitlist" | "enroll" | "note"

export type ColumnDef = {
  key: ColumnKey
  header: string
  label: string
  group: ColumnGroupId
  subgroup: string
  accent?: ColumnAccent
}

export const COLUMN_GROUP_META: Record<
  ColumnGroupId,
  { title: string; headerClass: string; subHeaderClass: string; cellClass: string }
> = {
  student: {
    title: "학생",
    headerClass: "bg-zinc-200 text-zinc-900",
    subHeaderClass: "bg-zinc-100 text-zinc-800",
    cellClass: "bg-white",
  },
  application: {
    title: "수시 지원 상황 및 결과",
    headerClass: "bg-[#5f9ea8] text-white",
    subHeaderClass: "bg-[#d5ecee] text-zinc-800",
    cellClass: "bg-[#f3fafb]",
  },
  record: {
    title: "학생부",
    headerClass: "bg-[#6faf6f] text-white",
    subHeaderClass: "bg-[#d8efd8] text-zinc-800",
    cellClass: "bg-[#f4fbf4]",
  },
  csat: {
    title: "대학수학능력시험 성적",
    headerClass: "bg-[#c9b43a] text-zinc-900",
    subHeaderClass: "bg-[#f3e89a] text-zinc-800",
    cellClass: "bg-[#fbf8e8]",
  },
}

export const COLUMN_ACCENT_CLASS: Record<ColumnAccent, { head: string; cell: string }> = {
  stage1: { head: "bg-[#8fdde4] text-zinc-900", cell: "bg-[#e7f8fa]" },
  final: { head: "bg-[#cbb6ea] text-zinc-900", cell: "bg-[#f3ecfb]" },
  waitlist: { head: "bg-[#f1e06b] text-zinc-900", cell: "bg-[#fbf6d4]" },
  enroll: { head: "bg-[#b6e3a8] text-zinc-900", cell: "bg-[#eef8ea]" },
  note: { head: "bg-[#d4d4d4] text-zinc-900", cell: "bg-[#f3f3f3]" },
}

const GPA_SUBGROUP = "교과영역(학기통합 평균등급)"
const COMPARE_SUBGROUP = "합격에 영향을 준 내용을 입력해 주십시요."

/**
 * 실제 엑셀 3행 헤더 순서. 중복 헤더(표준점수/백분위/등급)는 위치 기준으로 구분합니다.
 */
export const COLUMN_DEFS: ColumnDef[] = [
  { key: "studentId", header: "학번", label: "학번", group: "student", subgroup: "" },
  { key: "studentName", header: "이름", label: "이름", group: "student", subgroup: "" },
  { key: "region", header: "지역", label: "지역", group: "application", subgroup: "" },
  { key: "university", header: "대학", label: "대학", group: "application", subgroup: "" },
  { key: "period", header: "지원시기", label: "지원시기", group: "application", subgroup: "" },
  { key: "admissionName", header: "전형명", label: "전형명", group: "application", subgroup: "" },
  { key: "track", header: "계열", label: "계열", group: "application", subgroup: "" },
  { key: "major", header: "모집단위", label: "모집단위", group: "application", subgroup: "" },
  { key: "stage1", header: "1단계", label: "1단계", group: "application", subgroup: "", accent: "stage1" },
  { key: "finalResult", header: "최종", label: "최종", group: "application", subgroup: "", accent: "final" },
  { key: "waitlist", header: "예비", label: "예비", group: "application", subgroup: "", accent: "waitlist" },
  { key: "enroll", header: "등록", label: "등록", group: "application", subgroup: "", accent: "enroll" },
  { key: "note", header: "비고", label: "비고", group: "application", subgroup: "", accent: "note" },
  { key: "admissionKind", header: "전형종류", label: "전형종류", group: "application", subgroup: "" },
  { key: "admissionDate", header: "전형일자", label: "전형일자", group: "application", subgroup: "" },
  { key: "stage1Date", header: "1단계발표일", label: "1단계발표일", group: "application", subgroup: "" },
  { key: "finalDate", header: "최종발표일", label: "최종발표일", group: "application", subgroup: "" },
  { key: "minScoreRule", header: "최저학력기준", label: "최저학력기준", group: "application", subgroup: "" },
  { key: "quota", header: "모집인원", label: "모집인원", group: "application", subgroup: "" },
  { key: "admissionCategory", header: "전형분류", label: "전형분류", group: "application", subgroup: "" },
  { key: "admissionMethod", header: "전형방법", label: "전형방법", group: "application", subgroup: "" },
  { key: "gpaAll", header: "전과목", label: "전과목", group: "record", subgroup: GPA_SUBGROUP },
  { key: "gpaKorMathEngSocSci", header: "국수영사과", label: "국수영사과", group: "record", subgroup: GPA_SUBGROUP },
  { key: "gpaKorMathEngSoc", header: "국수영사", label: "국수영사", group: "record", subgroup: GPA_SUBGROUP },
  { key: "gpaKorEngSci", header: "국수영과", label: "국수영과", group: "record", subgroup: GPA_SUBGROUP },
  { key: "gpaKorMathEng", header: "국수영", label: "국수영", group: "record", subgroup: GPA_SUBGROUP },
  { key: "gpaKorean", header: "국어", label: "국어", group: "record", subgroup: GPA_SUBGROUP },
  { key: "gpaMath", header: "수학", label: "수학", group: "record", subgroup: GPA_SUBGROUP },
  { key: "gpaEnglish", header: "영어", label: "영어", group: "record", subgroup: GPA_SUBGROUP },
  { key: "gpaSocial", header: "사회", label: "사회", group: "record", subgroup: GPA_SUBGROUP },
  { key: "gpaScience", header: "과학", label: "과학", group: "record", subgroup: GPA_SUBGROUP },
  { key: "gpaCompare", header: "비교과", label: "비교과", group: "record", subgroup: COMPARE_SUBGROUP },
  { key: "koreanSection", header: "국어영역", label: "국어영역", group: "csat", subgroup: "국어" },
  { key: "koreanStandard", header: "표준점수", label: "국어 표준점수", group: "csat", subgroup: "국어" },
  { key: "koreanPercentile", header: "백분위", label: "국어 백분위", group: "csat", subgroup: "국어" },
  { key: "koreanGrade", header: "등급", label: "국어 등급", group: "csat", subgroup: "국어" },
  { key: "mathSection", header: "수학영역", label: "수학영역", group: "csat", subgroup: "수학" },
  { key: "mathStandard", header: "표준점수", label: "수학 표준점수", group: "csat", subgroup: "수학" },
  { key: "mathPercentile", header: "백분위", label: "수학 백분위", group: "csat", subgroup: "수학" },
  { key: "mathGrade", header: "등급", label: "수학 등급", group: "csat", subgroup: "수학" },
  { key: "englishGrade", header: "등급", label: "영어 등급", group: "csat", subgroup: "영어" },
  { key: "inquirySection", header: "탐구영역", label: "탐구영역", group: "csat", subgroup: "선택1" },
  { key: "inquiry1Subject", header: "과목명", label: "선택1 과목", group: "csat", subgroup: "선택1" },
  { key: "inquiry1Standard", header: "표준점수", label: "선택1 표준점수", group: "csat", subgroup: "선택1" },
  { key: "inquiry1Percentile", header: "백분위", label: "선택1 백분위", group: "csat", subgroup: "선택1" },
  { key: "inquiry1Grade", header: "등급", label: "선택1 등급", group: "csat", subgroup: "선택1" },
  { key: "inquiry2Subject", header: "과목명", label: "선택2 과목", group: "csat", subgroup: "선택2" },
  { key: "inquiry2Standard", header: "표준점수", label: "선택2 표준점수", group: "csat", subgroup: "선택2" },
  { key: "inquiry2Percentile", header: "백분위", label: "선택2 백분위", group: "csat", subgroup: "선택2" },
  { key: "inquiry2Grade", header: "등급", label: "선택2 등급", group: "csat", subgroup: "선택2" },
  { key: "historyGrade", header: "등급", label: "한국사 등급", group: "csat", subgroup: "한국사" },
  { key: "inquiry3Subject", header: "과목명", label: "제2외국어 과목", group: "csat", subgroup: "제2외국어" },
  { key: "inquiry3Grade", header: "등급", label: "제2외국어 등급", group: "csat", subgroup: "제2외국어" },
]

export const COLUMN_LABEL: Record<ColumnKey, string> = Object.fromEntries(
  COLUMN_DEFS.map((column) => [column.key, column.label]),
) as Record<ColumnKey, string>

export const COLUMN_BY_KEY = Object.fromEntries(
  COLUMN_DEFS.map((column) => [column.key, column]),
) as Record<ColumnKey, ColumnDef>

export function normalizeHeader(value: string) {
  return value.replace(/\s+/g, "")
}

function isNameHeader(value: string) {
  return value === "이름" || value === "성명"
}

function isRegionHeader(value: string) {
  return value === "지역" || value.startsWith("지역(") || value.startsWith("지역（")
}

export function looksLikeAdmissionHeader(headers: string[]) {
  const normalized = headers.map(normalizeHeader)
  const hasCore = normalized.includes("모집단위") && normalized.includes("최종")
  const withStudent = normalized[0] === "학번" && isNameHeader(normalized[1] ?? "")
  const withoutStudent = isRegionHeader(normalized[0] ?? "") && normalized[1] === "대학"
  return hasCore && (withStudent || withoutStudent)
}

export function columnDefsForHeaders(headers: string[]) {
  const normalized = headers.map(normalizeHeader)
  if (normalized[0] === "학번") {
    return COLUMN_DEFS
  }
  return COLUMN_DEFS.filter((column) => column.key !== "studentId" && column.key !== "studentName")
}

export type ExcelColumnView = {
  key: string
  header: string
  group: ColumnGroupId
  subgroup: string
  accent?: ColumnAccent
}

export function isKnownColumnKey(key: string): key is ColumnKey {
  return key in COLUMN_BY_KEY
}

export function excelColumnsForDataset(keys: string[]): ExcelColumnView[] {
  return keys.filter(isKnownColumnKey).map((key) => {
    const def = COLUMN_BY_KEY[key]
    return {
      key,
      header: def.header,
      group: def.group,
      subgroup: def.subgroup,
      accent: def.accent,
    }
  })
}

export function consecutiveSpans<T>(items: T[], keyOf: (item: T) => string) {
  const spans: { key: string; count: number }[] = []
  items.forEach((item) => {
    const key = keyOf(item)
    const last = spans[spans.length - 1]
    if (last && last.key === key) {
      last.count += 1
    } else {
      spans.push({ key, count: 1 })
    }
  })
  return spans
}
