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
        첫 행이 지역, 대학, 지원시기, 전형명, 계열, 모집단위 순이면 분석 차트가
        바로 연결됩니다. 원본 데이터 메뉴에서 헤더를 확인해 주세요.
      </AlertDescription>
    </Alert>
  )
}
