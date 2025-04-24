
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ConductorFormValues } from "@/types/conductor-form";
import ImageUpload from "@/components/conductores/ImageUpload";

interface ConductorDocsFormProps {
  form: UseFormReturn<ConductorFormValues>;
}

const ConductorDocsForm: React.FC<ConductorDocsFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fecha de Vencimiento de Cédula */}
        <FormField
          control={form.control}
          name="fechaVencimientoCedula"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Vencimiento de Cédula <span className="text-red-500">*</span></FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Seleccione fecha</span>
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
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={es}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha de Vencimiento de Licencia */}
        <FormField
          control={form.control}
          name="fechaVencimientoLicencia"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Vencimiento de Licencia <span className="text-red-500">*</span></FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Seleccione fecha</span>
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
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={es}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Imagen de Cédula */}
        <FormField
          control={form.control}
          name="imagenCedula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen de Cédula <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <ImageUpload
                  label="Imagen de Cédula"
                  value={field.value instanceof File ? field.value : null}
                  onChange={field.onChange}
                  error={form.formState.errors.imagenCedula?.message}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Imagen de Licencia */}
        <FormField
          control={form.control}
          name="imagenLicencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen de Licencia <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <ImageUpload
                  label="Imagen de Licencia"
                  value={field.value instanceof File ? field.value : null}
                  onChange={field.onChange}
                  error={form.formState.errors.imagenLicencia?.message}
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

export default ConductorDocsForm;
