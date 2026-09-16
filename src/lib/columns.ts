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
  | "mathGradeExtra"
  | "inquirySection"
  | "inquiry1Subject"
  | "inquiry1Standard"
  | "inquiry1Percentile"
  | "inquiry1Grade"
  | "inquiry2Subject"
  | "inquiry2Standard"
  | "inquiry2Percentile"
  | "inquiry2Grade"
  | "inquiry3Subject"
  | "inquiry3Grade"

export type ColumnDef = {
  key: ColumnKey
  header: string
  label: string
}

/**
 * 엑셀 첫 행 컬럼 순서. 중복 헤더(표준점수/백분위/등급 등)는 위치 기준으로 구분합니다.
 */
export const COLUMN_DEFS: ColumnDef[] = [
  { key: "studentId", header: "학번", label: "학번" },
  { key: "studentName", header: "이름", label: "이름" },
  { key: "region", header: "지역", label: "지역" },
  { key: "university", header: "대학", label: "대학" },
  { key: "period", header: "지원시기", label: "지원시기" },
  { key: "admissionName", header: "전형명", label: "전형명" },
  { key: "track", header: "계열", label: "계열" },
  { key: "major", header: "모집단위", label: "모집단위" },
  { key: "stage1", header: "1단계", label: "1단계" },
  { key: "finalResult", header: "최종", label: "최종" },
  { key: "waitlist", header: "예비", label: "예비" },
  { key: "enroll", header: "등록", label: "등록" },
  { key: "note", header: "비고", label: "비고" },
  { key: "admissionKind", header: "전형종류", label: "전형종류" },
  { key: "admissionDate", header: "전형일자", label: "전형일자" },
  { key: "stage1Date", header: "1단계발표일", label: "1단계발표일" },
  { key: "finalDate", header: "최종발표일", label: "최종발표일" },
  { key: "minScoreRule", header: "최저학력기준", label: "최저학력기준" },
  { key: "quota", header: "모집인원", label: "모집인원" },
  { key: "admissionCategory", header: "전형분류", label: "전형분류" },
  { key: "admissionMethod", header: "전형방법", label: "전형방법" },
  { key: "gpaAll", header: "전과목", label: "전과목" },
  { key: "gpaKorMathEngSocSci", header: "국수영사과", label: "국수영사과" },
  { key: "gpaKorMathEngSoc", header: "국수영사", label: "국수영사" },
  { key: "gpaKorEngSci", header: "국영과", label: "국영과" },
  { key: "gpaKorMathEng", header: "국수영", label: "국수영" },
  { key: "gpaKorean", header: "국어", label: "국어 내신" },
  { key: "gpaMath", header: "수학", label: "수학 내신" },
  { key: "gpaEnglish", header: "영어", label: "영어 내신" },
  { key: "gpaSocial", header: "사회", label: "사회 내신" },
  { key: "gpaScience", header: "과학", label: "과학 내신" },
  { key: "gpaCompare", header: "비교과", label: "비교과" },
  { key: "koreanSection", header: "국어영역", label: "국어영역" },
  { key: "koreanStandard", header: "표준점수", label: "국어 표준점수" },
  { key: "koreanPercentile", header: "백분위", label: "국어 백분위" },
  { key: "koreanGrade", header: "등급", label: "국어 등급" },
  { key: "mathSection", header: "수학영역", label: "수학영역" },
  { key: "mathStandard", header: "표준점수", label: "수학 표준점수" },
  { key: "mathPercentile", header: "백분위", label: "수학 백분위" },
  { key: "mathGrade", header: "등급", label: "수학 등급" },
  { key: "mathGradeExtra", header: "등급", label: "수학 추가등급" },
  { key: "inquirySection", header: "탐구영역", label: "탐구영역" },
  { key: "inquiry1Subject", header: "과목명", label: "탐구1 과목" },
  { key: "inquiry1Standard", header: "표준점수", label: "탐구1 표준점수" },
  { key: "inquiry1Percentile", header: "백분위", label: "탐구1 백분위" },
  { key: "inquiry1Grade", header: "등급", label: "탐구1 등급" },
  { key: "inquiry2Subject", header: "과목명", label: "탐구2 과목" },
  { key: "inquiry2Standard", header: "표준점수", label: "탐구2 표준점수" },
  { key: "inquiry2Percentile", header: "백분위", label: "탐구2 백분위" },
  { key: "inquiry2Grade", header: "등급", label: "탐구2 등급" },
  { key: "inquiry3Subject", header: "과목명", label: "탐구3 과목" },
  { key: "inquiry3Grade", header: "등급", label: "탐구3 등급" },
]

export const COLUMN_LABEL: Record<ColumnKey, string> = Object.fromEntries(
  COLUMN_DEFS.map((column) => [column.key, column.label]),
) as Record<ColumnKey, string>

export function normalizeHeader(value: string) {
  return value
    .replace(/\s+/g, "")
}

export function looksLikeAdmissionHeader(headers: string[]) {
  const normalized = headers.map(normalizeHeader)
  const hasCore = normalized.includes("모집단위") && normalized.includes("최종")
  const withStudent =
    normalized[0] === "학번" && (normalized[1] === "이름" || normalized[1] === "성명")
  const withoutStudent = normalized[0] === "지역" && normalized[1] === "대학"
  return hasCore && (withStudent || withoutStudent)
}

export function columnDefsForHeaders(headers: string[]) {
  const normalized = headers.map(normalizeHeader)
  if (normalized[0] === "학번") {
    return COLUMN_DEFS
  }
  return COLUMN_DEFS.filter((column) => column.key !== "studentId" && column.key !== "studentName")
}
