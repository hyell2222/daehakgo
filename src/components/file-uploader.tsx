import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from "react"
import { FileSpreadsheetIcon, UploadIcon } from "lucide-react"
import { toast } from "sonner"

import { useDataset } from "@/context/dataset-context"
import { isSpreadsheetFile, parseSpreadsheet } from "@/lib/excel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FileUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { setDataset } = useDataset()
  const [isDragging, setIsDragging] = useState(false)
  const [isReading, setIsReading] = useState(false)

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) {
        return
      }
      if (!isSpreadsheetFile(file)) {
        toast.error("엑셀 또는 CSV 파일만 업로드할 수 있습니다.")
        return
      }

      setIsReading(true)
      try {
        const dataset = await parseSpreadsheet(file)
        setDataset(dataset)
        toast.success(`${dataset.fileName} 파일을 불러왔습니다.`)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "파일을 읽는 중 오류가 발생했습니다."
        toast.error(message)
      } finally {
        setIsReading(false)
      }
    },
    [setDataset],
  )

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    void handleFile(file)
    event.target.value = ""
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    void handleFile(event.dataTransfer.files[0])
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-10 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "bg-muted/30",
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {isReading ? (
          <UploadIcon className="size-5 animate-pulse" />
        ) : (
          <FileSpreadsheetIcon className="size-5" />
        )}
      </div>
      <div className="space-y-1">
        <p className="font-medium">
          {isReading ? "파일을 읽는 중입니다..." : "엑셀 파일을 끌어다 놓으세요"}
        </p>
        <p className="max-w-md text-sm text-muted-foreground">
          .xlsx, .xls, .csv 파일을 지원합니다. 첫 번째 시트의 첫 행을 컬럼명으로 읽습니다.
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
        className="hidden"
        onChange={onInputChange}
      />
      <Button
        type="button"
        disabled={isReading}
        onClick={() => inputRef.current?.click()}
      >
        파일 선택
      </Button>
    </div>
  )
}
