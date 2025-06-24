import { Apple, Baby, Bone, Brain, Ear, Eye, Heart, Hospital, ScanFace, Stethoscope } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress";


interface TopSpecialtiesProps {
  specialties: {
    specialty: string
    appointments: number
  }[];
}

const getSpecialtyIcon = (specialty: string) => {
  const specialtyLower = specialty.toLowerCase();

  if (specialtyLower.includes("cardiolog")) return Heart;
  if (specialtyLower.includes("ginecolog") || specialtyLower.includes("obstetri")) return Baby;
  if (specialtyLower.includes("pediatri")) return Baby;
  if (specialtyLower.includes("ortopedi")) return Bone;
  if (specialtyLower.includes("dermatolog")) return ScanFace;
  if (specialtyLower.includes("neurolog")) return Brain;
  if (specialtyLower.includes("oftalmolog")) return Eye;
  if (specialtyLower.includes("otorrinolaringolog")) return Ear;
  if (specialtyLower.includes("psiquiatri")) return Brain;
  if (specialtyLower.includes("nutricion")) return Apple;
  if (specialtyLower.includes("endocrinolog")) return Brain;
  if (specialtyLower.includes("gastroenterolog")) return Brain;
  if (specialtyLower.includes("hematolog")) return Brain;
  if (specialtyLower.includes("hepatolog")) return Brain;
  if (specialtyLower.includes("nefrolog")) return Brain;
  if (specialtyLower.includes("oncolog")) return Brain;
  if (specialtyLower.includes("psiquiatri")) return Brain;

  return Stethoscope;
}

export default function TopSpecialties({ specialties }: TopSpecialtiesProps) {
  const maxAppointments = Math.max(...specialties.map(i => i.appointments));
  return (
    <Card className="max-auto w-full">

      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Hospital className=" text-purple-500" />
          <CardTitle className="text-base">Especialidades</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        {specialties.map((specialty) => {
          const Icon = getSpecialtyIcon(specialty.specialty);
          const progressValue = (specialty.appointments / maxAppointments) * 100;
          return (
            
          <div key={specialty.specialty} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex w-full flex-col justify-center">
                <div className="flex w-full justify-between">
                  <h3 className="text-sm font-semibold">{specialty.specialty}</h3>
                  <div className="text-right">
                    <span className="text-sm font-medium text-muted-foreground">
                      {specialty.appointments} agend.
                    </span>
                  </div>
                </div>
                <Progress value={progressValue} className="mt-2" />
              </div>
          </div>
          )
        }
        )}
      </CardContent>
      
    </Card>
  )
}

