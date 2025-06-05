"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertDoctorSchema } from "./schema";

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    if (!session?.user.clinic?.id) {
      throw new Error("Clinic not found");
    }
    await db
      .insert(doctorsTable)
      .values({
        id: parsedInput.id,
        clinicId: session.user.clinic?.id,
        name: parsedInput.name,
        specialty: parsedInput.specialty,
        availableFromTime: parsedInput.availableFromTime,
        availableToTime: parsedInput.availableToTime,
        availableFromWeekDay: parsedInput.availableFromWeekdays,
        availableToWeekDay: parsedInput.availableToWeekDays,
        appointmentPriceInCents: parsedInput.appointmentPriceInCents,
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
        },
      });
  });
