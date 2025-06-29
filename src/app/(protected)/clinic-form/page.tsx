import { DialogTitle } from "@radix-ui/react-dialog";

import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";

import ClinicForm from "./_components/form";


const ClinicFormPage = () => {
  

  return (
    <div>
      <Dialog open>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar clínica</DialogTitle>
            <DialogDescription>
              Adicione uma clínica para continuar.
            </DialogDescription>
          </DialogHeader>
          <ClinicForm/>
          
        </DialogContent>
      </form>
    </Dialog>
    </div>
  );
};

export default ClinicFormPage;
