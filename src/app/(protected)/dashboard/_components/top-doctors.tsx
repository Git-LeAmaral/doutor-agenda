import { Stethoscope } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


interface TopDoctorsProps {
  doctors: {
    id: string
    name: string
    avatarImageUrl: string | null
    specialty: string
    appointments: number
  }[];
}

export default function TopDoctors({ doctors }: TopDoctorsProps) {
  return (
    <Card className="max-auto w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Stethoscope className=" text-emerald-600" />
          <CardTitle className="text-base">Médicos</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {doctors.map((doctor) => (
          <div key={doctor.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={doctor.avatarImageUrl || "/placeholder.svg?height=48&width=48"} alt={doctor.name} />
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-semibold">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-muted-foreground">{doctor.appointments} agend.</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

