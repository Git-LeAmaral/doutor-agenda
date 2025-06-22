import { addMonths } from "date-fns";
import { and, count, eq, gte, lte, sum } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { DatePicker } from "./_components/date-picker";
import StatsCards from "./_components/stats-cards";

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

  const { from, to } = await searchParams;

  // Valores padrão caso from e to sejam undefined ou inválidos
  const fromDate = from ? new Date(from) : new Date();
  const toDate = to ? new Date(to) : addMonths(new Date(), 1);

  // Verifica se as datas são válidas
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw new Error("Invalid date values");
  }

  const [[totalRevenue], [totalAppointments], [totalPatients], [totalDoctors]] =
    await Promise.all([
      db
        .select({
          total: sum(doctorsTable.appointmentPriceInCents),
        })
        .from(appointmentsTable)
        .innerJoin(
          doctorsTable,
          eq(appointmentsTable.doctorId, doctorsTable.id),
        )
        .where(
          and(
            eq(appointmentsTable.clinicId, session.user.clinic.id),
            gte(appointmentsTable.date, fromDate),
            lte(appointmentsTable.date, toDate),
          ),
        ),
      db
        .select({
          total: count(),
        })
        .from(appointmentsTable)
        .innerJoin(
          doctorsTable,
          eq(appointmentsTable.doctorId, doctorsTable.id),
        )
        .where(
          and(
            eq(appointmentsTable.clinicId, session.user.clinic.id),
            gte(appointmentsTable.date, fromDate),
            lte(appointmentsTable.date, toDate),
          ),
        ),
      db
        .select({
          total: count(),
        })
        .from(patientsTable)
        .where(eq(patientsTable.clinicId, session.user.clinic.id)),
      db
        .select({
          total: count(),
        })
        .from(doctorsTable)
        .where(eq(doctorsTable.clinicId, session.user.clinic.id)),
    ]);

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
          totalRevenue={Number(totalRevenue.total) || 0}
          totalAppointments={totalAppointments.total}
          totalPatients={totalPatients.total}
          totalDoctors={totalDoctors.total}
        />
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
