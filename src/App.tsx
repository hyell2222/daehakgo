import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/app-layout"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { DatasetProvider } from "@/context/dataset-context"
import { AdmissionPage } from "@/pages/admission-page"
import { ApplicationsPage } from "@/pages/applications-page"
import { DashboardPage } from "@/pages/dashboard-page"
import { TablePage } from "@/pages/table-page"
import { UploadPage } from "@/pages/upload-page"

export default function App() {
  return (
    <TooltipProvider>
      <DatasetProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/admission" element={<AdmissionPage />} />
              <Route path="/table" element={<TablePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </DatasetProvider>
    </TooltipProvider>
  )
}
