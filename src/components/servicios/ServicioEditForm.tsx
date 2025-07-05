import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { TimePicker } from '@/components/ui/time-picker';
import { toast } from '@/hooks/use-toast';
import { mockTurnos } from '@/data/mockTurnos';
import { mockTransportistas } from '@/data/mockTransportistas';
import { mockRamales } from '@/data/mockRamales';
import { getServicioById, type Servicio } from '@/data/mockServicios';

const servicioSchema = z.object({
  turno: z.string().min(1, 'Turno es requerido'),
  transportista: z.string().min(1, 'Transportista es requerido'),
  ramal: z.string().min(1, 'Ramal es requerido'),
  horario: z.string().min(1, 'Horario es requerido'),
  diasSemana: z.array(z.string()).min(1, 'Debe seleccionar al menos un día'),
  sentido: z.enum(['ingreso', 'salida'], { required_error: 'Sentido es requerido' }),
  cantidadUnidades: z.number().min(1, 'Cantidad debe ser mayor a 0').max(20, 'Máximo 20 unidades'),
  porcentajeFee: z.number().min(0, 'Porcentaje debe ser 0 o mayor').max(100, 'Máximo 100%'),
  agregarCapacidadAdicional: z.boolean().default(false)
});

type ServicioFormData = z.infer<typeof servicioSchema>;

interface ServicioEditFormProps {
  servicioId: string;
}

const ServicioEditForm = ({ servicioId }: ServicioEditFormProps) => {
  const [loading, setLoading] = useState(true);
  const [servicio, setServicio] = useState<Servicio | null>(null);

  const diasSemana = [
    { id: 'lunes', label: 'L' },
    { id: 'martes', label: 'M' },
    { id: 'miercoles', label: 'X' },
    { id: 'jueves', label: 'J' },
    { id: 'viernes', label: 'V' },
    { id: 'sabado', label: 'S' },
    { id: 'domingo', label: 'D' }
  ];

  const form = useForm<ServicioFormData>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      turno: '',
      transportista: '',
      ramal: '',
      horario: '',
      diasSemana: [],
      sentido: 'ingreso',
      cantidadUnidades: 1,
      porcentajeFee: 0,
      agregarCapacidadAdicional: false
    }
  });

  // Cargar datos del servicio
  useEffect(() => {
    const loadServicio = async () => {
      try {
        setLoading(true);
        
        // Simular carga desde API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const servicioData = getServicioById(servicioId);
        
        if (!servicioData) {
          toast({
            title: "Error",
            description: "No se encontró el servicio especificado.",
            variant: "destructive"
          });
          return;
        }

        setServicio(servicioData);
        
        // Cargar datos en el formulario
        form.setValue('turno', servicioData.turno);
        form.setValue('transportista', servicioData.transportista);
        form.setValue('ramal', servicioData.ramal);
        form.setValue('horario', servicioData.horario);
        form.setValue('diasSemana', servicioData.diasSemana);
        form.setValue('sentido', servicioData.sentido);
        form.setValue('cantidadUnidades', servicioData.cantidadUnidades);
        form.setValue('porcentajeFee', servicioData.porcentajeFee);
        form.setValue('agregarCapacidadAdicional', servicioData.agregarCapacidadAdicional);
        
      } catch (error) {
        console.error('Error cargando servicio:', error);
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar los datos del servicio.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (servicioId) {
      loadServicio();
    }
  }, [servicioId, form]);

  const onSubmit = async (data: ServicioFormData) => {
    try {
      console.log('Enviando datos editados:', data);
      
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Servicio actualizado",
        description: "El servicio ha sido actualizado exitosamente."
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el servicio. Por favor intente nuevamente.",
        variant: "destructive"
      });
    }
  };

  const formatRamalLabel = (ramal: typeof mockRamales[0]) => {
    if (ramal.tipoRuta === 'privada' || ramal.tipoRuta === 'especial') {
      return `${ramal.nombre} - ${ramal.tipoRuta.charAt(0).toUpperCase() + ramal.tipoRuta.slice(1)} - ${ramal.empresaCliente}`;
    }
    return `${ramal.nombre} - ${ramal.tipoRuta.charAt(0).toUpperCase() + ramal.tipoRuta.slice(1)}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando datos del servicio...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!servicio) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No se encontró el servicio especificado.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Servicio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Turno y Sentido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="turno">Turno*</Label>
              <Select
                value={form.watch('turno')}
                onValueChange={(value) => form.setValue('turno', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar turno" />
                </SelectTrigger>
                <SelectContent>
                  {mockTurnos.map((turno) => (
                    <SelectItem key={turno.id} value={turno.id}>
                      {turno.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.turno && (
                <p className="text-sm text-destructive">{form.formState.errors.turno.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sentido">Sentido*</Label>
              <Select
                value={form.watch('sentido')}
                onValueChange={(value: 'ingreso' | 'salida') => form.setValue('sentido', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sentido" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingreso">Ingreso</SelectItem>
                  <SelectItem value="salida">Salida</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.sentido && (
                <p className="text-sm text-destructive">{form.formState.errors.sentido.message}</p>
              )}
            </div>
          </div>

          {/* Transportista */}
          <div className="space-y-2">
            <Label htmlFor="transportista">Transportista*</Label>
            <Combobox
              options={mockTransportistas.map(t => ({ value: t.id, label: `${t.nombre} (${t.codigo})` }))}
              value={form.watch('transportista')}
              onValueChange={(value) => form.setValue('transportista', value)}
              placeholder="Buscar transportista..."
            />
            {form.formState.errors.transportista && (
              <p className="text-sm text-destructive">{form.formState.errors.transportista.message}</p>
            )}
          </div>

          {/* Ramal */}
          <div className="space-y-2">
            <Label htmlFor="ramal">Ramal*</Label>
            <Combobox
              options={mockRamales.map(r => ({ value: r.id, label: formatRamalLabel(r) }))}
              value={form.watch('ramal')}
              onValueChange={(value) => form.setValue('ramal', value)}
              placeholder="Buscar ramal..."
            />
            {form.formState.errors.ramal && (
              <p className="text-sm text-destructive">{form.formState.errors.ramal.message}</p>
            )}
          </div>

          {/* Horario y Cantidad de Unidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horario">Horario*</Label>
              <TimePicker
                value={form.watch('horario') || ''}
                onValueChange={(value) => form.setValue('horario', value)}
              />
              {form.formState.errors.horario && (
                <p className="text-sm text-destructive">{form.formState.errors.horario.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidadUnidades">Cantidad de Unidades*</Label>
              <Input
                type="number"
                min="1"
                max="20"
                {...form.register('cantidadUnidades', { valueAsNumber: true })}
              />
              {form.formState.errors.cantidadUnidades && (
                <p className="text-sm text-destructive">{form.formState.errors.cantidadUnidades.message}</p>
              )}
            </div>
          </div>

          {/* Porcentaje Fee */}
          <div className="space-y-2">
            <Label htmlFor="porcentajeFee">Porcentaje Fee*</Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0.00"
              {...form.register('porcentajeFee', { valueAsNumber: true })}
            />
            {form.formState.errors.porcentajeFee && (
              <p className="text-sm text-destructive">{form.formState.errors.porcentajeFee.message}</p>
            )}
          </div>

          {/* Días de la semana */}
          <div className="space-y-2">
            <Label>Días de la semana*</Label>
            <div className="flex flex-wrap gap-4">
              {diasSemana.map((dia) => (
                <div key={dia.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={dia.id}
                    checked={(form.watch('diasSemana') || []).includes(dia.id)}
                    onCheckedChange={(checked) => {
                      const diasActuales = form.watch('diasSemana') || [];
                      if (checked) {
                        form.setValue('diasSemana', [...diasActuales, dia.id]);
                      } else {
                        form.setValue('diasSemana', diasActuales.filter(d => d !== dia.id));
                      }
                    }}
                  />
                  <Label htmlFor={dia.id} className="text-sm font-medium">
                    {dia.label} - {dia.id.charAt(0).toUpperCase() + dia.id.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
            {form.formState.errors.diasSemana && (
              <p className="text-sm text-destructive">{form.formState.errors.diasSemana.message}</p>
            )}
          </div>

          {/* Capacidad adicional */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agregarCapacidadAdicional"
              checked={form.watch('agregarCapacidadAdicional')}
              onCheckedChange={(checked) => form.setValue('agregarCapacidadAdicional', !!checked)}
            />
            <Label htmlFor="agregarCapacidadAdicional" className="text-sm">
              Agregar capacidad adicional
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Actualizando...' : 'Actualizar Servicio'}
        </Button>
      </div>
    </form>
  );
};

export default ServicioEditForm;