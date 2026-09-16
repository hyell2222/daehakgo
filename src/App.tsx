import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/app-layout"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { DatasetProvider } from "@/context/dataset-context"
import { AdmissionTypesPage } from "@/pages/admission-types-page"
import { DashboardPage } from "@/pages/dashboard-page"
import { MajorRegionalPage } from "@/pages/major-regional-page"
import { RegionRatesPage } from "@/pages/region-rates-page"
import { ScoreApplicationsPage } from "@/pages/score-applications-page"
import { UniversitySearchPage } from "@/pages/university-search-page"
import { UploadPage } from "@/pages/upload-page"

export default function App() {
  return (
    <TooltipProvider>
      <DatasetProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/search" element={<UniversitySearchPage />} />
              <Route path="/admission-types" element={<AdmissionTypesPage />} />
              <Route path="/regions" element={<RegionRatesPage />} />
              <Route path="/major-regional" element={<MajorRegionalPage />} />
              <Route path="/scores" element={<ScoreApplicationsPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/table" element={<Navigate to="/upload" replace />} />
              <Route path="/applications" element={<Navigate to="/search" replace />} />
              <Route path="/admission" element={<Navigate to="/admission-types" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </DatasetProvider>
    </TooltipProvider>
  )
}
