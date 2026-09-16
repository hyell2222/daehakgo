import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function PageShell({
  title,
  description,
  actions,
  children,
  wide = false,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full min-w-0 flex-col gap-6",
        wide ? "max-w-none" : "max-w-6xl",
      )}
    >
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}
