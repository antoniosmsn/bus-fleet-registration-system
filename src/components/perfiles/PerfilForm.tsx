
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const perfilFormSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre es obligatorio" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" })
    .refine((value) => value.trim().length > 0, {
      message: "El nombre no puede estar vacío",
    }),
});

type PerfilFormData = z.infer<typeof perfilFormSchema>;

// Mock function to check for duplicate profiles
const checkDuplicateProfile = async (nombre: string): Promise<boolean> => {
  // This would be replaced with an actual API call
  return false;
};

export function PerfilForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<PerfilFormData>({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: {
      nombre: "",
    },
  });

  const onSubmit = async (data: PerfilFormData) => {
    try {
      const isDuplicate = await checkDuplicateProfile(data.nombre);
      
      if (isDuplicate) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ya existe un perfil con ese nombre en esta zona franca.",
        });
        return;
      }

      // Mock saving the profile
      console.log("Perfil a guardar:", data);
      
      toast({
        title: "Perfil registrado",
        description: `Perfil '${data.nombre}' registrado exitosamente.`,
      });
      
      navigate("/perfiles");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al registrar el perfil. Por favor, intente nuevamente.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/perfiles");
  };

  const handleClear = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del perfil</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ingrese el nombre del perfil" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
          >
            Limpiar
          </Button>
          <Button type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}
