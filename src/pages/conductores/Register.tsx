
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { conductorFormSchema, ConductorFormValues } from "@/types/conductor-form";
import { registrarConductor } from "@/services/registroConductorService";
import ConductorInfoForm from '@/components/conductores/ConductorInfoForm';
import ConductorDocsForm from '@/components/conductores/ConductorDocsForm';
import { Form } from "@/components/ui/form";

const RegisterConductor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ConductorFormValues>({
    resolver: zodResolver(conductorFormSchema),
    defaultValues: {
      empresaTransporte: "",
      numeroCedula: "",
      nombre: "",
      primerApellido: "",
      segundoApellido: "",
      telefono: "",
      correoElectronico: "",
      contrasena: "",
      confirmarContrasena: ""
    }
  });

  const onSubmit = async (values: ConductorFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await registrarConductor(values);
      
      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: `${result.message}. Código asignado: ${result.data?.codigo}`
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
      console.error("Error al registrar conductor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al registrar el conductor. Por favor, intente nuevamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold">Registro de Conductor</h1>
          <p className="text-gray-600">Complete el formulario para registrar un nuevo conductor</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs defaultValue="info" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="info">Información General</TabsTrigger>
                  <TabsTrigger value="docs">Documentos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info">
                  <ConductorInfoForm form={form} />
                </TabsContent>
                
                <TabsContent value="docs">
                  <ConductorDocsForm form={form} />
                </TabsContent>
              </Tabs>

              <Alert className="mt-6">
                <AlertDescription>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>El conductor será registrado como "Activo" automáticamente.</li>
                    <li>Se le asignará un código único de 4 dígitos al registrarlo.</li>
                    <li>Solo se almacenará la última imagen cargada para cada documento.</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/conductores")}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && <span className="animate-spin mr-2">●</span>}
                  Registrar Conductor
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterConductor;
