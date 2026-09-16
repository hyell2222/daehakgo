import type { DataRow } from "@/lib/dataset"
import { getString } from "@/lib/dataset"
import {
  classifyResult,
  isEnrolled,
  isFinalPass,
  isStage1Pass,
  isWaitlist,
  parseNumber,
  scoreStats,
} from "@/lib/analytics"
import {
  fiveGradeRangeLabel,
  GPA_BANDS,
  gpaBandDef,
} from "@/lib/grades"

export type CollegeKind = "4년제" | "전문대"
export type FourYearType = "종합" | "교과" | "논술" | "실기" | "기타"
export type JuniorRound = "수시1차" | "수시2차" | "기타"

const MAJOR_UNIVERSITY_HINTS = [
  "서울대",
  "연세대",
  "고려대",
  "서강대",
  "성균관",
  "한양대",
  "중앙대",
  "경희대",
  "한국외대",
  "서울시립",
  "이화여",
  "숙명여",
  "KAIST",
  "한국과학기술원",
  "POSTECH",
  "포항공",
  "UNIST",
  "GIST",
  "DGIST",
  "건국대",
  "동국대",
  "홍익대",
  "국민대",
  "숭실대",
  "세종대",
  "인하대",
  "아주대",
  "한국항공",
  "가톨릭대",
  "서울과학기술",
]

function joinedAdmissionText(row: DataRow) {
  return [
    getString(row, "admissionCategory"),
    getString(row, "admissionName"),
    getString(row, "admissionKind"),
    getString(row, "period"),
  ].join(" ")
}

export function classifyCollegeKind(row: DataRow): CollegeKind {
  const name = getString(row, "university")
  if (/전문/.test(name)) {
    return "전문대"
  }
  if (/KAIST|POSTECH|UNIST|GIST|DGIST|과학기술원|포항공/.test(name)) {
    return "4년제"
  }

  const text = joinedAdmissionText(row)
  if (/수시\s*[12]\s*차|[12]차/.test(text) && !/종합|교과|논술|실기/.test(text)) {
    return "전문대"
  }
  if (/대학교/.test(name)) {
    return "4년제"
  }
  if (/대학$/.test(name)) {
    return "전문대"
  }
  return "4년제"
}

export function classifyFourYearType(row: DataRow): FourYearType {
  const text = joinedAdmissionText(row)
  if (/실기|특기/.test(text)) {
    return "실기"
  }
  if (/논술/.test(text)) {
    return "논술"
  }
  if (/종합|학종/.test(text)) {
    return "종합"
  }
  if (/교과/.test(text)) {
    return "교과"
  }
  return "기타"
}

export function classifyJuniorRound(row: DataRow): JuniorRound {
  const text = joinedAdmissionText(row)
  if (/2차/.test(text)) {
    return "수시2차"
  }
  if (/1차/.test(text)) {
    return "수시1차"
  }
  return "기타"
}

export function requiresMinScore(row: DataRow) {
  const value = getString(row, "minScoreRule").replace(/\s+/g, "")
  if (!value) {
    return false
  }
  return !/없음|해당무|해당없음|미적용|^X$|^×$/.test(value)
}

export function metMinScoreEstimate(row: DataRow) {
  return requiresMinScore(row) && (isStage1Pass(row) || isFinalPass(row))
}

export function studentIdOf(row: DataRow) {
  const studentId = getString(row, "studentId")
  if (studentId) {
    return studentId
  }
  const name = getString(row, "studentName")
  if (name) {
    return `이름:${name}`
  }
  return ""
}

export function uniqueStudentIds(rows: DataRow[]) {
  const ids = new Set<string>()
  let anonymous = 0
  rows.forEach((row) => {
    const id = studentIdOf(row)
    if (id) {
      ids.add(id)
    } else {
      anonymous += 1
    }
  })
  return ids.size + anonymous
}

export function duplicatePassCount(rows: DataRow[]) {
  const passed = new Map<string, number>()
  rows.filter(isFinalPass).forEach((row) => {
    const id = studentIdOf(row)
    if (!id) {
      return
    }
    passed.set(id, (passed.get(id) ?? 0) + 1)
  })
  return [...passed.values()].filter((count) => count >= 2).length
}

export function isMajorUniversity(name: string) {
  return MAJOR_UNIVERSITY_HINTS.some((hint) => name.includes(hint))
}

export function rowGpaBand(row: DataRow) {
  return gpaBandDef(parseNumber(row.gpaAll))
}

export type RateRow = {
  group: string
  name: string
  people: number
  applications: number
  stage1: number
  passed: number
  waitlist: number
  enrolled: number
  rate: number
}

export type StudentStatus = "진학" | "합격 미등록" | "예비" | "불합격" | "결과 대기"

export type StudentOutcome = {
  id: string
  name: string
  status: StudentStatus
  duplicatePass: boolean
  enrolledUniversity: string
  enrolledMajor: string
  applications: number
  passes: number
  gpa: number | null
  percentile: number | null
}

export type CutoffRow = {
  university: string
  admissionName: string
  typeLabel: string
  kind: CollegeKind
  applications: number
  passed: number
  enrolled: number
  rate: number
  gpaAvg: number | null
  gpaBest: number | null
  gpaCutoff: number | null
  percentileAvg: number | null
}

function csatPercentile(row: DataRow) {
  const values = [parseNumber(row.koreanPercentile), parseNumber(row.mathPercentile)].filter(
    (value): value is number => value !== null,
  )
  if (!values.length) {
    return null
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function firstNumber(rows: DataRow[], read: (row: DataRow) => number | null) {
  for (const row of rows) {
    const value = read(row)
    if (value !== null) {
      return value
    }
  }
  return null
}

function averageNumber(values: Array<number | null>) {
  const nums = values.filter((value): value is number => value !== null)
  if (!nums.length) {
    return null
  }
  return nums.reduce((sum, value) => sum + value, 0) / nums.length
}

function typeLabelOf(row: DataRow) {
  return classifyCollegeKind(row) === "전문대"
    ? classifyJuniorRound(row)
    : classifyFourYearType(row)
}

function toRateRow(group: string, name: string, list: DataRow[]): RateRow {
  const passed = list.filter(isFinalPass).length
  return {
    group,
    name,
    people: uniqueStudentIds(list),
    applications: list.length,
    stage1: list.filter(isStage1Pass).length,
    passed,
    waitlist: list.filter(isWaitlist).length,
    enrolled: list.filter(isEnrolled).length,
    rate: list.length === 0 ? 0 : passed / list.length,
  }
}

function subtotal(group: string, rows: RateRow[]): RateRow {
  const people = rows.reduce((sum, row) => sum + row.people, 0)
  const applications = rows.reduce((sum, row) => sum + row.applications, 0)
  const stage1 = rows.reduce((sum, row) => sum + row.stage1, 0)
  const passed = rows.reduce((sum, row) => sum + row.passed, 0)
  const waitlist = rows.reduce((sum, row) => sum + row.waitlist, 0)
  const enrolled = rows.reduce((sum, row) => sum + row.enrolled, 0)
  return {
    group,
    name: "소계",
    people,
    applications,
    stage1,
    passed,
    waitlist,
    enrolled,
    rate: applications === 0 ? 0 : passed / applications,
  }
}

function studentStatusOf(list: DataRow[]): StudentStatus {
  if (list.some(isEnrolled)) {
    return "진학"
  }
  if (list.some(isFinalPass)) {
    return "합격 미등록"
  }
  if (list.some(isWaitlist)) {
    return "예비"
  }
  if (
    list.length > 0 &&
    list.every((row) => classifyResult(getString(row, "finalResult")) === "fail")
  ) {
    return "불합격"
  }
  return "결과 대기"
}

export function studentOutcomes(rows: DataRow[]): StudentOutcome[] {
  const groups = new Map<string, DataRow[]>()
  rows.forEach((row) => {
    const id = studentIdOf(row) || `행:${groups.size + 1}`
    const list = groups.get(id) ?? []
    list.push(row)
    groups.set(id, list)
  })

  return [...groups.entries()]
    .map(([id, list]) => {
      const enrolledRow = list.find(isEnrolled)
      const passes = list.filter(isFinalPass).length
      return {
        id,
        name: getString(list[0], "studentName"),
        status: studentStatusOf(list),
        duplicatePass: passes >= 2,
        enrolledUniversity: enrolledRow ? getString(enrolledRow, "university") : "",
        enrolledMajor: enrolledRow ? getString(enrolledRow, "major") : "",
        applications: list.length,
        passes,
        gpa: firstNumber(list, (row) => parseNumber(row.gpaAll)),
        percentile: firstNumber(list, csatPercentile),
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id, "ko") || a.name.localeCompare(b.name, "ko"))
}

export function overviewReport(rows: DataRow[]) {
  const students = studentOutcomes(rows)
  const people = students.length
  const enrolledPeople = students.filter((student) => student.status === "진학").length
  const passedUnenrolled = students.filter((student) => student.status === "합격 미등록").length
  const duplicates = students.filter((student) => student.duplicatePass).length
  return {
    people,
    avgApplications: people === 0 ? 0 : rows.length / people,
    enrolledPeople,
    enrollPeopleRate: people === 0 ? 0 : enrolledPeople / people,
    unplacedPeople: people - enrolledPeople,
    passedUnenrolled,
    duplicates,
    duplicateRate: people === 0 ? 0 : duplicates / people,
  }
}

export function cutoffReport(rows: DataRow[]): CutoffRow[] {
  const groups = new Map<string, DataRow[]>()
  rows.forEach((row) => {
    const university = getString(row, "university") || "(대학 미상)"
    const admissionName = getString(row, "admissionName") || "(전형 미상)"
    const kind = classifyCollegeKind(row)
    const typeLabel = typeLabelOf(row)
    const key = `${university}::${admissionName}::${kind}::${typeLabel}`
    const list = groups.get(key) ?? []
    list.push(row)
    groups.set(key, list)
  })

  return [...groups.entries()]
    .map(([key, list]) => {
      const [university, admissionName, kind, typeLabel] = key.split("::")
      const passedRows = list.filter(isFinalPass)
      const passed = passedRows.length
      const gpa = scoreStats(passedRows, "gpaAll")
      return {
        university,
        admissionName,
        typeLabel,
        kind: kind as CollegeKind,
        applications: list.length,
        passed,
        enrolled: list.filter(isEnrolled).length,
        rate: list.length === 0 ? 0 : passed / list.length,
        gpaAvg: gpa?.avg ?? null,
        gpaBest: gpa?.best ?? null,
        gpaCutoff: gpa?.cutoff ?? null,
        percentileAvg: averageNumber(passedRows.map(csatPercentile)),
      }
    })
    .sort(
      (a, b) =>
        a.university.localeCompare(b.university, "ko") ||
        a.admissionName.localeCompare(b.admissionName, "ko"),
    )
}

export function admissionTypeReport(rows: DataRow[]) {
  const fourYear: Record<FourYearType, DataRow[]> = {
    종합: [],
    교과: [],
    논술: [],
    실기: [],
    기타: [],
  }
  const junior: Record<JuniorRound, DataRow[]> = {
    수시1차: [],
    수시2차: [],
    기타: [],
  }

  rows.forEach((row) => {
    if (classifyCollegeKind(row) === "전문대") {
      junior[classifyJuniorRound(row)].push(row)
    } else {
      fourYear[classifyFourYearType(row)].push(row)
    }
  })

  const fourYearRows = (["종합", "교과", "논술", "실기", "기타"] as FourYearType[])
    .map((name) => toRateRow("4년제", name, fourYear[name]))
    .filter((row) => row.name === "기타" ? row.applications > 0 : true)

  const juniorRows = (["수시1차", "수시2차", "기타"] as JuniorRound[])
    .map((name) => toRateRow("전문대", name, junior[name]))
    .filter((row) => row.name === "기타" ? row.applications > 0 : true)

  return {
    fourYear: [...fourYearRows, subtotal("4년제", fourYearRows)],
    junior: [...juniorRows, subtotal("전문대", juniorRows)],
  }
}

export function minScoreReport(rows: DataRow[]) {
  const neededRows = rows.filter(requiresMinScore)
  const metRows = neededRows.filter(metMinScoreEstimate)
  const neededPeople = uniqueStudentIds(neededRows)
  const metPeople = uniqueStudentIds(metRows)
  return {
    neededApplications: neededRows.length,
    neededPeople,
    metPeople,
    rate: neededPeople === 0 ? 0 : metPeople / neededPeople,
  }
}

export function regionCollegeReport(rows: DataRow[]) {
  const groups = new Map<string, DataRow[]>()
  rows.forEach((row) => {
    const region = getString(row, "region") || "(지역 미상)"
    const kind = classifyCollegeKind(row)
    const key = `${region}::${kind}`
    const list = groups.get(key) ?? []
    list.push(row)
    groups.set(key, list)
  })

  return [...groups.entries()]
    .map(([key, list]) => {
      const [region, kind] = key.split("::")
      return toRateRow(region, kind, list)
    })
    .sort((a, b) => a.group.localeCompare(b.group, "ko") || a.name.localeCompare(b.name, "ko"))
}

export function regionUniversityReport(rows: DataRow[]) {
  const groups = new Map<string, DataRow[]>()
  rows.forEach((row) => {
    const region = getString(row, "region") || "(지역 미상)"
    const university = getString(row, "university") || "(대학 미상)"
    const kind = classifyCollegeKind(row)
    const key = `${region}::${kind}::${university}`
    const list = groups.get(key) ?? []
    list.push(row)
    groups.set(key, list)
  })

  return [...groups.entries()]
    .map(([key, list]) => {
      const [region, kind, university] = key.split("::")
      return { ...toRateRow(region, university, list), kind }
    })
    .sort((a, b) => b.applications - a.applications)
}

export function universityGroupReport(rows: DataRow[]) {
  const passed = rows.filter(isFinalPass)
  const major = passed.filter((row) => isMajorUniversity(getString(row, "university")))
  const regional = passed.filter((row) => !isMajorUniversity(getString(row, "university")))

  const byUniversity = (list: DataRow[]) => {
    const map = new Map<string, number>()
    list.forEach((row) => {
      const name = getString(row, "university") || "(대학 미상)"
      map.set(name, (map.get(name) ?? 0) + 1)
    })
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }

  return {
    majorCount: major.length,
    regionalCount: regional.length,
    majorUniversities: byUniversity(major),
    regionalUniversities: byUniversity(regional),
  }
}

export function scoreApplicationReport(rows: DataRow[]) {
  const bands = new Map<string, DataRow[]>()
  const missing: DataRow[] = []

  rows.forEach((row) => {
    const band = rowGpaBand(row)
    if (!band) {
      missing.push(row)
      return
    }
    const list = bands.get(band.id) ?? []
    list.push(row)
    bands.set(band.id, list)
  })

  const grouped = GPA_BANDS.filter((band) => (bands.get(band.id) ?? []).length > 0).map((band) => {
    const list = bands.get(band.id) ?? []
    const universities = new Map<string, { applications: number; passed: number }>()
    list.forEach((row) => {
      const name = getString(row, "university") || "(대학 미상)"
      const current = universities.get(name) ?? { applications: 0, passed: 0 }
      current.applications += 1
      if (isFinalPass(row)) {
        current.passed += 1
      }
      universities.set(name, current)
    })
    const top = [...universities.entries()]
      .map(([name, value]) => ({ name, ...value }))
      .sort((a, b) => b.applications - a.applications)

    return {
      id: band.id,
      band: band.nineLabel,
      fiveLabel: fiveGradeRangeLabel(band),
      applications: list.length,
      passed: list.filter(isFinalPass).length,
      universities: top,
    }
  })

  if (missing.length === 0) {
    return grouped
  }

  const universities = new Map<string, { applications: number; passed: number }>()
  missing.forEach((row) => {
    const name = getString(row, "university") || "(대학 미상)"
    const current = universities.get(name) ?? { applications: 0, passed: 0 }
    current.applications += 1
    if (isFinalPass(row)) {
      current.passed += 1
    }
    universities.set(name, current)
  })

  return [
    ...grouped,
    {
      id: "missing",
      band: "미입력",
      fiveLabel: "-",
      applications: missing.length,
      passed: missing.filter(isFinalPass).length,
      universities: [...universities.entries()]
        .map(([name, value]) => ({ name, ...value }))
        .sort((a, b) => b.applications - a.applications),
    },
  ]
}
