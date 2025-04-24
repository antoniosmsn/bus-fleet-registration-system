
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Conductor } from "@/types/conductor";
import { ConductorEditFormValues, conductorEditFormSchema } from "@/types/conductor-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ConductorInfoForm from './ConductorInfoForm';
import ConductorDocsForm from './ConductorDocsForm';
import PasswordChangeForm from './PasswordChangeForm';
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateConductor } from "@/services/conductorService";

interface EditConductorDialogProps {
  conductor: Conductor;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  canChangeCompany: boolean;
}

const EditConductorDialog: React.FC<EditConductorDialogProps> = ({
  conductor,
  isOpen,
  onClose,
  onSuccess,
  canChangeCompany
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ConductorEditFormValues>({
    resolver: zodResolver(conductorEditFormSchema),
    defaultValues: {
      empresaTransporte: conductor.empresaTransporte,
      numeroCedula: conductor.numeroCedula,
      nombre: conductor.nombre,
      primerApellido: conductor.apellidos.split(" ")[0],
      segundoApellido: conductor.apellidos.split(" ")[1] || "",
      telefono: conductor.telefono,
      fechaNacimiento: new Date(conductor.fechaNacimiento),
      fechaVencimientoCedula: new Date(conductor.fechaVencimientoCedula),
      fechaVencimientoLicencia: new Date(conductor.fechaVencimientoLicencia),
      estado: conductor.estado,
    }
  });

  const onSubmit = async (values: ConductorEditFormValues) => {
    setIsLoading(true);
    try {
      const result = await updateConductor(conductor.id, values);
      if (result.success) {
        toast({
          title: "Éxito",
          description: "Los datos del conductor han sido actualizados correctamente."
        });
        onSuccess();
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message
        });
      }
    } catch (error) {
      console.error("Error al actualizar conductor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el conductor. Por favor, intente nuevamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      if (!isLoading) onClose();
    }}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editar Conductor - {conductor.codigo}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="info" className="space-y-4">
              <TabsList>
                <TabsTrigger value="info">Información General</TabsTrigger>
                <TabsTrigger value="docs">Documentos</TabsTrigger>
                <TabsTrigger value="password">Cambiar Contraseña</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <ConductorInfoForm 
                  form={form} 
                  editMode={true}
                  canChangeCompany={canChangeCompany}
                />
              </TabsContent>
              
              <TabsContent value="docs">
                <ConductorDocsForm form={form} />
              </TabsContent>

              <TabsContent value="password">
                <PasswordChangeForm conductorId={conductor.id} />
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <span className="animate-spin mr-2">●</span>}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditConductorDialog;
