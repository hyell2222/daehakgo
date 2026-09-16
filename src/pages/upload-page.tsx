import { SparklesIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { FileUploader } from "@/components/file-uploader"
import { OriginalDataTable } from "@/components/original-data-table"
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
      title="데이터"
      description="엑셀을 올리면 분석에 쓰이고, 같은 화면에서 원본 표도 확인할 수 있습니다."
      actions={
        dataset ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <FileUploader variant="compact" />
            <Button variant="outline" onClick={() => setDataset(null)}>
              <Trash2Icon />
              데이터 비우기
            </Button>
          </div>
        ) : undefined
      }
    >
      {dataset ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>현재 파일</CardTitle>
              <CardDescription>{dataset.fileName}</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>원본 데이터</CardTitle>
              <CardDescription>업로드한 엑셀을 그대로 펼쳐 봅니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <OriginalDataTable />
            </CardContent>
          </Card>
        </>
      ) : (
        <>
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
                첫 번째 시트의 첫 행을 헤더로 읽습니다. 중복되는 표준점수·백분위·등급은 국어/수학/탐구
                위치대로 구분합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>인식하는 컬럼 순서: {COLUMN_DEFS.map((column) => column.header).join(", ")}</p>
              <p>xlsx, xls, csv를 지원하며 파일 크기는 20MB 이하입니다.</p>
            </CardContent>
          </Card>
        </>
      )}
    </PageShell>
  )
}
