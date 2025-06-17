"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import UpsertPatientForm from "./upsert-patient-form";

const AddPatientButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Adicionar Paciente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UpsertPatientForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientButton; 