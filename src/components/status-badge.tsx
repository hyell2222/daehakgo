import { Badge } from "@/components/ui/badge"
import type { StudentStatus } from "@/lib/reports"

const VARIANT: Record<
  StudentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  진학: "default",
  "합격 미등록": "secondary",
  예비: "outline",
  불합격: "destructive",
  "결과 대기": "outline",
}

export function StatusBadge({ status }: { status: StudentStatus }) {
  return <Badge variant={VARIANT[status]}>{status}</Badge>
}
