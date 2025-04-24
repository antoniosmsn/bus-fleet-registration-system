import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { conductorEditFormSchema, ConductorEditFormValues } from "@/types/conductor-form";
import { updateConductor } from "@/services/conductorService";
import ConductorInfoForm from '@/components/conductores/ConductorInfoForm';
import ConductorDocsForm from '@/components/conductores/ConductorDocsForm';
import PasswordChangeForm from '@/components/conductores/PasswordChangeForm';
import { Form } from "@/components/ui/form";
import { Conductor } from '@/types/conductor';

const EditConductor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [conductor, setConductor] = React.useState<Conductor | null>(null);

  const form = useForm<ConductorEditFormValues>({
    resolver: zodResolver(conductorEditFormSchema),
  });

  React.useEffect(() => {
    const loadConductor = async () => {
      try {
        const conductorData: Conductor = {
          id: 1,
          codigo: "COND001",
          empresaTransporte: "Empresa 1",
          numeroCedula: "123456789",
          nombre: "John",
          apellidos: "Doe Smith",
          fechaNacimiento: "1990-01-01",
          telefono: "12345678",
          fechaVencimientoCedula: "2024-12-31",
          fechaVencimientoLicencia: "2024-12-31",
          estado: "Activo",
          imagenCedula: "https://scontent.fsjo10-1.fna.fbcdn.net/v/t1.6435-9/29261248_1268414659957459_6474482397776707584_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=vmrLsCSGoHIQ7kNvwFSlUoB&_nc_oc=AdnGd7ub0Gs0elHBzz2dtVgciyw7SCbMQpQIGzuWCIY6hph6qbqci2T1kKNEJ93MS7A&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=mXluId6ioh0ja4dJo__GBQ&oh=00_AfEZO9D1A-B_ZqgfLVYVPtCALPsfvHy2lh0ooNJzWWCjRQ&oe=68322385",
          imagenLicencia: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ68-wGp-1nJC0PeLDbm4hI1fvfCUGm258Zw&s"
        };
        
        setConductor(conductorData);
        
        form.reset({
          empresaTransporte: conductorData.empresaTransporte,
          numeroCedula: conductorData.numeroCedula,
          nombre: conductorData.nombre,
          primerApellido: conductorData.apellidos.split(" ")[0],
          segundoApellido: conductorData.apellidos.split(" ")[1] || "",
          fechaNacimiento: new Date(conductorData.fechaNacimiento),
          telefono: conductorData.telefono,
          fechaVencimientoCedula: new Date(conductorData.fechaVencimientoCedula),
          fechaVencimientoLicencia: new Date(conductorData.fechaVencimientoLicencia),
          estado: conductorData.estado as "Activo" | "Inactivo"
        });
      } catch (error) {
        console.error('Error al cargar conductor:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar la información del conductor"
        });
        navigate("/conductores");
      }
    };

    if (id) {
      loadConductor();
    }
  }, [id, navigate, toast, form]);

  const onSubmit = async (values: ConductorEditFormValues) => {
    if (!conductor) return;
    
    setIsLoading(true);
    try {
      const result = await updateConductor(conductor.id, values);
      
      if (result.success) {
        toast({
          title: "Éxito",
          description: "Los datos del conductor han sido actualizados correctamente."
        });
        navigate("/conductores");
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

  if (!conductor) {
    return null; // O un componente de carga
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/conductores")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
          <h1 className="text-2xl font-bold">Editar Conductor - {conductor.codigo}</h1>
          <p className="text-gray-600">Actualice la información del conductor</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
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
                    canChangeCompany={true}
                  />
                </TabsContent>
                
                <TabsContent value="docs">
                  <ConductorDocsForm 
                    form={form}
                    currentImages={{
                      cedula: conductor.imagenCedula,
                      licencia: conductor.imagenLicencia
                    }}
                  />
                </TabsContent>

                <TabsContent value="password">
                  <PasswordChangeForm 
                    conductorId={conductor.id} 
                    isEditMode={true} 
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/conductores")}
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
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default EditConductor;
