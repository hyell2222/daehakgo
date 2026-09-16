import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

import type { Dataset } from "@/lib/dataset"

type DatasetContextValue = {
  dataset: Dataset | null
  setDataset: (dataset: Dataset | null) => void
}

const DatasetContext = createContext<DatasetContextValue | null>(null)

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const value = useMemo(() => ({ dataset, setDataset }), [dataset])

  return (
    <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>
  )
}

export function useDataset() {
  const context = useContext(DatasetContext)
  if (!context) {
    throw new Error("useDataset는 DatasetProvider 안에서만 사용할 수 있습니다.")
  }
  return context
}
