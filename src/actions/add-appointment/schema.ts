import { z } from "zod";

export const addAppointmentSchema = z.object({
  id: z.string().uuid().optional(),
  patientId: z.string().uuid({ message: "Paciente é obrigatório" }),
  doctorId: z.string().uuid({ message: "Médico é obrigatório" }),
  appointmentPriceInCents: z.number().min(1, { message: "Valor da consulta é obrigatório" }),
  date: z.date({ message: "Data é obrigatória" }),
  time: z.string().min(1, { message: "Horário é obrigatório" }),
});

export type AddAppointmentSchema = z.infer<typeof addAppointmentSchema>; 