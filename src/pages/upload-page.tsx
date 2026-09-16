import { SparklesIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { FileUploader } from "@/components/file-uploader"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDataset } from "@/context/dataset-context"
import { formatDateTime, formatNumber } from "@/lib/analytics"
import { COLUMN_DEFS } from "@/lib/columns"
import { createSampleDataset } from "@/lib/sample-data"

export function UploadPage() {
  const { dataset, setDataset } = useDataset()

  function loadSample() {
    setDataset(createSampleDataset())
    toast.success("예시 진학 데이터를 불러왔습니다.")
  }

  return (
    <PageShell
      title="데이터 업로드"
      description="고3 진학 엑셀을 올리면 지원 현황과 합격률 차트에 결과가 채워집니다."
    >
      <FileUploader />

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={loadSample}>
          <SparklesIcon />
          예시 데이터로 미리보기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>업로드 안내</CardTitle>
          <CardDescription>
            첫 번째 시트의 첫 행을 헤더로 읽습니다. 중복되는 표준점수·백분위·등급은 국어/수학/탐구 위치대로 구분합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>인식하는 컬럼 순서: {COLUMN_DEFS.map((column) => column.header).join(", ")}</p>
          <p>xlsx, xls, csv를 지원하며 파일 크기는 20MB 이하입니다.</p>
        </CardContent>
      </Card>

      {dataset ? (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>현재 파일</CardTitle>
              <CardDescription>{dataset.fileName}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setDataset(null)}>
              <Trash2Icon />
              데이터 비우기
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">업로드 시각</p>
              <p className="font-medium">{formatDateTime(dataset.uploadedAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">행 / 열</p>
              <p className="font-medium">
                {formatNumber(dataset.rows.length)}행 · {dataset.columns.length}열
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">컬럼 연결</p>
              <p className="font-medium">{dataset.mapped ? "자동 연결됨" : "원본 헤더 유지"}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </PageShell>
  )
}
