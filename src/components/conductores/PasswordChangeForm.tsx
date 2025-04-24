
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/services/conductorService";
import { z } from "zod";

// Create a new schema without the current password field
const editPasswordChangeSchema = z.object({
  newPassword: z
    .string()
    .nonempty("La nueva contraseña es requerida")
    .min(4, "Mínimo 4 caracteres")
    .max(12, "Máximo 12 caracteres")
    .regex(/^[a-hjk-mo-z]+$/, "Solo letras minúsculas (excluyendo i, l, ñ, acentos y símbolos)"),
  confirmNewPassword: z.string().nonempty("La confirmación es requerida"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmNewPassword"],
});

type EditPasswordChangeValues = z.infer<typeof editPasswordChangeSchema>;

interface PasswordChangeFormProps {
  conductorId: number;
  isEditMode?: boolean;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ conductorId, isEditMode = false }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<EditPasswordChangeValues>({
    resolver: zodResolver(editPasswordChangeSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: ""
    }
  });

  const onSubmit = async (values: EditPasswordChangeValues) => {
    setIsLoading(true);
    try {
      const result = await changePassword(conductorId, {
        newPassword: values.newPassword,
      });
      if (result.success) {
        toast({
          title: "Éxito",
          description: "La contraseña ha sido actualizada correctamente."
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar la contraseña."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva Contraseña <span className="text-red-500">*</span></FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    {...field}
                    maxLength={12}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <FormDescription>
                Mínimo 4, máximo 12 letras minúsculas (sin i, l, ñ, acentos, símbolos)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Nueva Contraseña <span className="text-red-500">*</span></FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
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

        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <span className="animate-spin mr-2">●</span>}
            Cambiar Contraseña
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PasswordChangeForm;
