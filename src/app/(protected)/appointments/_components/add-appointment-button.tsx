"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { doctorsTable, patientsTable } from "@/db/schema";

import AddAppointmentForm from "./add-appointment-form";

interface AddAppointmentButtonProps {
  doctors: (typeof doctorsTable.$inferSelect)[];
  patients: (typeof patientsTable.$inferSelect)[];
}

const AddAppointmentButton = ({ doctors, patients }: AddAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Novo agendamento
        </Button>
      </DialogTrigger>
      <AddAppointmentForm 
        isOpen={isOpen} 
        doctors={doctors} 
        patients={patients} 
        onSuccess={() => setIsOpen(false)} 
      />
    </Dialog>
  );
};

export default AddAppointmentButton; 