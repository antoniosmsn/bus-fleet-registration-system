
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";

const formSchema = z.object({
  zonaFranca: z.string({
    required_error: "Por favor seleccione una zona franca",
  }),
  sistema: z.object({
    precisionGPSControl: z.string().min(1, "Este campo es requerido"),
    precisionGPSReferencia: z.string().min(1, "Este campo es requerido"),
    velocidadMaxima: z.string().min(1, "Este campo es requerido"),
    mostrarTiempoReal: z.string().min(1, "Este campo es requerido"),
    tiempoHolguraRoles: z.string().min(1, "Este campo es requerido"),
    tiempoRecargaAlarmas: z.string().min(1, "Este campo es requerido"),
    maxKilometrajeAlerta: z.string().min(1, "Este campo es requerido"),
    maxPasajerosAlerta: z.string().min(1, "Este campo es requerido"),
  }),
});

const ZoneParametersConfig = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sistema: {
        precisionGPSControl: "100",
        precisionGPSReferencia: "175",
        velocidadMaxima: "95",
        mostrarTiempoReal: "Si",
        tiempoHolguraRoles: "2880",
        tiempoRecargaAlarmas: "60",
        maxKilometrajeAlerta: "20",
        maxPasajerosAlerta: "10",
      },
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
            <CardTitle>Establecer parámetros de la zona franca</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="zonaFranca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una empresa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="zona1">Zona Franca 1</SelectItem>
                          <SelectItem value="zona2">Zona Franca 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Sistema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="sistema.precisionGPSControl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precisión de GPS para puntos de control (m)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sistema.precisionGPSReferencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precisión de GPS para puntos de referencia (m)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sistema.velocidadMaxima"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Velocidad máxima permitida (km/h)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sistema.mostrarTiempoReal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mostrar opciones de tiempo real</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Si">Sí</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sistema.tiempoHolguraRoles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiempo de holgura Análisis Roles (min)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sistema.tiempoRecargaAlarmas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiempo de recarga Alarmas (seg)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sistema.maxKilometrajeAlerta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Máximo kilometraje recorrido alerta (km)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sistema.maxPasajerosAlerta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Máximo de pasajeros del recorrido Alerta</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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

export default ZoneParametersConfig;
