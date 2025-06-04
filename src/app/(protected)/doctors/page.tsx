import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container";

const DoctorsPage = () => {
  return <PageContainer>
    <PageHeader>
      <PageHeaderContent>
        <PageTitle>Doctors</PageTitle>
        <PageDescription>
          Gerencie os médicos da sua clínica.
        </PageDescription>
      </PageHeaderContent>
      <PageActions>
        <Button>
          <PlusIcon className="w-4 h-4" />
          Adicionar Médico
        </Button>
      </PageActions>
    </PageHeader>
    <PageContent>
      <h1>Médicos</h1>
    </PageContent>
  </PageContainer>
};

export default DoctorsPage;

