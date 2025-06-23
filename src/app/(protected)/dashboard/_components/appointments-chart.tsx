"use client"

import dayjs from "dayjs"
import { DollarSign } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatCurrencyInCents } from "@/helpers/currency"

export const description = "An area chart with gradient fill"

interface DailyAppointment {
    date: string;
    appointments: number;
    revenue: string | null;
}

interface AppointmentsChartProps {
  dailyAppointmentsData: DailyAppointment[];
}

export const AppointmentsChart = ({dailyAppointmentsData}: AppointmentsChartProps) => {
  const chartDays = Array.from({length: 21}).map((_1, i) => 
    dayjs().subtract(10 - i, "days")
    .format("YYYY-MM-DD")
);

  const chartData = chartDays.map((date) => {
    const dataForDay = dailyAppointmentsData.find((d) => d.date === date);

    return {
      date: dayjs(date).format("DD/MM"),
      fullDate: date,
      appointments: dataForDay?.appointments || 0,
      revenue: Number(dataForDay?.revenue || 0)
    }
  })

const chartConfig = {
  appointments: {
    label: "Agendamentos",
    color: "#0B68F7",
  },
  revenue: {
    label: "Faturamento",
    color: "#10B981",
  },
} satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <DollarSign />
        <CardTitle>Agendamentos e Faturamentos</CardTitle>
        <CardDescription>
          Visão geral de agendamentos e faturamento dos últimos 10 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 30,
              left: 30,
              right: 40,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrencyInCents(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return (
                        <>
                          <div className="h-3 w-3 rounded bg-[#10B981]">
                            <span className="text-muted-foreground">Faturamento</span>
                            <span className="font-semibold">{formatCurrencyInCents(Number(value))}</span>
                          </div>
                        </>
                      )
                    }
                    return (
                      <>
                        <div className="h-3 w-3 rounded bg-[#0B68F7]">
                          <span className="text-muted-foreground">Agendamentos</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      </>
                    )
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return dayjs(payload[0].payload.fullDate).format("DD/MM/YYYY (dddd)")
                    }
                    return label;
                  }}

                />
              }
            />
            
            <Area
              yAxisId="left"
              dataKey="appointments"
              type="monotone"
              fill="var(--color-appointments)"
              fillOpacity={0.2}
              stroke="var(--color-appointments)"
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              dataKey="revenue"
              type="monotone"
              fill="var(--color-revenue)"
              fillOpacity={0.2}
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}
