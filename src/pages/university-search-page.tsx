import { useMemo, useState } from "react"

import { DataRowsTable } from "@/components/data-rows-table"
import { EmptyDataset } from "@/components/empty-dataset"
import { PageShell } from "@/components/page-shell"
import { UniversityCombobox } from "@/components/university-combobox"
import { useDataset } from "@/context/dataset-context"
import { formatNumber, uniqueValues } from "@/lib/analytics"
import { getString } from "@/lib/dataset"

export function UniversitySearchPage() {
  const { dataset } = useDataset()
  const [query, setQuery] = useState("")

  const universities = dataset ? uniqueValues(dataset.rows, "university") : []
  const selected = query.trim()

  const matchedUniversities = useMemo(() => {
    if (!selected) {
      return universities
    }
    return universities.filter((name) => name.includes(selected))
  }, [selected, universities])

  const rows = useMemo(() => {
    if (!dataset || !selected) {
      return []
    }
    return dataset.rows.filter((row) => getString(row, "university").includes(selected))
  }, [dataset, selected])

  if (!dataset) {
    return (
      <PageShell
        title="대학별 결과 검색"
        description="대학 이름을 검색하면 그 대학에 지원한 모든 건이 나옵니다."
      >
        <EmptyDataset />
      </PageShell>
    )
  }

  return (
    <PageShell
      title="대학별 결과 검색"
      description="대학명을 입력하거나 목록에서 고르면 해당 대학 지원 데이터가 모두 표시됩니다."
    >
      <div className="space-y-2">
        <UniversityCombobox
          value={query}
          onChange={setQuery}
          options={universities}
          placeholder="예: 서울대학교, 부산대"
        />
        <p className="text-sm text-muted-foreground">
          {selected
            ? `${matchedUniversities.join(", ") || "일치하는 대학 없음"} · ${formatNumber(rows.length)}건`
            : `등록된 대학 ${formatNumber(universities.length)}곳`}
        </p>
      </div>

      {selected ? (
        <DataRowsTable
          rows={rows}
          keys={dataset.keys}
          columns={dataset.columns}
          hideKeys={["studentId", "studentName", "학번", "이름"]}
        />
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
          대학 이름을 입력하면 지원 시기, 전형, 합격·등록, 내신·수능 점수가 이어집니다.
        </div>
      )}
    </PageShell>
  )
}
