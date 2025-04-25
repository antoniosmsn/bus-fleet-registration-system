
import React from 'react';
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button"; // Added Button import
import { ConductorEditFormValues } from '@/types/conductor-form';
import { empresasTransporte } from '@/services/conductorService';

interface ConductorInfoFormProps {
  form: any;
  editMode?: boolean;
  canChangeCompany?: boolean;
}

const ConductorInfoForm = ({ form, editMode = false, canChangeCompany = false }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="empresaTransporte"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Empresa de Transporte <span className="text-red-500">*</span></FormLabel>
            <Select disabled={!canChangeCompany}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una empresa" {...field} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {empresasTransporte.map((empresa) => (
                  <SelectItem key={empresa} value={empresa}>{empresa}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="numeroCedula"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Cédula <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Ingrese el número de cédula" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nombre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Ingrese el nombre" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex space-x-4">
        <FormField
          control={form.control}
          name="primerApellido"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>Primer Apellido <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el primer apellido" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="segundoApellido"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>Segundo Apellido</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el segundo apellido" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="fechaNacimiento"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Fecha de Nacimiento <span className="text-red-500">*</span></FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="telefono"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teléfono <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Ingrese el teléfono" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label>Estado del Conductor</Label>
          <FormDescription>
            Determina si el conductor puede acceder al sistema y ser asignado a operaciones
          </FormDescription>
        </div>
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value === 'Activo'}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? 'Activo' : 'Inactivo');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ConductorInfoForm;
