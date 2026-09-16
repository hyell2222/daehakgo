import { FileSpreadsheetIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyDataset({
  title = "아직 분석할 데이터가 없습니다",
  description = "진학 데이터 엑셀 파일을 업로드하면 차트와 표가 이 화면에 채워집니다.",
}: {
  title?: string
  description?: string
}) {
  return (
    <Empty className="min-h-[240px] flex-none border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileSpreadsheetIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link to="/upload">데이터 업로드</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
