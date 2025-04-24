
import React, { useState } from 'react';
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Search, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ConductorFormValues } from "@/types/conductor-form";
import { getEmpresas } from "@/services/registroConductorService";
import { consultarCedulaHacienda } from "@/services/haciendaService";

interface ConductorInfoFormProps {
  form: UseFormReturn<ConductorFormValues>;
}

const ConductorInfoForm: React.FC<ConductorInfoFormProps> = ({ form }) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSearchingCedula, setIsSearchingCedula] = useState(false);
  
  const empresas = getEmpresas();

  const handleBuscarCedula = async () => {
    const cedula = form.getValues('numeroCedula');
    
    if (!cedula) {
      form.setError('numeroCedula', { message: 'Ingrese un número de cédula para consultar' });
      return;
    }
    
    setIsSearchingCedula(true);
    
    try {
      const response = await consultarCedulaHacienda(cedula);
      
      if (response.success && response.data) {
        form.setValue('nombre', response.data.nombre);
        form.setValue('primerApellido', response.data.primerApellido);
        form.setValue('segundoApellido', response.data.segundoApellido || '');
        
        toast({
          title: "Datos encontrados",
          description: "Se han completado los campos con la información del Ministerio de Hacienda."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Alerta",
          description: response.message || "No se encontraron datos asociados al número de cédula ingresado."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al consultar la cédula. Por favor, intente nuevamente."
      });
    } finally {
      setIsSearchingCedula(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Empresa de Transporte */}
        <FormField
          control={form.control}
          name="empresaTransporte"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa de Transporte <span className="text-red-500">*</span></FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una empresa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa} value={empresa}>
                      {empresa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Número de Cédula */}
        <FormField
          control={form.control}
          name="numeroCedula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Cédula o DIMEX <span className="text-red-500">*</span></FormLabel>
              <div className="flex space-x-2">
                <FormControl>
                  <Input placeholder="Ej. 101230456" {...field} maxLength={12} />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleBuscarCedula}
                  disabled={isSearchingCedula}
                >
                  {isSearchingCedula ? (
                    <span className="animate-spin mr-1">●</span>
                  ) : (
                    <Search className="h-4 w-4 mr-1" />
                  )}
                  Buscar
                </Button>
              </div>
              <FormDescription>
                Utilice el botón de búsqueda para validar en Hacienda
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nombre */}
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo" {...field} maxLength={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Primer Apellido */}
        <FormField
          control={form.control}
          name="primerApellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primer Apellido <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Primer apellido" {...field} maxLength={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Segundo Apellido */}
        <FormField
          control={form.control}
          name="segundoApellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Segundo Apellido</FormLabel>
              <FormControl>
                <Input placeholder="Segundo apellido (opcional)" {...field} maxLength={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha de Nacimiento */}
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
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

        {/* Correo Electrónico */}
        <FormField
          control={form.control}
          name="correoElectronico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input 
                  placeholder="correo@ejemplo.com (opcional)" 
                  {...field} 
                  maxLength={100}
                  type="email" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Teléfono */}
        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ej. 8877-6655" 
                  {...field} 
                  maxLength={20} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contraseña */}
        <FormField
          control={form.control}
          name="contrasena"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña <span className="text-red-500">*</span></FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Contraseña"
                    type={showPassword ? "text" : "password"}
                    {...field}
                    maxLength={12}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <FormDescription>
                Mínimo 4, máximo 12 letras minúsculas (sin i, l, ñ, acentos, símbolos)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirmación de Contraseña */}
        <FormField
          control={form.control}
          name="confirmarContrasena"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Contraseña <span className="text-red-500">*</span></FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Confirmar contraseña"
                    type={showConfirmPassword ? "text" : "password"}
                    {...field}
                    maxLength={12}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ConductorInfoForm;
