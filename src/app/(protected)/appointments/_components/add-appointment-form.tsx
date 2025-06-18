"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { addAppointment } from "@/actions/add-appointment";
import { getAvailableTimes } from "@/actions/get-available-times";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorsTable, patientsTable } from "@/db/schema";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  patientId: z.string().min(1, { message: "Selecione um paciente" }),
  doctorId: z.string().min(1, { message: "Selecione um médico" }),
  appointmentPrice: z.number().min(1, { message: "Valor da consulta é obrigatório" }),
  date: z.date({ message: "Selecione uma data" }),
  time: z.string().min(1, { message: "Selecione um horário" }),
});

interface AddAppointmentFormProps {
  isOpen: boolean;
  doctors: (typeof doctorsTable.$inferSelect)[];
  patients: (typeof patientsTable.$inferSelect)[];
  onSuccess?: () => void;
}

const AddAppointmentForm = ({
  isOpen,
  doctors,
  patients,
  onSuccess,
}: AddAppointmentFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentPrice: 0,
      date: undefined,
      time: "",
    },
  });

  const selectedPatientId = form.watch("patientId");
  const selectedDoctorId = form.watch("doctorId");
  const selectedDate = form.watch("date");

  const { data: availableTimes, isLoading: isLoadingTimes } = useQuery({
    queryKey: ["available-times", selectedDate, selectedDoctorId],
    queryFn: async () => {
      const result = await getAvailableTimes({
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
        doctorId: selectedDoctorId, 
      });
      return result?.data || [];
    },
    enabled: !!(selectedDate && selectedDoctorId), // Só executa se tiver data e médico
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: "",
        doctorId: "",
        appointmentPrice: 0,
        date: undefined,
        time: "",
      });
    }
  }, [isOpen, form]);

  // Atualiza o valor da consulta quando o médico é selecionado
  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoctor = doctors.find(
        (doctor) => doctor.id === selectedDoctorId,
      );

      if (selectedDoctor) {
        form.setValue("appointmentPrice", selectedDoctor.appointmentPriceInCents / 100);
      }
    }
  }, [selectedDoctorId, doctors, form]);

  const addAppointmentAction = useAction(addAppointment, {
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao criar agendamento");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addAppointmentAction.execute({
      ...values,
      appointmentPriceInCents: values.appointmentPrice * 100,
    })
  };

  const isDateAvailable = (date: Date) => {
    const selectedDoctor = doctors.find(
      (doctor) => doctor.id === selectedDoctorId,
    );
    if (!selectedDoctor) return false;
    
    const dayOfWeek = date.getDay();
    const isAvailable = (
      dayOfWeek >= selectedDoctor.availableFromWeekDay &&
      dayOfWeek <= selectedDoctor.availableToWeekDay
    );
    
    // Debug log
    console.log(`Data: ${date.toDateString()}, Dia da semana: ${dayOfWeek}, Médico disponível de ${selectedDoctor.availableFromWeekDay} a ${selectedDoctor.availableToWeekDay}, Disponível: ${isAvailable}`);
    
    return isAvailable;
  }

  const isDateTimeEnabled = selectedPatientId && selectedDoctorId;

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Novo Agendamento</DialogTitle>
        <DialogDescription>
          Preencha os dados para criar um novo agendamento.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Select de Pacientes */}
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Paciente</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select de Médicos */}
          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Valor da Consulta */}
          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da Consulta</FormLabel>
                <FormControl>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    disabled={!selectedDoctorId}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue || 0);
                    }}
                    value={field.value}
                    customInput={Input}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Data */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        data-empty={!field.value}
                        disabled={!isDateTimeEnabled}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar 
                      mode="single" 
                      selected={field.value} 
                      onSelect={field.onChange}
                      disabled={(date) => {
                        // Sempre desabilitar datas passadas
                        if (date < new Date()) return true;
                        
                        // Se não há médico selecionado, desabilitar todas as datas
                        if (!selectedDoctorId) return true;
                        
                        // Verificar disponibilidade do médico
                        return !isDateAvailable(date);
                      }}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select de Horários */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={!isDateTimeEnabled || !selectedDate}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingTimes ? (
                      <div className="py-2 px-2 text-sm text-muted-foreground text-center">
                        Carregando horários...
                      </div>
                    ) : availableTimes && availableTimes.length > 0 ? (
                      availableTimes.map((time) => (
                        <SelectItem 
                          key={time.value} 
                          value={time.value}
                          disabled={!time.available}
                        >
                          {time.label} {!time.available && "(Indisponível)"}
                        </SelectItem>
                      ))
                    ) : selectedDate && selectedDoctorId ? (
                      <div className="py-2 px-2 text-sm text-muted-foreground text-center">
                        Nenhum horário disponível
                      </div>
                    ) : null}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" className="w-full">
              Criar Agendamento
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddAppointmentForm; 