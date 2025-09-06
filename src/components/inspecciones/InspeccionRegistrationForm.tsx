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
import { Conductor, getConductoresByEmpresaTransporte } from '@/data/mockConductores';
import { AutobusBasico, getAutobusesByTransportista } from '@/data/mockAutobuses';
import { Transportista } from '@/data/mockTransportistas';

const formSchema = z.object({
  plantillaId: z.string().min(1, 'Debe seleccionar una matriz'),
  empresaTransporteId: z.string().min(1, 'Debe seleccionar una empresa'),
  placa: z.string().min(1, 'Debe seleccionar una placa'),
  conductorId: z.string().min(1, 'Debe seleccionar un conductor'),
  fechaInspeccion: z.string().min(1, 'La fecha es requerida'),
  kilometros: z.number().min(1, 'Los kilómetros deben ser mayor a 0')
});

type FormData = z.infer<typeof formSchema>;

interface InspeccionRegistrationFormProps {
  plantillas: PlantillaInspeccion[];
  transportistas: Transportista[];
  conductores: Conductor[];
  autobuses: AutobusBasico[];
  onSubmit: (data: InspeccionRegistro) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Formulario de registro de inspecciones de autobús  
export function InspeccionRegistrationForm({
  plantillas,
  transportistas,
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
      kilometros: 0,
      empresaTransporteId: '',
      placa: '',
      conductorId: ''
    }
  });

  const watchedPlantillaId = watch('plantillaId');
  const watchedEmpresaTransporteId = watch('empresaTransporteId');
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

  // Limpiar placa y conductor cuando cambie la empresa
  useEffect(() => {
    setValue('placa', '');
    setValue('conductorId', '');
  }, [watchedEmpresaTransporteId, setValue]);

  // Opciones para combobox
  const plantillaOptions = plantillas.map(p => ({
    value: p.id,
    label: p.nombre
  }));

  const transportistaOptions = transportistas.map(t => ({
    value: t.id,
    label: `${t.nombre} - ${t.codigo}`
  }));

  // Filtrar autobuses y conductores por empresa seleccionada
  const autobusesFiltered = watchedEmpresaTransporteId 
    ? getAutobusesByTransportista(watchedEmpresaTransporteId)
    : [];

  const conductoresFiltered = watchedEmpresaTransporteId 
    ? getConductoresByEmpresaTransporte(watchedEmpresaTransporteId)
    : [];

  const autobusOptions = autobusesFiltered.map(a => ({
    value: a.placa,
    label: `${a.placa} - ${a.modelo} (${a.anio})`
  }));

  const conductorOptions = conductoresFiltered.map(c => ({
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label>Empresa de transporte *</Label>
                  <Combobox
                    options={transportistaOptions}
                    value={watchedEmpresaTransporteId || ''}
                    onValueChange={(value) => setValue('empresaTransporteId', value)}
                    placeholder="Seleccionar empresa"
                    searchPlaceholder="Buscar empresa..."
                    emptyText="No se encontraron empresas"
                    disabled={isSubmitting}
                  />
                  {errors.empresaTransporteId && (
                    <p className="text-sm text-destructive">{errors.empresaTransporteId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Conductor *</Label>
                  <Combobox
                    options={conductorOptions}
                    value={watch('conductorId') || ''}
                    onValueChange={(value) => setValue('conductorId', value)}
                    placeholder={watchedEmpresaTransporteId ? "Seleccionar conductor" : "Seleccione una empresa primero"}
                    searchPlaceholder="Buscar conductor..."
                    emptyText={watchedEmpresaTransporteId ? "No hay conductores disponibles" : "Seleccione una empresa de transporte"}
                    disabled={isSubmitting || !watchedEmpresaTransporteId}
                  />
                  {errors.conductorId && (
                    <p className="text-sm text-destructive">{errors.conductorId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Placa del Autobús *</Label>
                  <Combobox
                    options={autobusOptions}
                    value={watchedPlaca || ''}
                    onValueChange={(value) => setValue('placa', value)}
                    placeholder={watchedEmpresaTransporteId ? "Seleccionar placa" : "Seleccione una empresa primero"}
                    searchPlaceholder="Buscar placa..."
                    emptyText={watchedEmpresaTransporteId ? "No hay autobuses disponibles" : "Seleccione una empresa de transporte"}
                    disabled={isSubmitting || !watchedEmpresaTransporteId}
                  />
                  {errors.placa && (
                    <p className="text-sm text-destructive">{errors.placa.message}</p>
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
                  <Label>Matriz de revisión *</Label>
                  <Combobox
                    options={plantillaOptions}
                    value={watchedPlantillaId || ''}
                    onValueChange={(value) => setValue('plantillaId', value)}
                    placeholder="Seleccionar matriz"
                    searchPlaceholder="Buscar matriz..."
                    emptyText="No se encontraron matrices"
                    disabled={isSubmitting}
                  />
                  {errors.plantillaId && (
                    <p className="text-sm text-destructive">{errors.plantillaId.message}</p>
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
                <h3 className="mt-4 text-lg font-semibold">Seleccione una matriz</h3>
                <p className="mt-2 text-muted-foreground">
                  Debe seleccionar una matriz de revisión en la pestaña de información general.
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