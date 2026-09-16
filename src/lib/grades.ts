/** 9등급제 누적 상한(%). 1등급 4% … 9등급 100% */
export const NINE_GRADE_CUMULATIVE = [0, 4, 11, 23, 40, 60, 77, 89, 96, 100]

/** 5등급제 누적 상한(%). 1등급 10% … 5등급 100% */
export const FIVE_GRADE_CUMULATIVE = [0, 10, 34, 66, 90, 100]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function round2(value: number) {
  return Math.round(value * 100) / 100
}

function lerpPoints(x: number, points: [number, number][]) {
  if (x <= points[0][0]) {
    return points[0][1]
  }
  for (let index = 1; index < points.length; index += 1) {
    const [x1, y1] = points[index - 1]
    const [x2, y2] = points[index]
    if (x <= x2) {
      const span = x2 - x1
      const t = span === 0 ? 0 : (x - x1) / span
      return y1 + (y2 - y1) * t
    }
  }
  return points[points.length - 1][1]
}

/**
 * 9등급 평균 → 추정 석차백분율.
 * 1.00은 1등급 구간 시작(0%), 각 정수 등급은 그 등급 구간의 시작 누적비율입니다.
 */
export function nineGradeToPercentile(gpa: number) {
  return lerpPoints(clamp(gpa, 1, 9), [
    [1, 0],
    [2, 4],
    [3, 11],
    [4, 23],
    [5, 40],
    [6, 60],
    [7, 77],
    [8, 89],
    [9, 100],
  ])
}

/** 석차백분율 → 5등급 평균 (1.00~5.00). 구간 안은 선형입니다. */
export function percentileToFiveGrade(percentile: number) {
  return round2(
    lerpPoints(clamp(percentile, 0, 100), [
      [0, 1],
      [10, 2],
      [34, 3],
      [66, 4],
      [90, 5],
      [100, 5],
    ]),
  )
}

export function nineToFiveGrade(gpa: number) {
  return percentileToFiveGrade(nineGradeToPercentile(gpa))
}

export function formatGrade(value: number) {
  return value.toFixed(2)
}

export type GpaBandDef = {
  id: string
  nineLabel: string
  min: number | null
  max: number | null
}

export const GPA_BANDS: GpaBandDef[] = [
  { id: "lt1", nineLabel: "1.00 미만", min: null, max: 1 },
  { id: "1.00", nineLabel: "1.00~1.24", min: 1, max: 1.25 },
  { id: "1.25", nineLabel: "1.25~1.49", min: 1.25, max: 1.5 },
  { id: "1.50", nineLabel: "1.50~1.74", min: 1.5, max: 1.75 },
  { id: "1.75", nineLabel: "1.75~1.99", min: 1.75, max: 2 },
  { id: "2.00", nineLabel: "2.00~2.24", min: 2, max: 2.25 },
  { id: "2.25", nineLabel: "2.25~2.49", min: 2.25, max: 2.5 },
  { id: "2.50", nineLabel: "2.50~2.74", min: 2.5, max: 2.75 },
  { id: "2.75", nineLabel: "2.75~2.99", min: 2.75, max: 3 },
  { id: "3.00", nineLabel: "3.00~3.24", min: 3, max: 3.25 },
  { id: "3.25", nineLabel: "3.25~3.49", min: 3.25, max: 3.5 },
  { id: "3.50", nineLabel: "3.50~3.74", min: 3.5, max: 3.75 },
  { id: "3.75", nineLabel: "3.75~3.99", min: 3.75, max: 4 },
  { id: "4.00", nineLabel: "4.00~4.49", min: 4, max: 4.5 },
  { id: "4.50", nineLabel: "4.50~4.99", min: 4.5, max: 5 },
  { id: "gte5", nineLabel: "5.00 이상", min: 5, max: null },
]

export function gpaBandDef(value: number | null) {
  if (value === null) {
    return null
  }
  return (
    GPA_BANDS.find((band) => {
      const overMin = band.min === null || value >= band.min
      const underMax = band.max === null || value < band.max
      return overMin && underMax
    }) ?? null
  )
}

export function fiveGradeRangeLabel(band: GpaBandDef) {
  const low = nineToFiveGrade(band.min ?? 1)
  const highSource =
    band.max === null ? 9 : Math.max(band.min ?? 1, band.max - 0.01)
  const high = nineToFiveGrade(highSource)
  if (low === high) {
    return formatGrade(low)
  }
  return `${formatGrade(Math.min(low, high))}~${formatGrade(Math.max(low, high))}`
}
