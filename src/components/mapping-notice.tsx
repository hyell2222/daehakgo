import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function MappingNotice({ mapped }: { mapped: boolean }) {
  if (mapped) {
    return null
  }

  return (
    <Alert>
      <InfoIcon />
      <AlertTitle>컬럼을 자동으로 연결하지 못했습니다</AlertTitle>
      <AlertDescription>
        학번, 이름, 지역, 대학, 지원시기, 전형명, 계열, 모집단위 순이면 분석 차트가 바로
        연결됩니다. 위쪽 병합 헤더(학생/수시/학생부/수능)가 있어도 컬럼행을 찾아 읽습니다.
      </AlertDescription>
    </Alert>
  )
}
