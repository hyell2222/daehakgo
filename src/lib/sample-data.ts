import { COLUMN_DEFS } from "@/lib/columns"
import type { DataRow, Dataset } from "@/lib/dataset"

const fourYear = [
  ["서울", "서울대학교", "경영학과", "인문", "학생부종합", "종합", "수시"],
  ["서울", "연세대학교", "컴퓨터과학과", "자연", "학생부교과", "교과", "수시"],
  ["서울", "고려대학교", "의과대학", "자연", "논술전형", "논술", "수시"],
  ["서울", "성균관대학교", "연기예술학과", "예체능", "실기전형", "실기", "수시"],
  ["서울", "한양대학교", "경제금융학부", "인문", "학생부종합", "종합", "수시"],
  ["경기", "경희대학교", "간호학과", "자연", "학생부교과", "교과", "수시"],
  ["부산", "부산대학교", "기계공학부", "자연", "학생부종합", "종합", "수시"],
  ["대전", "KAIST", "전기및전자공학부", "자연", "정시일반", "정시", "정시"],
  ["광주", "전남대학교", "영어교육과", "인문", "학생부교과", "교과", "수시"],
  ["대구", "경북대학교", "화학과", "자연", "논술전형", "논술", "수시"],
] as const

const juniorColleges = [
  ["서울", "동양미래대학교", "컴퓨터정보공학과", "자연", "수시1차", "1차", "수시1차"],
  ["인천", "인하공업전문대학", "기계공학과", "자연", "수시2차", "2차", "수시2차"],
  ["대구", "영진전문대학교", "간호학과", "자연", "수시1차", "1차", "수시1차"],
] as const

const SAMPLE_NAMES = [
  "김민준",
  "이서연",
  "박지호",
  "최수아",
  "정하준",
  "강예은",
  "윤도윤",
  "임하린",
  "한시우",
  "오채원",
  "신유준",
  "조민서",
  "배준혁",
  "송지우",
  "황서준",
  "문다은",
]

function round(value: number, digits = 2) {
  const base = 10 ** digits
  return Math.round(value * base) / base
}

export function createSampleDataset(): Dataset {
  const rows: DataRow[] = []

  for (let student = 0; student < 16; student += 1) {
    const gpa = round(1.5 + (student % 8) * 0.32)
    const percentile = 94 - student * 2
    const grade = 1 + (student % 4)
    const applications = student % 3 === 0 ? 4 : 3

    for (let slot = 0; slot < applications; slot += 1) {
      const useJunior = slot === applications - 1 && student % 4 === 0
      const target = useJunior
        ? juniorColleges[student % juniorColleges.length]
        : fourYear[(student + slot) % fourYear.length]
      const [region, university, major, track, admissionName, admissionCategory, period] = target
      const resultRoll = (student + slot) % 6
      const finalResult =
        resultRoll <= 1 ? "합격" : resultRoll <= 3 ? "불합격" : resultRoll === 4 ? "예비" : "합격"
      const stage1 =
        period === "정시" ? "" : resultRoll === 3 ? "불합격" : "합격"
      const enroll = finalResult === "합격" ? (slot === 0 ? "등록" : "미등록") : ""

      const values: Record<string, string | number> = {
        studentId: String(30701 + student),
        studentName: SAMPLE_NAMES[student],
        region,
        university,
        period,
        admissionName,
        track,
        major,
        stage1,
        finalResult,
        waitlist: finalResult === "예비" ? String((student % 8) + 1) : "",
        enroll,
        note: student === 0 && slot === 0 ? "면접 우수" : "",
        admissionKind: period.includes("수시") ? "수시" : period,
        admissionDate: period === "정시" ? "2026-01-08" : "2025-09-12",
        stage1Date: period === "정시" ? "" : "2025-10-24",
        finalDate: period === "정시" ? "2026-02-07" : "2025-12-12",
        minScoreRule: admissionCategory === "종합" || period === "정시" ? "없음" : "국수탐 중 2개 합 5",
        quota: 12 + student,
        admissionCategory,
        admissionMethod:
          admissionCategory === "종합"
            ? "서류 70 + 면접 30"
            : admissionCategory === "논술"
              ? "논술 70 + 교과 30"
              : "학생부 100%",
        gpaAll: gpa,
        gpaKorMathEngSocSci: round(gpa - 0.1),
        gpaKorMathEngSoc: round(gpa - 0.05),
        gpaKorEngSci: round(gpa + 0.08),
        englishGrade: grade,
        gpaKorMathEng: round(gpa - 0.12),
        gpaKorean: round(gpa - 0.2),
        gpaMath: round(gpa + 0.15),
        gpaEnglish: round(gpa - 0.3),
        gpaSocial: track === "인문" ? round(gpa - 0.25) : "",
        gpaScience: track === "자연" ? round(gpa + 0.05) : "",
        gpaCompare: "A",
        koreanSection: "화법과작문",
        koreanStandard: 118 + student,
        koreanPercentile: percentile,
        koreanGrade: grade,
        mathSection: track === "자연" ? "미적분" : "확률과통계",
        mathStandard: 116 + student,
        mathPercentile: percentile - 1,
        mathGrade: grade,
        inquirySection: track === "자연" ? "과탐" : "사탐",
        inquiry1Subject: track === "자연" ? "지구과학I" : "생활과윤리",
        inquiry1Standard: 62 + (student % 5),
        inquiry1Percentile: percentile - 2,
        inquiry1Grade: grade,
        inquiry2Subject: track === "자연" ? "생명과학I" : "사회문화",
        inquiry2Standard: 60 + (student % 4),
        inquiry2Percentile: percentile - 3,
        inquiry2Grade: Math.min(5, grade + 1),
        historyGrade: grade,
        inquiry3Subject: "",
        inquiry3Grade: "",
      }

      const row: DataRow = {}
      COLUMN_DEFS.forEach((column) => {
        row[column.key] = values[column.key] ?? ""
      })
      rows.push(row)
    }
  }

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
