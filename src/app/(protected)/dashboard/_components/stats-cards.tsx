import { Calendar, DollarSign, Stethoscope, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyInCents } from "@/helpers/currency";

interface StatsCardsProps {
  totalRevenue: number;
  totalAppointments: number;
  totalPatients: number;
  totalDoctors: number;
}

const StatsCards = ({
  totalRevenue,
  totalAppointments,
  totalPatients,
  totalDoctors,
}: StatsCardsProps) => {
  const stats = [
    {
      title: "Faturamento",
      value: formatCurrencyInCents(totalRevenue),
      icon: DollarSign,
      iconColor: "text-yellow-600",
    },
    {
      title: "Agendamentos",
      value: totalAppointments.toString(),
      icon: Calendar,
      iconColor: "text-blue-600",
    },
    {
      title: "Pacientes",
      value: totalPatients.toString(),
      icon: Users,
      iconColor: "text-purple-600",
    },
    {
      title: "Médicos",
      value: totalDoctors.toString(),
      icon: Stethoscope,
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent className="px-0">
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
