
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
import Navbar from "@/components/layout/Navbar";

const formSchema = z.object({
  distanciaEntreParadas: z.string().min(1, "Este campo es requerido"),
  horaConfirmacionPlaneacion: z.string().min(1, "Este campo es requerido"),
  mesesConsultaPasajerosSinMovimiento: z.string().min(1, "Este campo es requerido"),
  tiempoEnvioTelemetria: z.string().min(1, "Este campo es requerido"),
  limiteVelocidadBuses: z.string().min(1, "Este campo es requerido"),
  tiempoEnvioAlertas: z.string().min(1, "Este campo es requerido"),
  horaPrediccionDemanda: z.string().min(1, "Este campo es requerido"),
  tiempoAntelacionPrediccion: z.string().min(1, "Este campo es requerido"),
  diasEliminacionSolicitudesPasajero: z.string().min(1, "Este campo es requerido"),
  tiempoRegeneracionQR: z.string().min(1, "Este campo es requerido"),
  tiempoActualizacionInfoPasajero: z.string().min(1, "Este campo es requerido"),
  diasSinRespuestaTiquetes: z.string().min(1, "Este campo es requerido"),
  tiempoValidezQR: z.string().min(1, "Este campo es requerido"),
  tiempoPasajeroEnViaje: z.string().min(1, "Este campo es requerido"),
  limiteDiarioViajes: z.string().min(1, "Este campo es requerido"),
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Parámetros Generales del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="distanciaEntreParadas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distancia entre paradas (metros)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="horaConfirmacionPlaneacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora confirmación de planeación</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mesesConsultaPasajerosSinMovimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meses para consulta de pasajeros sin movimiento</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiempoEnvioTelemetria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo envío de telemetría (minutos)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="limiteVelocidadBuses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Límite velocidad de los autobuses (km/h)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiempoEnvioAlertas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo envío alertas (minutos)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="horaPrediccionDemanda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora predicción de demanda</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiempoAntelacionPrediccion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo antelación predicción (horas)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="24" max="48" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diasEliminacionSolicitudesPasajero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Días eliminación solicitudes pasajero</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiempoRegeneracionQR"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo regeneración QR (horas)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiempoActualizacionInfoPasajero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo actualización información pasajero (días)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diasSinRespuestaTiquetes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Días sin respuesta de tiquetes</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiempoValidezQR"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo validez QR (minutos)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiempoPasajeroEnViaje"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo pasajero en viaje (minutos)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="limiteDiarioViajes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Límite diario de viajes</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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

