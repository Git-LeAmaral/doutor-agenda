import { Session } from "better-auth";
import { addMonths } from "date-fns";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { getDashboard } from "@/data/get-dashboard";
import { auth } from "@/lib/auth";

import { appointmentsTableColumns } from "../appointments/_components/table-columns";
import { AppointmentsChart } from "./_components/appointments-chart";
import { DatePicker } from "./_components/date-picker";
import StatsCards from "./_components/stats-cards";
import TopDoctors from "./_components/top-doctors";
import TopSpecialties from "./_components/top-specialties";

interface DashboardPageProps {
  searchParams: Promise<{
    from: string;
    to: string;
  }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  if (!session.user.plan) {
    redirect("/premium-access");
  }

  const { from, to } = await searchParams;

  // Valores padrão caso from e to sejam undefined ou inválidos
  const fromDate = from ? new Date(from) : new Date();
  const toDate = to ? new Date(to) : addMonths(new Date(), 1);

  // Verifica se as datas são válidas
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw new Error("Invalid date values");
  }

  // Converter datas para strings no formato ISO para garantir consistência
  const fromString = fromDate.toISOString().split('T')[0];
  const toString = toDate.toISOString().split('T')[0];

    const {
      totalRevenue,
      totalAppointments,
      totalPatients,
      totalDoctors,
      topDoctors,
      topSpecialties,
      todayAppointments,
      dailyAppointmentsData,
    } = await getDashboard({ 
      from: fromString, 
      to: toString, 
      session: session as unknown as Session & {
        user: {
          clinic: {
            id: string;
          };
        };
      },
    });  

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral de suas clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCards
          totalRevenue={totalRevenue.total}
          totalAppointments={totalAppointments.total}
          totalPatients={totalPatients.total}
          totalDoctors={totalDoctors.total}
        />
        <div className="grid grid-cols-[2.25fr_1fr] gap-4">
          <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
          <TopDoctors doctors={topDoctors} />
        </div>
        <div className="grid grid-cols-[2.25fr_1fr] gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar />
                <CardTitle>Agendamentos de hoje</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={appointmentsTableColumns} data={todayAppointments} /> 
            </CardContent>
          </Card>
          <TopSpecialties specialties={topSpecialties} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
