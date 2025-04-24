
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
import type { Profile } from '@/types/profile';

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

interface PerfilFormProps {
  initialData?: Profile;
}

// Mock function to check for duplicate profiles
const checkDuplicateProfile = async (nombre: string, id?: number): Promise<boolean> => {
  // Simulating API call - This would be replaced with actual backend validation
  return false;
};

export function PerfilForm({ initialData }: PerfilFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isEditing = !!initialData;
  
  const form = useForm<PerfilFormData>({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
    },
  });

  const onSubmit = async (data: PerfilFormData) => {
    try {
      const isDuplicate = await checkDuplicateProfile(data.nombre, initialData?.id);
      
      if (isDuplicate) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ya existe un perfil con ese nombre en esta zona franca.",
        });
        return;
      }

      // Mock saving the profile - Would be replaced with actual API call
      console.log("Perfil a guardar:", {
        ...data,
        id: initialData?.id,
        activo: true,
      });
      
      toast({
        title: isEditing ? "Perfil actualizado" : "Perfil registrado",
        description: isEditing 
          ? `Perfil '${data.nombre}' actualizado exitosamente.`
          : `Perfil '${data.nombre}' registrado exitosamente.`,
      });
      
      navigate("/perfiles");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: isEditing
          ? "Hubo un error al actualizar el perfil. Por favor, intente nuevamente."
          : "Hubo un error al registrar el perfil. Por favor, intente nuevamente.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/perfiles");
  };

  const handleClear = () => {
    form.reset(isEditing ? { nombre: initialData.nombre } : { nombre: "" });
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
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
