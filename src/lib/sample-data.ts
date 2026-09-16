import { COLUMN_DEFS } from "@/lib/columns"
import type { DataRow, Dataset } from "@/lib/dataset"

const universities = [
  ["서울", "서울대학교", "경영학과", "인문"],
  ["서울", "연세대학교", "컴퓨터과학과", "자연"],
  ["서울", "고려대학교", "의과대학", "자연"],
  ["서울", "성균관대학교", "반도체시스템공학과", "자연"],
  ["서울", "한양대학교", "경제금융학부", "인문"],
  ["서울", "중앙대학교", "미디어커뮤니케이션학부", "인문"],
  ["경기", "경희대학교", "간호학과", "자연"],
  ["부산", "부산대학교", "기계공학부", "자연"],
  ["대전", "KAIST", "전기및전자공학부", "자연"],
  ["서울", "이화여자대학교", "교육학과", "인문"],
] as const

const admissions = [
  ["학생부교과", "교과", "학생부 100%"],
  ["학생부종합", "종합", "서류 70 + 면접 30"],
  ["논술전형", "논술", "논술 70 + 교과 30"],
  ["정시일반", "정시", "수능 100%"],
] as const

function pick<T>(list: readonly T[], index: number) {
  return list[index % list.length]
}

function round(value: number, digits = 2) {
  const base = 10 ** digits
  return Math.round(value * base) / base
}

export function createSampleDataset(): Dataset {
  const rows: DataRow[] = Array.from({ length: 48 }, (_, index) => {
    const [region, university, major, track] = pick(universities, index)
    const [admissionName, admissionCategory, admissionMethod] = pick(admissions, index)
    const period = admissionName === "정시일반" ? "정시" : "수시"
    const gpa = round(1.4 + (index % 9) * 0.28)
    const percentile = 92 - (index % 12)
    const grade = 1 + (index % 4)
    const resultRoll = index % 7
    const finalResult =
      resultRoll <= 2 ? "합격" : resultRoll <= 4 ? "불합격" : resultRoll === 5 ? "예비" : ""
    const stage1 =
      period === "정시" ? "" : resultRoll === 4 ? "불합격" : resultRoll <= 3 || resultRoll === 5 ? "합격" : ""
    const enroll = finalResult === "합격" ? (index % 3 === 0 ? "미등록" : "등록") : ""
    const waitlist = finalResult === "예비" ? String((index % 9) + 1) : ""

    const values: Record<string, string | number> = {
      region,
      university,
      period,
      admissionName,
      track,
      major,
      stage1,
      finalResult,
      waitlist,
      enroll,
      note: index % 11 === 0 ? "면접 우수" : "",
      admissionKind: period === "정시" ? "정시" : "수시",
      admissionDate: period === "정시" ? "2026-01-08" : "2025-09-12",
      stage1Date: period === "정시" ? "" : "2025-10-24",
      finalDate: period === "정시" ? "2026-02-07" : "2025-12-12",
      minScoreRule: period === "정시" ? "없음" : "국수탐 중 2개 합 5",
      quota: 8 + (index % 20),
      admissionCategory,
      admissionMethod,
      gpaAll: gpa,
      gpaKorMathEngSocSci: round(gpa - 0.1),
      gpaKorMathEngSoc: round(gpa - 0.05),
      gpaKorEngSci: round(gpa + 0.08),
      gpaKorMathEng: round(gpa - 0.12),
      gpaKorean: round(gpa - 0.2),
      gpaMath: round(gpa + 0.15),
      gpaEnglish: round(gpa - 0.3),
      gpaSocial: track === "인문" ? round(gpa - 0.25) : "",
      gpaScience: track === "자연" ? round(gpa + 0.05) : "",
      gpaCompare: "A",
      koreanSection: "화법과작문",
      koreanStandard: 120 + (index % 8),
      koreanPercentile: percentile,
      koreanGrade: grade,
      mathSection: track === "자연" ? "미적분" : "확률과통계",
      mathStandard: 118 + (index % 10),
      mathPercentile: percentile - 1,
      mathGrade: grade,
      mathGradeExtra: grade,
      inquirySection: track === "자연" ? "과탐" : "사탐",
      inquiry1Subject: track === "자연" ? "지구과학I" : "생활과윤리",
      inquiry1Standard: 64 + (index % 6),
      inquiry1Percentile: percentile - 2,
      inquiry1Grade: grade,
      inquiry2Subject: track === "자연" ? "생명과학I" : "사회문화",
      inquiry2Standard: 62 + (index % 5),
      inquiry2Percentile: percentile - 3,
      inquiry2Grade: Math.min(5, grade + 1),
      inquiry3Subject: "",
      inquiry3Grade: "",
    }

    const row: DataRow = {}
    COLUMN_DEFS.forEach((column) => {
      row[column.key] = values[column.key] ?? ""
    })
    return row
  })

  return {
    fileName: "예시-진학데이터.xlsx",
    uploadedAt: new Date().toISOString(),
    sheetName: "진학",
    sheetNames: ["진학"],
    columns: COLUMN_DEFS.map((column) => column.label),
    keys: COLUMN_DEFS.map((column) => column.key),
    rows,
    mapped: true,
  }
}
