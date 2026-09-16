import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type BarPoint = {
  name: string
  value: number
}

export function CategoryBarChart({
  data,
  label = "건수",
}: {
  data: BarPoint[]
  label?: string
}) {
  const config = {
    value: { label, color: "var(--chart-1)" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="h-[280px] w-full">
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          angle={data.length > 5 ? -28 : 0}
          textAnchor={data.length > 5 ? "end" : "middle"}
          height={data.length > 5 ? 72 : 30}
        />
        <YAxis allowDecimals={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

export function GroupedBarChart({
  data,
}: {
  data: { name: string; applications: number; passed: number }[]
}) {
  const config = {
    applications: { label: "지원", color: "var(--chart-2)" },
    passed: { label: "합격", color: "var(--chart-1)" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="h-[280px] w-full">
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          angle={data.length > 5 ? -28 : 0}
          textAnchor={data.length > 5 ? "end" : "middle"}
          height={data.length > 5 ? 72 : 30}
        />
        <YAxis allowDecimals={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="applications" fill="var(--color-applications)" radius={4} />
        <Bar dataKey="passed" fill="var(--color-passed)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

export function chartConfigForValue(label: string): ChartConfig {
  return { value: { label, color: "var(--chart-1)" } }
}
