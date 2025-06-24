import { addMonths } from "date-fns";
import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";
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
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
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

  const { from, to } = await searchParams;

  // Valores padrão caso from e to sejam undefined ou inválidos
  const fromDate = from ? new Date(from) : new Date();
  const toDate = to ? new Date(to) : addMonths(new Date(), 1);

  // Verifica se as datas são válidas
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw new Error("Invalid date values");
  }

     const [[totalRevenue], [totalAppointments], [totalPatients], [totalDoctors], topDoctors, topSpecialties, todayAppointments] =
     await Promise.all([
       db
         .select({
           total: sum(appointmentsTable.appointmentPriceInCents),
         })
         .from(appointmentsTable)
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

        db
        .select({
          id: doctorsTable.id,
          name: doctorsTable.name,
          avatarImageUrl: doctorsTable.avatarImageUrl,
          specialty: doctorsTable.specialty,
          appointments: count(appointmentsTable.id),
        })
        .from(doctorsTable)
        .leftJoin(
          appointmentsTable, 
          and(
            eq(appointmentsTable.doctorId, doctorsTable.id),
            gte(appointmentsTable.date, fromDate),
            lte(appointmentsTable.date, toDate),
          )
        )
        .where(eq(doctorsTable.clinicId, session.user.clinic.id))
        .groupBy(doctorsTable.id)
        .orderBy(desc(count(appointmentsTable.id)))
        .limit(10),

        db
        .select({
          specialty: doctorsTable.specialty,
          appointments: count(appointmentsTable.id),
        })
        .from(appointmentsTable)
        .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
        .where(
          and(
            eq(doctorsTable.clinicId, session.user.clinic.id),
            gte(appointmentsTable.date, fromDate),
            lte(appointmentsTable.date, toDate),
          ),
        )
        .groupBy(doctorsTable.specialty)
        .orderBy(desc(count(appointmentsTable.id)))
        .limit(10),

        db.query.appointmentsTable.findMany({
          where: and(
            eq(appointmentsTable.clinicId, session.user.clinic.id),
            gte(appointmentsTable.date, fromDate),
            lte(appointmentsTable.date, toDate),
          ),
          with: {
            patient: true,
            doctor: true,
          },
        })
    ]);

    const chartStartDate = dayjs().subtract(10, "days").startOf("day").toDate();
    const chartEndDate = dayjs().add(10, "days").endOf("day").toDate();

         const dailyAppointmentsData = await db
       .select({
         date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
         appointments: count(appointmentsTable.id),
         revenue: sum(appointmentsTable.appointmentPriceInCents),
       })
       .from(appointmentsTable)
       .where(
         and(
           eq(appointmentsTable.clinicId, session.user.clinic.id),
           gte(appointmentsTable.date, chartStartDate),
           lte(appointmentsTable.date, chartEndDate),
         ),
       )
       .groupBy(sql`DATE(${appointmentsTable.date})`)
       .orderBy(sql`DATE(${appointmentsTable.date})`);

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
