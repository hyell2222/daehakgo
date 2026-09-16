import { Cell, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function CategoryPieChart({
  data,
  label = "건수",
}: {
  data: { name: string; value: number }[]
  label?: string
}) {
  const config = Object.fromEntries(
    data.map((item, index) => [
      item.name,
      { label: item.name, color: COLORS[index % COLORS.length] },
    ]),
  ) as ChartConfig

  const points = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }))

  return (
    <ChartContainer config={{ ...config, value: { label } }} className="mx-auto h-[280px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={points} dataKey="value" nameKey="name" innerRadius={58}>
          {points.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
