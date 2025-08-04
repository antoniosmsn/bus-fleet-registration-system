
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const formSchema = z.object({
  distanciaEntreParadas: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 10 && num <= 100;
  }, "Debe estar entre 10 y 100 metros"),
  horaConfirmacionPlaneacion: z.string().min(1, "Este campo es requerido"),
  mesesConsultaPasajerosSinMovimiento: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 1 && num <= 12;
  }, "Debe estar entre 1 y 12 meses"),
  tiempoEnvioTelemetria: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 1 && num <= 60;
  }, "Debe estar entre 1 y 60 minutos"),
  limiteVelocidadBuses: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 30 && num <= 120;
  }, "Debe estar entre 30 y 120 km/h"),
  tiempoEnvioAlertas: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 10 && num <= 120;
  }, "Debe estar entre 10 y 120 minutos"),
  horaPrediccionDemanda: z.string().min(1, "Este campo es requerido"),
  tiempoAntelacionPrediccion: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 24 && num <= 48;
  }, "Debe estar entre 24 y 48 horas"),
  diasEliminacionSolicitudesPasajero: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 1 && num <= 30;
  }, "Debe estar entre 1 y 30 días"),
  tiempoRegeneracionQR: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 1 && num <= 72;
  }, "Debe estar entre 1 y 72 horas"),
  tiempoActualizacionInfoPasajero: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 30 && num <= 365;
  }, "Debe estar entre 30 y 365 días"),
  diasSinRespuestaTiquetes: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 1 && num <= 15;
  }, "Debe estar entre 1 y 15 días"),
  tiempoValidezQR: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 5 && num <= 60;
  }, "Debe estar entre 5 y 60 minutos"),
  tiempoPasajeroEnViaje: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 30 && num <= 300;
  }, "Debe estar entre 30 y 300 minutos"),
  limiteDiarioViajes: z.string().min(1, "Este campo es requerido").refine(val => {
    const num = parseInt(val);
    return num >= 1 && num <= 10;
  }, "Debe estar entre 1 y 10 viajes"),
});

const ConfiguracionParametros = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      distanciaEntreParadas: "25",
      horaConfirmacionPlaneacion: "18:00",
      mesesConsultaPasajerosSinMovimiento: "3",
      tiempoEnvioTelemetria: "5",
      limiteVelocidadBuses: "80",
      tiempoEnvioAlertas: "30",
      horaPrediccionDemanda: "00:01",
      tiempoAntelacionPrediccion: "24",
      diasEliminacionSolicitudesPasajero: "7",
      tiempoRegeneracionQR: "24",
      tiempoActualizacionInfoPasajero: "180",
      diasSinRespuestaTiquetes: "3",
      tiempoValidezQR: "15",
      tiempoPasajeroEnViaje: "120",
      limiteDiarioViajes: "4",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Parámetros actualizados",
      description: "Los parámetros se han actualizado exitosamente.",
    });
  };

  const FieldWithTooltip = ({ label, tooltip, children }: { label: string, tooltip: string, children: React.ReactNode }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FormLabel>{label}</FormLabel>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type="button">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Parámetros del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="operaciones" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
                    <TabsTrigger value="operaciones">Operaciones</TabsTrigger>
                    <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
                    <TabsTrigger value="pasajeros">Pasajeros</TabsTrigger>
                    <TabsTrigger value="telemetria">Telemetría</TabsTrigger>
                  </TabsList>

                  <TabsContent value="operaciones" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <FormField
                         control={form.control}
                         name="distanciaEntreParadas"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Distancia entre paradas (metros)"
                               tooltip="Distancia mínima requerida entre paradas de autobús. Valor entre 10 y 100 metros. Afecta la planificación de rutas y ubicación de paradas."
                             >
                               <FormControl>
                                 <Input type="number" min="10" max="100" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="horaConfirmacionPlaneacion"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Hora confirmación de planeación"
                               tooltip="Hora límite diaria para confirmar la planeación del día siguiente. Formato 24 horas (HH:MM). Después de esta hora no se pueden hacer cambios a la programación."
                             >
                               <FormControl>
                                 <Input type="time" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="limiteVelocidadBuses"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Límite velocidad de los autobuses (km/h)"
                               tooltip="Velocidad máxima permitida para los autobuses. Valor entre 30 y 120 km/h. Se generan alertas cuando se excede este límite. Considere límites de velocidad locales."
                             >
                               <FormControl>
                                 <Input type="number" min="30" max="120" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="horaPrediccionDemanda"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Hora predicción de demanda"
                               tooltip="Hora diaria en que se ejecuta el algoritmo de predicción de demanda. Formato 24 horas (HH:MM). Se recomienda en horas de baja actividad para optimizar recursos."
                             >
                               <FormControl>
                                 <Input type="time" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                    </div>
                  </TabsContent>

                  <TabsContent value="seguridad" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <FormField
                         control={form.control}
                         name="tiempoRegeneracionQR"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Tiempo regeneración QR (horas)"
                               tooltip="Frecuencia en horas para regenerar códigos QR de pasajeros. Valor entre 1 y 72 horas. Mayor frecuencia aumenta seguridad pero puede afectar la experiencia del usuario."
                             >
                               <FormControl>
                                 <Input type="number" min="1" max="72" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="tiempoValidezQR"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Tiempo validez QR (minutos)"
                               tooltip="Tiempo de validez de un código QR desde su generación. Valor entre 5 y 60 minutos. Menor tiempo aumenta seguridad pero debe permitir tiempo suficiente para el abordaje."
                             >
                               <FormControl>
                                 <Input type="number" min="5" max="60" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                    </div>
                  </TabsContent>

                  <TabsContent value="pasajeros" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <FormField
                         control={form.control}
                         name="mesesConsultaPasajerosSinMovimiento"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Meses consulta pasajeros sin movimiento"
                               tooltip="Número de meses para identificar pasajeros inactivos. Valor entre 1 y 12 meses. Se usa para reportes de inactividad y limpieza de datos obsoletos."
                             >
                               <FormControl>
                                 <Input type="number" min="1" max="12" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="tiempoActualizacionInfoPasajero"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Tiempo actualización información pasajero (días)"
                               tooltip="Frecuencia en días para solicitar actualización de información del pasajero. Valor entre 30 y 365 días. Asegura que la información de contacto y documentos estén vigentes."
                             >
                               <FormControl>
                                 <Input type="number" min="30" max="365" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="diasSinRespuestaTiquetes"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Días sin respuesta de tiquetes"
                               tooltip="Número de días para cerrar automáticamente tiquetes sin respuesta. Valor entre 1 y 15 días. Ayuda a mantener el sistema de soporte organizado."
                             >
                               <FormControl>
                                 <Input type="number" min="1" max="15" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="tiempoPasajeroEnViaje"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Tiempo pasajero en viaje (minutos)"
                               tooltip="Tiempo máximo que un pasajero puede permanecer en el autobús. Valor entre 30 y 300 minutos. Se usa para detectar anomalías y optimizar rutas largas."
                             >
                               <FormControl>
                                 <Input type="number" min="30" max="300" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="limiteDiarioViajes"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Límite diario de viajes"
                               tooltip="Número máximo de viajes que un pasajero puede realizar por día. Valor entre 1 y 10 viajes. Ayuda a prevenir abuso del sistema y detectar patrones irregulares."
                             >
                               <FormControl>
                                 <Input type="number" min="1" max="10" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="diasEliminacionSolicitudesPasajero"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Días eliminación solicitudes pasajero"
                               tooltip="Número de días para eliminar automáticamente solicitudes no procesadas. Valor entre 1 y 30 días. Mantiene la base de datos limpia de solicitudes obsoletas."
                             >
                               <FormControl>
                                 <Input type="number" min="1" max="30" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                    </div>
                  </TabsContent>

                  <TabsContent value="telemetria" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <FormField
                         control={form.control}
                         name="tiempoEnvioTelemetria"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Tiempo envío de telemetría (minutos)"
                               tooltip="Frecuencia en minutos para envío de datos de telemetría. Valor entre 1 y 60 minutos. Mayor frecuencia proporciona datos más actuales pero consume más ancho de banda."
                             >
                               <FormControl>
                                 <Input type="number" min="1" max="60" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="tiempoEnvioAlertas"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Tiempo envío alertas (minutos)"
                               tooltip="Frecuencia en minutos para verificar y enviar alertas del sistema. Valor entre 10 y 120 minutos. Menor frecuencia permite respuesta más rápida a eventos críticos."
                             >
                               <FormControl>
                                 <Input type="number" min="10" max="120" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="tiempoAntelacionPrediccion"
                         render={({ field }) => (
                           <FormItem>
                             <FieldWithTooltip
                               label="Tiempo antelación predicción (horas)"
                               tooltip="Horas de antelación para generar predicciones de demanda. Valor entre 24 y 48 horas. Permite planificación anticipada pero debe balancearse con precisión de la predicción."
                             >
                               <FormControl>
                                 <Input type="number" min="24" max="48" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FieldWithTooltip>
                           </FormItem>
                         )}
                       />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-4">
                  <Button type="submit">Guardar cambios</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ConfiguracionParametros;

