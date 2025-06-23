"use client"

import "dayjs/locale/pt-br"

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
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                
                const data = payload[0].payload;
                const appointmentsData = payload.find(p => p.dataKey === 'appointments');
                const revenueData = payload.find(p => p.dataKey === 'revenue');
                
                return (
                  <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
                    <p className="font-semibold text-foreground mb-3 text-center">
                      {dayjs(data.fullDate).locale('pt-br').format("DD/MM/YYYY (dddd)")}
                    </p>
                    <div className="space-y-2">
                      {appointmentsData && (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded bg-[#0B68F7]"></div>
                            <span className="text-muted-foreground text-sm">Agendamentos</span>
                          </div>
                          <span className="font-semibold text-foreground">{appointmentsData.value}</span>
                        </div>
                      )}
                      {revenueData && (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded bg-[#10B981]"></div>
                            <span className="text-muted-foreground text-sm">Faturamento</span>
                          </div>
                          <span className="font-semibold text-foreground">
                            {formatCurrencyInCents(Number(revenueData.value))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
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
