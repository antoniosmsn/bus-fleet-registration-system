import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Combobox } from '@/components/ui/combobox';
import { PlantillaRenderer } from './PlantillaRenderer';
import { CalificacionDisplay } from './CalificacionDisplay';
import { AlertTriangle, Save, FileCheck } from 'lucide-react';
import { InspeccionRegistro, RespuestaSeccion } from '@/types/inspeccion-autobus';
import { PlantillaInspeccion } from '@/types/inspeccion-autobus';
import { Conductor } from '@/data/mockConductores';
import { AutobusBasico } from '@/data/mockAutobuses';

const formSchema = z.object({
  plantillaId: z.string().min(1, 'Debe seleccionar una plantilla'),
  placa: z.string().min(1, 'Debe seleccionar una placa'),
  conductorId: z.string().min(1, 'Debe seleccionar un conductor'),
  fechaInspeccion: z.string().min(1, 'La fecha es requerida'),
  kilometros: z.number().min(1, 'Los kilómetros deben ser mayor a 0')
});

type FormData = z.infer<typeof formSchema>;

interface InspeccionRegistrationFormProps {
  plantillas: PlantillaInspeccion[];
  conductores: Conductor[];
  autobuses: AutobusBasico[];
  onSubmit: (data: InspeccionRegistro) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function InspeccionRegistrationForm({
  plantillas,
  conductores,
  autobuses,
  onSubmit,
  onCancel,
  isSubmitting = false
}: InspeccionRegistrationFormProps) {
  const [selectedPlantilla, setSelectedPlantilla] = useState<PlantillaInspeccion | null>(null);
  const [respuestasInspeccion, setRespuestasInspeccion] = useState<RespuestaSeccion[]>([]);
  const [calificacionFinal, setCalificacionFinal] = useState<number>(0);
  const [isPlantillaCompleted, setIsPlantillaCompleted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fechaInspeccion: new Date().toISOString().split('T')[0],
      kilometros: 0
    }
  });

  const watchedPlantillaId = watch('plantillaId');
  const watchedPlaca = watch('placa');

  // Actualizar plantilla seleccionada
  useEffect(() => {
    if (watchedPlantillaId) {
      const plantilla = plantillas.find(p => p.id === watchedPlantillaId);
      setSelectedPlantilla(plantilla || null);
      setRespuestasInspeccion([]);
      setCalificacionFinal(0);
      setIsPlantillaCompleted(false);
    }
  }, [watchedPlantillaId, plantillas]);

  // Opciones para combobox
  const plantillaOptions = plantillas.map(p => ({
    value: p.id,
    label: p.nombre
  }));

  const autobusOptions = autobuses.map(a => ({
    value: a.placa,
    label: `${a.placa} - ${a.modelo} (${a.anio})`
  }));

  const conductorOptions = conductores.map(c => ({
    value: c.id,
    label: `${c.nombre} ${c.apellidos} - ${c.codigo}`
  }));

  const handleRespuestasChange = (respuestas: RespuestaSeccion[], calificacion: number, completed: boolean) => {
    setRespuestasInspeccion(respuestas);
    setCalificacionFinal(calificacion);
    setIsPlantillaCompleted(completed);
  };

  const handleFormSubmit = async (data: FormData) => {
    if (!selectedPlantilla || !isPlantillaCompleted) {
      return;
    }

    const inspeccionData: InspeccionRegistro = {
      plantillaId: data.plantillaId,
      placa: data.placa,
      conductorId: data.conductorId,
      fechaInspeccion: data.fechaInspeccion,
      kilometros: data.kilometros,
      respuestas: respuestasInspeccion
    };

    await onSubmit(inspeccionData);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="inspeccion" disabled={!selectedPlantilla}>
            Matriz de Inspección
            {selectedPlantilla && isPlantillaCompleted && (
              <FileCheck className="ml-2 h-4 w-4 text-green-600" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Datos Generales de la Inspección</CardTitle>
              <CardDescription>
                Complete la información básica para la inspección del autobús
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plantilla de Inspección *</Label>
                  <Combobox
                    options={plantillaOptions}
                    value={watchedPlantillaId || ''}
                    onValueChange={(value) => setValue('plantillaId', value)}
                    placeholder="Seleccionar plantilla"
                    searchPlaceholder="Buscar plantilla..."
                    emptyText="No se encontraron plantillas"
                  />
                  {errors.plantillaId && (
                    <p className="text-sm text-destructive">{errors.plantillaId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaInspeccion">Fecha de Inspección *</Label>
                  <Input
                    id="fechaInspeccion"
                    type="date"
                    {...register('fechaInspeccion')}
                    disabled={isSubmitting}
                  />
                  {errors.fechaInspeccion && (
                    <p className="text-sm text-destructive">{errors.fechaInspeccion.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kilometros">Kilómetros del Vehículo *</Label>
                  <Input
                    id="kilometros"
                    type="number"
                    min="0"
                    placeholder="Ej: 45000"
                    {...register('kilometros', { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {errors.kilometros && (
                    <p className="text-sm text-destructive">{errors.kilometros.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Placa del Autobús *</Label>
                  <Combobox
                    options={autobusOptions}
                    value={watchedPlaca || ''}
                    onValueChange={(value) => setValue('placa', value)}
                    placeholder="Seleccionar placa"
                    searchPlaceholder="Buscar placa..."
                    emptyText="No hay autobuses disponibles"
                  />
                  {errors.placa && (
                    <p className="text-sm text-destructive">{errors.placa.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Conductor *</Label>
                  <Combobox
                    options={conductorOptions}
                    value={watch('conductorId') || ''}
                    onValueChange={(value) => setValue('conductorId', value)}
                    placeholder="Seleccionar conductor"
                    searchPlaceholder="Buscar conductor..."
                    emptyText="No hay conductores disponibles"
                  />
                  {errors.conductorId && (
                    <p className="text-sm text-destructive">{errors.conductorId.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspeccion">
          {selectedPlantilla ? (
            <div className="space-y-6">
              <PlantillaRenderer
                plantilla={selectedPlantilla}
                onRespuestasChange={handleRespuestasChange}
              />
              
              <CalificacionDisplay 
                calificacion={calificacionFinal}
                plantilla={selectedPlantilla}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Seleccione una plantilla</h3>
                <p className="mt-2 text-muted-foreground">
                  Debe seleccionar una plantilla de inspección en la pestaña de información general.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {!isPlantillaCompleted && selectedPlantilla && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Complete todos los campos obligatorios de la matriz de inspección antes de finalizar.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit(handleFormSubmit)} 
          disabled={isSubmitting || !isPlantillaCompleted}
        >
          {isSubmitting ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-spin" />
              Finalizando...
            </>
          ) : (
            <>
              <FileCheck className="mr-2 h-4 w-4" />
              Finalizar Inspección
            </>
          )}
        </Button>
      </div>
    </div>
  );
}