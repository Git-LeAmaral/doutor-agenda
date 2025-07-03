import { DialogTitle } from "@radix-ui/react-dialog";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { auth } from "@/lib/auth";

import ClinicForm from "./_components/form";


const ClinicFormPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  
  if (!session?.user.plan) {
    redirect("/premium-access");
  }

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
