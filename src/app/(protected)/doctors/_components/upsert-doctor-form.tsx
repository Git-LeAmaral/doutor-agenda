import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { upsertDoctor } from "@/actions/upsert-doctor";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorsTable } from "@/db/schema";

import { medicalSpecialties } from "../_constants";

const formSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    specialty: z
      .string()
      .trim()
      .min(1, { message: "Especialidade é obrigatória" }),
    appointmentPrice: z
      .number()
      .min(1, { message: "Preço da consulta é obrigatório" }),
    availableFromWeekdays: z.string(),
    availableToWeekDays: z.string(),
    availableFromTime: z
      .string()
      .min(1, { message: "Horário de início é obrigatório" }),
    availableToTime: z
      .string()
      .min(1, { message: "Horário de término é obrigatório" }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message: "Horário de início deve ser menor que o horário de término",
      path: ["availableToTime"],
    },
  );

interface UpsertDoctorFormProps {
  doctor?: typeof doctorsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertDoctorForm = ({doctor, onSuccess }: UpsertDoctorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor?.name ?? "",
      specialty: doctor?.specialty ?? "",
      appointmentPrice: doctor?.appointmentPriceInCents ? doctor.appointmentPriceInCents / 100 : 0,
      availableFromWeekdays: doctor?.availableFromWeekDay.toString() ?? "1",
      availableToWeekDays: doctor?.availableToWeekDay.toString() ?? "5",
      availableFromTime: doctor?.availableFromTime ?? "",
      availableToTime: doctor?.availableToTime ?? "",
    },
  });

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success("Médico adicionado com sucesso");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao adicionar médico");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertDoctorAction.execute({
      ...values,
      id: doctor?.id,
      availableFromWeekdays: parseInt(values.availableFromWeekdays),
      availableToWeekDays: parseInt(values.availableToWeekDays),
      appointmentPriceInCents: values.appointmentPrice * 100,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{doctor ? doctor.name : "Adicionar Médico"}</DialogTitle>
        <DialogDescription>
          {doctor ? "Edite as informações do médico" : "Adicione um novo médico."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medicalSpecialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço da consulta</FormLabel>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value.floatValue);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    thousandSeparator="."
                    customInput={Input}
                    prefix="R$"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFromWeekdays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia de início de atendimento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione os dias de atendimento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Domingo</SelectItem>
                    <SelectItem value="1">Segunda-feira</SelectItem>
                    <SelectItem value="2">Terça-feira</SelectItem>
                    <SelectItem value="3">Quarta-feira</SelectItem>
                    <SelectItem value="4">Quinta-feira</SelectItem>
                    <SelectItem value="5">Sexta-feira</SelectItem>
                    <SelectItem value="6">Sábado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
            control={form.control}
            name="availableToWeekDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia de término de atendimento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o dia de término de atendimento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Domingo</SelectItem>
                    <SelectItem value="1">Segunda-feira</SelectItem>
                    <SelectItem value="2">Terça-feira</SelectItem>
                    <SelectItem value="3">Quarta-feira</SelectItem>
                    <SelectItem value="4">Quinta-feira</SelectItem>
                    <SelectItem value="5">Sexta-feira</SelectItem>
                    <SelectItem value="6">Sábado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFromTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de início de atendimento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o horário de início de atendimento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Horários da Manhã</SelectLabel>
                      <SelectItem value="08:00:00">08:00</SelectItem>
                      <SelectItem value="09:00:00">09:00</SelectItem>
                      <SelectItem value="10:00:00">10:00</SelectItem>
                      <SelectItem value="11:00:00">11:00</SelectItem>
                      <SelectItem value="12:00:00">12:00</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Horários da Tarde</SelectLabel>
                      <SelectItem value="13:00:00">13:00</SelectItem>
                      <SelectItem value="14:00:00">14:00</SelectItem>
                      <SelectItem value="15:00:00">15:00</SelectItem>
                      <SelectItem value="16:00:00">16:00</SelectItem>
                      <SelectItem value="17:00:00">17:00</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Horários da Noite</SelectLabel>
                      <SelectItem value="18:00:00">18:00</SelectItem>
                      <SelectItem value="19:00:00">19:00</SelectItem>
                      <SelectItem value="20:00:00">20:00</SelectItem>
                      <SelectItem value="21:00:00">21:00</SelectItem>
                      <SelectItem value="22:00:00">22:00</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableToTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de término de atendimento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o horário de término de atendimento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Horários da Manhã</SelectLabel>
                      <SelectItem value="08:00:00">08:00</SelectItem>
                      <SelectItem value="09:00:00">09:00</SelectItem>
                      <SelectItem value="10:00:00">10:00</SelectItem>
                      <SelectItem value="11:00:00">11:00</SelectItem>
                      <SelectItem value="12:00:00">12:00</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Horários da Tarde</SelectLabel>
                      <SelectItem value="13:00:00">13:00</SelectItem>
                      <SelectItem value="14:00:00">14:00</SelectItem>
                      <SelectItem value="15:00:00">15:00</SelectItem>
                      <SelectItem value="16:00:00">16:00</SelectItem>
                      <SelectItem value="17:00:00">17:00</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Horários da Noite</SelectLabel>
                      <SelectItem value="18:00:00">18:00</SelectItem>
                      <SelectItem value="19:00:00">19:00</SelectItem>
                      <SelectItem value="20:00:00">20:00</SelectItem>
                      <SelectItem value="21:00:00">21:00</SelectItem>
                      <SelectItem value="22:00:00">22:00</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={upsertDoctorAction.isPending}>
              {upsertDoctorAction.isPending ? "Atualizando..." : doctor ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
