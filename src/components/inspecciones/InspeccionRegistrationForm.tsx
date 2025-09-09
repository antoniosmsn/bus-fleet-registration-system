import { PlantillaMatriz } from '@/types/plantilla-matriz';
import { InspeccionRegistro, RespuestaSeccion } from '@/types/inspeccion-autobus';
import { PlantillaRenderer } from './PlantillaRenderer';
import { CalificacionDisplay } from './CalificacionDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Combobox } from '@/components/ui/combobox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const formSchema = z.object({
  plantillaId: z.string().min(1, "Debe seleccionar una plantilla"),
  empresaTransporteId: z.string().min(1, "Debe seleccionar una empresa de transporte"),
  placa: z.string().min(1, "Debe seleccionar un autobús"),
  conductorId: z.string().min(1, "Debe seleccionar un conductor"),
  fechaInspeccion: z.string().min(1, "Debe seleccionar una fecha"),
  kilometros: z.number().min(0, "Los kilómetros deben ser un número positivo"),
});

type FormData = z.infer<typeof formSchema>;

interface InspeccionRegistrationFormProps {
  plantillas: PlantillaMatriz[];
  transportistas: any[];
  conductores: any[];
  autobuses: any[];
  onSubmit: (data: InspeccionRegistro) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function InspeccionRegistrationForm({ 
  plantillas, 
  transportistas, 
  conductores, 
  autobuses, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: InspeccionRegistrationFormProps) {
  const [selectedPlantilla, setSelectedPlantilla] = useState<PlantillaMatriz | null>(null);
  const [respuestasInspeccion, setRespuestasInspeccion] = useState<RespuestaSeccion[]>([]);
  const [calificacionFinal, setCalificacionFinal] = useState<number>(0);
  const [isPlantillaCompleted, setIsPlantillaCompleted] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fechaInspeccion: new Date().toISOString().split('T')[0],
      kilometros: 0,
    }
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const watchedEmpresaTransporteId = watch("empresaTransporteId");
  const watchedPlantillaId = watch("plantillaId");

  // Actualizar plantilla seleccionada cuando cambie el ID
  useEffect(() => {
    if (watchedPlantillaId) {
      const plantilla = plantillas.find(p => p.id === watchedPlantillaId);
      setSelectedPlantilla(plantilla || null);
    } else {
      setSelectedPlantilla(null);
    }
  }, [watchedPlantillaId, plantillas]);

  // Limpiar campos dependientes cuando cambie la empresa
  useEffect(() => {
    setValue("conductorId", "");
    setValue("placa", "");
  }, [watchedEmpresaTransporteId, setValue]);

  const handleRespuestasChange = (respuestas: RespuestaSeccion[], calificacion: number, completed: boolean) => {
    setRespuestasInspeccion(respuestas);
    setCalificacionFinal(calificacion);
    setIsPlantillaCompleted(completed);
  };

  const handleFormSubmit = async (data: FormData) => {
    if (!selectedPlantilla || !isPlantillaCompleted) return;

    const inspeccionData: InspeccionRegistro = {
      plantillaId: data.plantillaId,
      placa: data.placa,
      conductorId: data.conductorId,
      fechaInspeccion: data.fechaInspeccion,
      kilometros: data.kilometros,
      respuestas: respuestasInspeccion,
    };

    onSubmit(inspeccionData);
  };

  // Filtrar conductores y autobuses por empresa seleccionada
  const conductoresFiltrados = watchedEmpresaTransporteId 
    ? conductores.filter(c => c.empresaTransporteId === watchedEmpresaTransporteId)
    : [];

  const autobusesFiltrados = watchedEmpresaTransporteId 
    ? autobuses.filter(a => a.empresaTransporteId === watchedEmpresaTransporteId)
    : [];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Información básica de la inspección */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Inspección</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fechaInspeccion">Fecha de Inspección</Label>
            <Input
              id="fechaInspeccion"
              type="date"
              {...register("fechaInspeccion")}
              className={errors.fechaInspeccion ? "border-red-500" : ""}
            />
            {errors.fechaInspeccion && (
              <p className="text-sm text-red-500">{errors.fechaInspeccion.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Empresa de Transporte</Label>
            <Combobox
              options={transportistas.map(t => ({ value: t.id, label: `${t.nombre} - ${t.codigo}` }))}
              value={watchedEmpresaTransporteId || ""}
              onValueChange={(value) => setValue("empresaTransporteId", value)}
              placeholder="Seleccionar empresa..."
              emptyText="No se encontró la empresa"
            />
            {errors.empresaTransporteId && (
              <p className="text-sm text-red-500">{errors.empresaTransporteId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Conductor</Label>
            <Combobox
              options={conductoresFiltrados.map(c => ({ 
                value: c.id, 
                label: `${c.codigo} - ${c.nombre} ${c.apellidos}` 
              }))}
              value={watch("conductorId") || ""}
              onValueChange={(value) => setValue("conductorId", value)}
              placeholder="Seleccionar conductor..."
              emptyText="No hay conductores disponibles"
              disabled={!watchedEmpresaTransporteId}
            />
            {errors.conductorId && (
              <p className="text-sm text-red-500">{errors.conductorId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Placa del Autobús</Label>
            <Combobox
              options={autobusesFiltrados.map(a => ({ 
                value: a.placa, 
                label: `${a.placa} - ${a.numeroChasis}` 
              }))}
              value={watch("placa") || ""}
              onValueChange={(value) => setValue("placa", value)}
              placeholder="Seleccionar autobús..."
              emptyText="No hay autobuses disponibles"
              disabled={!watchedEmpresaTransporteId}
            />
            {errors.placa && (
              <p className="text-sm text-red-500">{errors.placa.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kilometros">Kilometraje Actual</Label>
            <Input
              id="kilometros"
              type="number"
              min="0"
              {...register("kilometros", { valueAsNumber: true })}
              className={errors.kilometros ? "border-red-500" : ""}
            />
            {errors.kilometros && (
              <p className="text-sm text-red-500">{errors.kilometros.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Plantilla de Inspección</Label>
            <Combobox
              options={plantillas.map(p => ({ value: p.id, label: p.nombre }))}
              value={watchedPlantillaId || ""}
              onValueChange={(value) => setValue("plantillaId", value)}
              placeholder="Seleccionar plantilla..."
              emptyText="No hay plantillas disponibles"
            />
            {errors.plantillaId && (
              <p className="text-sm text-red-500">{errors.plantillaId.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Matriz de inspección */}
      {selectedPlantilla && (
        <>
          <PlantillaRenderer
            plantilla={selectedPlantilla}
            onRespuestasChange={handleRespuestasChange}
          />

          <CalificacionDisplay
            calificacionFinal={calificacionFinal}
            pesoTotal={selectedPlantilla.pesoTotal}
          />

          {!isPlantillaCompleted && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Complete todos los campos obligatorios de la matriz de inspección para poder finalizar el proceso.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        
        <Button 
          type="submit" 
          disabled={!isPlantillaCompleted || isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            'Finalizar Inspección'
          )}
        </Button>
      </div>
    </form>
  );
}