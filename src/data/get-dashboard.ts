import { Session } from "better-auth";
import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

interface Params {
  from: string;
  to: string;
  session: Session & {
    user: {
      clinic: {
        id: string;
      };
    };
  };
}


export const getDashboard = async ({ from, to, session }: Params) => {

  const fromDate = dayjs(from).startOf("day").toDate();
  const toDate = dayjs(to).endOf("day").toDate();

  const chartStartDate = dayjs().subtract(10, "days").startOf("day").toDate();
  const chartEndDate = dayjs().add(10, "days").endOf("day").toDate();

  const [[totalRevenue], [totalAppointments], [totalPatients], [totalDoctors], topDoctors, topSpecialties, todayAppointments, dailyAppointmentsData] =
     await Promise.all([
       db
         .select({
           total: sql<number>`COALESCE(${sum(appointmentsTable.appointmentPriceInCents)}, 0)`.as("total"),
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
            gte(appointmentsTable.date, dayjs().startOf("day").toDate()),
            lte(appointmentsTable.date, dayjs().endOf("day").toDate()),
          ),
          with: {
            patient: true,
            doctor: true,
          },
        }),

        db
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
        .orderBy(sql`DATE(${appointmentsTable.date})`)
    ]);

    return {
      totalRevenue,
      totalAppointments,
      totalPatients,
      totalDoctors,
      topDoctors,
      topSpecialties,
      todayAppointments,
      dailyAppointmentsData,
    }
}