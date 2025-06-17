"use client"

import { ColumnDef } from "@tanstack/react-table"

import { patientsTable } from "@/db/schema"

import PatientsTableActions from "./table-actions";

type Patient = typeof patientsTable.$inferSelect;

export const patientsTableColumns: ColumnDef<Patient>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell: (params) => {
      const phone = params.row.original.phoneNumber;
      return `(${phone.slice(0,2)}) ${phone.slice(2,7)}-${phone.slice(7)}`;
    }
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sexo",
    cell: (params) => {
      const patient = params.row.original;
      return patient.sex === "male" ? "Masculino" : "Feminino";
    }
  },
  {
    id: "actions",
    cell: (params) => {
      const patient = params.row.original;
      return <PatientsTableActions patient={patient} />
    }
  }
]