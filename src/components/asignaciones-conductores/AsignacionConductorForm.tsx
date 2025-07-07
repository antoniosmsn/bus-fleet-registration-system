import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Combobox } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { mockServicios, Servicio } from '@/data/mockServicios';
import { mockConductores, getConductoresByEmpresaTransporte } from '@/data/mockConductores';
import { mockTransportistas } from '@/data/mockTransportistas';
import { mockTurnos } from '@/data/mockTurnos';
import { mockRamales } from '@/data/mockRamales';

const asignacionSchema = z.object({
  empresaTransporte: z.string().min(1, 'Empresa de transporte es requerida'),
  fechaOperacion: z.string().min(1, 'Fecha de operación es requerida'),
  asignaciones: z.record(z.string().optional())
});

interface ServicioConAsignacion extends Servicio {
  fechaOperacion: string;
  conductorAsignado?: string;
  conflictoHorario: boolean;
}

const DURACION_TRASLAPE_MINUTOS = 30;

const AsignacionConductorForm = () => {
  const [serviciosFiltrados, setServiciosFiltrados] = useState<ServicioConAsignacion[]>([]);
  const [conflictos, setConflictos] = useState<string[]>([]);
  const [mostrarServicios, setMostrarServicios] = useState(false);

  const form = useForm<{
    empresaTransporte: string;
    fechaOperacion: string;
    asignaciones: Record<string, string>;
  }>({
    resolver: zodResolver(asignacionSchema),
    defaultValues: {
      empresaTransporte: '',
      fechaOperacion: '',
      asignaciones: {}
    }
  });

  const watchedValues = form.watch();
  const { empresaTransporte, fechaOperacion, asignaciones } = watchedValues;

  // Función para verificar si un día de la semana corresponde a una fecha
  const verificarDiaServicio = (diasSemana: string[], fecha: string): boolean => {
    const diasSemanaMap: Record<string, number> = {
      'domingo': 0,
      'lunes': 1,
      'martes': 2,
      'miercoles': 3,
      'jueves': 4,
      'viernes': 5,
      'sabado': 6
    };

    const fechaObj = new Date(fecha);
    const diaSemana = fechaObj.getDay();

    return diasSemana.some(dia => diasSemanaMap[dia] === diaSemana);
  };

  // Función para verificar conflictos de horario
  const verificarConflictosHorario = (
    horarioNuevo: string,
    serviciosAsignados: { horario: string }[]
  ): boolean => {
    const [horasNuevo, minutosNuevo] = horarioNuevo.split(':').map(Number);
    const tiempoNuevo = horasNuevo * 60 + minutosNuevo;

    return serviciosAsignados.some(servicio => {
      const [horas, minutos] = servicio.horario.split(':').map(Number);
      const tiempoExistente = horas * 60 + minutos;
      
      const diferencia = Math.abs(tiempoNuevo - tiempoExistente);
      return diferencia < DURACION_TRASLAPE_MINUTOS;
    });
  };

  // Validación en tiempo real de conflictos
  useEffect(() => {
    if (!mostrarServicios) return;

    console.log('=== VALIDANDO CONFLICTOS ===');
    console.log('Asignaciones actuales:', asignaciones);
    console.log('Servicios filtrados:', serviciosFiltrados.length);

    const conflictosEncontrados: string[] = [];
    const asignacionesPorConductor: Record<string, ServicioConAsignacion[]> = {};

    // Agrupar servicios por conductor asignado
    serviciosFiltrados.forEach(servicio => {
      const conductorId = asignaciones[servicio.id];
      console.log(`Servicio ${servicio.numeroServicio}: conductor asignado = ${conductorId}`);
      
      if (conductorId && conductorId.trim() !== '') {
        if (!asignacionesPorConductor[conductorId]) {
          asignacionesPorConductor[conductorId] = [];
        }
        asignacionesPorConductor[conductorId].push(servicio);
      }
    });

    console.log('Servicios agrupados por conductor:', asignacionesPorConductor);

    // Verificar conflictos para cada conductor
    Object.entries(asignacionesPorConductor).forEach(([conductorId, servicios]) => {
      console.log(`Verificando conductor ${conductorId} con ${servicios.length} servicios`);
      
      if (servicios.length > 1) {
        // Comparar cada servicio con todos los otros del mismo conductor
        for (let i = 0; i < servicios.length; i++) {
          for (let j = i + 1; j < servicios.length; j++) {
            const servicio1 = servicios[i];
            const servicio2 = servicios[j];
            
            console.log(`Comparando ${servicio1.numeroServicio} (${servicio1.horario}) con ${servicio2.numeroServicio} (${servicio2.horario})`);
            
            const [horas1, minutos1] = servicio1.horario.split(':').map(Number);
            const [horas2, minutos2] = servicio2.horario.split(':').map(Number);
            
            const tiempo1 = horas1 * 60 + minutos1;
            const tiempo2 = horas2 * 60 + minutos2;
            
            const diferencia = Math.abs(tiempo1 - tiempo2);
            console.log(`Diferencia en minutos: ${diferencia}`);
            
            if (diferencia < DURACION_TRASLAPE_MINUTOS) {
              console.log(`¡CONFLICTO DETECTADO! Servicios ${servicio1.numeroServicio} y ${servicio2.numeroServicio}`);
              conflictosEncontrados.push(servicio1.id);
              conflictosEncontrados.push(servicio2.id);
            }
          }
        }
      }
    });

    console.log('Conflictos encontrados:', conflictosEncontrados);
    setConflictos([...new Set(conflictosEncontrados)]); // Eliminar duplicados
  }, [asignaciones, mostrarServicios, serviciosFiltrados]);

  // Efecto separado para actualizar el estado de conflicto en servicios
  useEffect(() => {
    setServiciosFiltrados(prevServicios =>
      prevServicios.map(servicio => ({
        ...servicio,
        conflictoHorario: conflictos.includes(servicio.id)
      }))
    );
  }, [conflictos]);

  const handleMostrarServicios = () => {
    if (!empresaTransporte || !fechaOperacion) {
      toast({
        title: "Campos requeridos",
        description: "Debe seleccionar empresa de transporte y fecha de operación.",
        variant: "destructive"
      });
      return;
    }

    // Verificar que la fecha sea futura
    const fechaSeleccionada = new Date(fechaOperacion);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {
      toast({
        title: "Fecha inválida",
        description: "La fecha de operación debe ser futura o actual.",
        variant: "destructive"
      });
      return;
    }

    // Filtrar servicios por empresa de transporte y día de la semana
    const serviciosFiltrados = mockServicios.filter(servicio => {
      return servicio.transportista === empresaTransporte &&
             servicio.estado === 'activo' &&
             verificarDiaServicio(servicio.diasSemana, fechaOperacion);
    });

    const serviciosConAsignacion: ServicioConAsignacion[] = serviciosFiltrados.map(servicio => ({
      ...servicio,
      fechaOperacion,
      conductorAsignado: undefined,
      conflictoHorario: false
    }));

    setServiciosFiltrados(serviciosConAsignacion);
    setMostrarServicios(true);

    toast({
      title: "Servicios cargados",
      description: `Se encontraron ${serviciosConAsignacion.length} servicios para la fecha seleccionada.`
    });
  };

  const onSubmit = async (data: any) => {
    if (conflictos.length > 0) {
      toast({
        title: "Conflictos de horario detectados",
        description: "Existen servicios con conflictos de horario. Por favor resuelva los conflictos antes de guardar.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('=== BITÁCORA DE ASIGNACIÓN ===');
      console.log('Usuario:', 'admin@sistema.com'); // Mock user
      console.log('Fecha y hora:', new Date().toISOString());
      console.log('Empresa de transporte:', mockTransportistas.find(t => t.id === data.empresaTransporte)?.nombre);
      console.log('Fecha de operación:', data.fechaOperacion);
      console.log('Asignaciones realizadas:');

      Object.entries(data.asignaciones).forEach(([servicioId, conductorId]) => {
        if (conductorId) {
          const servicio = serviciosFiltrados.find(s => s.id === servicioId);
          const conductor = mockConductores.find(c => c.id === conductorId);
          const ramal = mockRamales.find(r => r.id === servicio?.ramal);

          if (servicio && conductor && ramal) {
            console.log(`- Servicio ${servicio.numeroServicio}:`);
            console.log(`  * Conductor: ${conductor.nombre} ${conductor.apellidos} (${conductor.codigo})`);
            console.log(`  * Ramal: ${ramal.nombre}`);
            console.log(`  * Horario: ${servicio.horario}`);
            console.log(`  * Sentido: ${servicio.sentido}`);
          }
        }
      });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Asignaciones guardadas",
        description: "Las asignaciones de conductores han sido guardadas exitosamente."
      });

      // Reset form
      form.reset();
      setServiciosFiltrados([]);
      setMostrarServicios(false);
      setConflictos([]);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar las asignaciones. Por favor intente nuevamente.",
        variant: "destructive"
      });
    }
  };

  const getConductoresDisponibles = (servicioId: string) => {
    if (!empresaTransporte) return [];

    // Siempre retornar todos los conductores de la empresa
    return getConductoresByEmpresaTransporte(empresaTransporte);
  };

  const formatearFechaOperacion = (fecha: string, horario: string) => {
    const fechaObj = new Date(fecha);
    const fechaFormat = fechaObj.toLocaleDateString('es-CR');
    return `${fechaFormat} ${horario}`;
  };

  const getTipoUnidadNombre = (tipo: string) => {
    const tipos: Record<string, string> = {
      'autobus': 'Autobús',
      'buseta': 'Buseta',
      'microbus': 'Microbús'
    };
    return tipos[tipo] || tipo;
  };

  const getTipoRutaNombre = (tipo: string) => {
    const tipos: Record<string, string> = {
      'publica': 'Pública',
      'privada': 'Privada',
      'especial': 'Especial',
      'parque': 'Parque'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Filtros iniciales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Selección de Empresa y Fecha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresaTransporte">Empresa de Transporte *</Label>
              <Combobox
                options={mockTransportistas.map(t => ({ 
                  value: t.id, 
                  label: `${t.nombre} (${t.codigo})` 
                }))}
                value={empresaTransporte}
                onValueChange={(value) => {
                  form.setValue('empresaTransporte', value);
                  setMostrarServicios(false);
                  setServiciosFiltrados([]);
                }}
                placeholder="Seleccionar empresa..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaOperacion">Fecha de Operación *</Label>
              <Input
                type="date"
                {...form.register('fechaOperacion')}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  form.setValue('fechaOperacion', e.target.value);
                  setMostrarServicios(false);
                  setServiciosFiltrados([]);
                }}
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleMostrarServicios}
                className="w-full"
              >
                Mostrar Servicios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de servicios */}
      {mostrarServicios && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Asignación de Conductores
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {serviciosFiltrados.length} servicios encontrados
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {serviciosFiltrados.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No se encontraron servicios para la fecha y empresa seleccionada.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">#</TableHead>
                      <TableHead>Transportista</TableHead>
                      <TableHead>Empresa Cliente</TableHead>
                      <TableHead>Turno</TableHead>
                      <TableHead>Ramal</TableHead>
                      <TableHead>Tipo Ruta</TableHead>
                      <TableHead>Sentido</TableHead>
                      <TableHead>Horario</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="w-[250px]">Conductor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviciosFiltrados.map((servicio, index) => {
                      const transportista = mockTransportistas.find(t => t.id === servicio.transportista);
                      const turno = mockTurnos.find(t => t.id === servicio.turno);
                      const ramal = mockRamales.find(r => r.id === servicio.ramal);
                      const conductoresDisponibles = getConductoresDisponibles(servicio.id);

                      return (
                        <TableRow 
                          key={servicio.id} 
                          className={servicio.conflictoHorario ? 'bg-destructive/10 border-l-4 border-l-destructive' : ''}
                        >
                          <TableCell className="p-2">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">{index + 1}</span>
                              {servicio.conflictoHorario && (
                                <AlertTriangle className="h-3 w-3 text-destructive" />
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="max-w-[150px] truncate">
                            {transportista?.nombre || 'N/A'}
                          </TableCell>

                          <TableCell className="max-w-[150px] truncate">
                            {ramal?.tipoRuta === 'parque' ? '-' : ramal?.empresaCliente || 'N/A'}
                          </TableCell>

                          <TableCell>
                            {turno?.nombre || 'N/A'}
                          </TableCell>

                          <TableCell className="max-w-[180px] truncate">
                            {ramal?.nombre || 'N/A'}
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline">
                              {getTipoRutaNombre(ramal?.tipoRuta || '')}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Badge variant={servicio.sentido === 'ingreso' ? 'default' : 'outline'}>
                              {servicio.sentido === 'ingreso' ? 'Ingreso' : 'Salida'}
                            </Badge>
                          </TableCell>

                          <TableCell className="font-mono">
                            {servicio.horario}
                          </TableCell>

                          <TableCell className="font-mono text-sm">
                            {formatearFechaOperacion(servicio.fechaOperacion, servicio.horario)}
                          </TableCell>

                          <TableCell>
                            <Combobox
                              options={conductoresDisponibles.map(c => ({
                                value: c.id,
                                label: `${c.nombre} ${c.apellidos} (${c.codigo})`
                              }))}
                              value={asignaciones[servicio.id] || ''}
                              onValueChange={(value) => {
                                form.setValue(`asignaciones.${servicio.id}`, value);
                              }}
                              placeholder="Seleccionar conductor..."
                              searchPlaceholder="Buscar conductor..."
                              emptyText="No hay conductores disponibles"
                              className={servicio.conflictoHorario ? 'border-destructive' : ''}
                            />
                            {servicio.conflictoHorario && (
                              <p className="text-xs text-destructive mt-1">
                                Conflicto de horario detectado
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Botón de guardar */}
      {mostrarServicios && serviciosFiltrados.length > 0 && (
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setServiciosFiltrados([]);
              setMostrarServicios(false);
              setConflictos([]);
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={conflictos.length > 0}
          >
            Guardar Asignaciones
          </Button>
        </div>
      )}
    </form>
  );
};

export default AsignacionConductorForm;