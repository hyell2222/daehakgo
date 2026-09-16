import { CategoryBarChart } from "@/components/charts/category-bar-chart"
import { EmptyDataset } from "@/components/empty-dataset"
import { MappingNotice } from "@/components/mapping-notice"
import { PageShell } from "@/components/page-shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDataset } from "@/context/dataset-context"
import { formatNumber, formatPercent } from "@/lib/analytics"
import {
  FIVE_GRADE_CUMULATIVE,
  NINE_GRADE_CUMULATIVE,
} from "@/lib/grades"
import { scoreApplicationReport } from "@/lib/reports"

const NINE_SHARE = ["4%", "7%", "12%", "17%", "20%", "17%", "12%", "7%", "4%"]
const FIVE_SHARE = ["10%", "24%", "32%", "24%", "10%"]

export function ScoreApplicationsPage() {
  const { dataset } = useDataset()

  if (!dataset) {
    return (
      <PageShell
        title="점수별 지원현황"
        description="전과목 내신 구간별로 어느 대학에 지원·합격했는지 봅니다."
      >
        <EmptyDataset />
      </PageShell>
    )
  }

  const report = scoreApplicationReport(dataset.rows)

  return (
    <PageShell
      title="점수별 지원현황"
      description="전과목 내신을 9등급 0.25 구간으로 나누고, 같은 석차백분율을 5등급제로 환산해 함께 봅니다. 숫자가 낮을수록 좋은 성적입니다."
    >
      <MappingNotice mapped={dataset.mapped} />

      <Card>
        <CardHeader>
          <CardTitle>9등급·5등급 환산 기준</CardTitle>
          <CardDescription>
            2026학년도 고3은 9등급제, 고1·고2는 5등급제입니다. 환산은 등급을 숫자만 바꾸는 것이
            아니라 석차백분율을 새 누적 기준에 대입합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>9등급</TableHead>
                <TableHead>비율</TableHead>
                <TableHead>누적</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {NINE_SHARE.map((share, index) => (
                <TableRow key={share + index}>
                  <TableCell>{index + 1}등급</TableCell>
                  <TableCell>{share}</TableCell>
                  <TableCell>{NINE_GRADE_CUMULATIVE[index + 1]}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>5등급</TableHead>
                <TableHead>비율</TableHead>
                <TableHead>누적</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FIVE_SHARE.map((share, index) => (
                <TableRow key={share + index}>
                  <TableCell>{index + 1}등급</TableCell>
                  <TableCell>{share}</TableCell>
                  <TableCell>{FIVE_GRADE_CUMULATIVE[index + 1]}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>내신 구간별 지원</CardTitle>
          <CardDescription>9등급 전과목 평균 0.25 구간 · 아래 카드에 5등급 환산을 함께 적습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryBarChart
            data={report.map((item) => ({
              name: item.band,
              value: item.applications,
            }))}
            label="지원 건수"
          />
        </CardContent>
      </Card>

      {report.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>9등급 {item.band}</CardTitle>
            <CardDescription>
              5등급 환산 {item.fiveLabel} · 지원 {formatNumber(item.applications)}건 · 합격{" "}
              {formatNumber(item.passed)}건
              {item.applications ? ` · 합격률 ${formatPercent(item.passed / item.applications)}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>대학</TableHead>
                  <TableHead className="text-right">지원</TableHead>
                  <TableHead className="text-right">합격</TableHead>
                  <TableHead className="text-right">합격률</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {item.universities.map((university) => (
                  <TableRow key={university.name}>
                    <TableCell>{university.name}</TableCell>
                    <TableCell className="text-right">
                      {formatNumber(university.applications)}
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(university.passed)}</TableCell>
                    <TableCell className="text-right">
                      {formatPercent(
                        university.applications ? university.passed / university.applications : 0,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </PageShell>
  )
}
