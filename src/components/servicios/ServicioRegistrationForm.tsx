
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { RegistroServicioForm, Turno, Transportista, Ramal } from '@/types/servicio';

const servicioSchema = z.object({
  turno: z.string().min(1, 'Turno es requerido'),
  transportista: z.string().min(1, 'Transportista es requerido'),
  ramal: z.string().min(1, 'Ramal es requerido'),
  servicios: z.array(z.object({
    horario: z.string().min(1, 'Horario es requerido'),
    diasSemana: z.array(z.string()).min(1, 'Debe seleccionar al menos un día'),
    sentido: z.enum(['ingreso', 'salida'], { required_error: 'Sentido es requerido' }),
    cantidadUnidades: z.number().min(1, 'Cantidad debe ser mayor a 0').max(20, 'Máximo 20 unidades'),
    porcentajeFee: z.number().min(0, 'Porcentaje debe ser 0 o mayor').max(100, 'Máximo 100%'),
    agregarCapacidadAdicional: z.boolean().default(false)
  })).min(1, 'Debe agregar al menos un servicio')
});

const ServicioRegistrationForm = () => {
  const [duplicados, setDuplicados] = useState<number[]>([]);

  // Mock data - replace with actual API calls
  const turnos: Turno[] = [
    { id: '1', nombre: 'Mañana' },
    { id: '2', nombre: 'Tarde' },
    { id: '3', nombre: 'Noche' }
  ];

  const transportistas: Transportista[] = [
    { id: '1', nombre: 'Transportes San José S.A.', codigo: 'TSJ001' },
    { id: '2', nombre: 'Autobuses del Valle', codigo: 'ADV002' },
    { id: '3', nombre: 'Empresa de Transporte Central', codigo: 'ETC003' }
  ];

  const ramales: Ramal[] = [
    { id: '1', nombre: 'San José - Cartago', tipoRuta: 'publica' },
    { id: '2', nombre: 'Heredia - Alajuela', tipoRuta: 'publica' },
    { id: '3', nombre: 'Zona Franca Intel', tipoRuta: 'privada', empresaCliente: 'Intel Corporation' },
    { id: '4', nombre: 'Campus Tecnológico', tipoRuta: 'especial', empresaCliente: 'Universidad Nacional' }
  ];

  const diasSemana = [
    { id: 'lunes', label: 'Lunes' },
    { id: 'martes', label: 'Martes' },
    { id: 'miercoles', label: 'Miércoles' },
    { id: 'jueves', label: 'Jueves' },
    { id: 'viernes', label: 'Viernes' },
    { id: 'sabado', label: 'Sábado' },
    { id: 'domingo', label: 'Domingo' }
  ];

  const form = useForm<RegistroServicioForm>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      turno: '',
      transportista: '',
      ramal: '',
      servicios: [{
        horario: '',
        diasSemana: [],
        sentido: 'ingreso',
        cantidadUnidades: 1,
        porcentajeFee: 0,
        agregarCapacidadAdicional: false
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'servicios'
  });

  const validarDuplicados = () => {
    const servicios = form.getValues('servicios');
    const turno = form.getValues('turno');
    const transportista = form.getValues('transportista');
    const ramal = form.getValues('ramal');
    
    const duplicadosEncontrados: number[] = [];
    const combinaciones = new Set<string>();

    servicios.forEach((servicio, index) => {
      if (!servicio.agregarCapacidadAdicional) {
        servicio.diasSemana.forEach(dia => {
          const clave = `${turno}-${transportista}-${ramal}-${servicio.horario}-${dia}-${servicio.sentido}`;
          if (combinaciones.has(clave)) {
            duplicadosEncontrados.push(index);
          } else {
            combinaciones.add(clave);
          }
        });
      }
    });

    setDuplicados(duplicadosEncontrados);
    return duplicadosEncontrados.length === 0;
  };

  const onSubmit = async (data: RegistroServicioForm) => {
    console.log('Validando duplicados...');
    
    if (!validarDuplicados()) {
      toast({
        title: "Duplicados detectados",
        description: "Existen combinaciones duplicadas. Por favor revise los servicios marcados o use la opción de agregar capacidad adicional.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Enviando datos:', data);
      
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Servicios registrados",
        description: "Los servicios han sido registrados exitosamente."
      });

      // Reset form
      form.reset();
      setDuplicados([]);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar los servicios. Por favor intente nuevamente.",
        variant: "destructive"
      });
    }
  };

  const agregarServicio = () => {
    append({
      horario: '',
      diasSemana: [],
      sentido: 'ingreso',
      cantidadUnidades: 1,
      porcentajeFee: 0,
      agregarCapacidadAdicional: false
    });
  };

  const formatRamalLabel = (ramal: Ramal) => {
    if (ramal.tipoRuta === 'privada' || ramal.tipoRuta === 'especial') {
      return `${ramal.nombre} (${ramal.tipoRuta} - ${ramal.empresaCliente})`;
    }
    return `${ramal.nombre} (${ramal.tipoRuta})`;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Datos Generales */}
      <Card>
        <CardHeader>
          <CardTitle>Datos Generales del Servicio</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="turno" className="required-field">Turno</Label>
            <Select
              value={form.watch('turno')}
              onValueChange={(value) => form.setValue('turno', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar turno" />
              </SelectTrigger>
              <SelectContent>
                {turnos.map((turno) => (
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
            <Label htmlFor="transportista" className="required-field">Transportista</Label>
            <Combobox
              options={transportistas.map(t => ({ value: t.id, label: `${t.nombre} (${t.codigo})` }))}
              value={form.watch('transportista')}
              onValueChange={(value) => form.setValue('transportista', value)}
              placeholder="Buscar transportista..."
              searchPlaceholder="Buscar transportista..."
              emptyText="No se encontraron transportistas."
            />
            {form.formState.errors.transportista && (
              <p className="text-sm text-destructive">{form.formState.errors.transportista.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ramal" className="required-field">Ramal</Label>
            <Combobox
              options={ramales.map(r => ({ value: r.id, label: formatRamalLabel(r) }))}
              value={form.watch('ramal')}
              onValueChange={(value) => form.setValue('ramal', value)}
              placeholder="Buscar ramal..."
              searchPlaceholder="Buscar ramal..."
              emptyText="No se encontraron ramales."
            />
            {form.formState.errors.ramal && (
              <p className="text-sm text-destructive">{form.formState.errors.ramal.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Servicios */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detalle de Servicios</CardTitle>
          <Button type="button" onClick={agregarServicio} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Servicio
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className={duplicados.includes(index) ? 'border-destructive' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Servicio {index + 1}</CardTitle>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {duplicados.includes(index) && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Combinación duplicada detectada</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`horario-${index}`} className="required-field">Horario</Label>
                  <Input
                    id={`horario-${index}`}
                    type="time"
                    {...form.register(`servicios.${index}.horario`)}
                  />
                  {form.formState.errors.servicios?.[index]?.horario && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.servicios[index]?.horario?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="required-field">Sentido</Label>
                  <Select
                    value={form.watch(`servicios.${index}.sentido`)}
                    onValueChange={(value: 'ingreso' | 'salida') => 
                      form.setValue(`servicios.${index}.sentido`, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sentido" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ingreso">Ingreso</SelectItem>
                      <SelectItem value="salida">Salida</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.servicios?.[index]?.sentido && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.servicios[index]?.sentido?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`cantidadUnidades-${index}`} className="required-field">
                    Cantidad de Unidades
                  </Label>
                  <Input
                    id={`cantidadUnidades-${index}`}
                    type="number"
                    min="1"
                    max="20"
                    {...form.register(`servicios.${index}.cantidadUnidades`, { 
                      valueAsNumber: true 
                    })}
                  />
                  {form.formState.errors.servicios?.[index]?.cantidadUnidades && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.servicios[index]?.cantidadUnidades?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`porcentajeFee-${index}`} className="required-field">
                    Porcentaje Fee (%)
                  </Label>
                  <Input
                    id={`porcentajeFee-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    {...form.register(`servicios.${index}.porcentajeFee`, { 
                      valueAsNumber: true 
                    })}
                  />
                  {form.formState.errors.servicios?.[index]?.porcentajeFee && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.servicios[index]?.porcentajeFee?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="required-field">Días de la Semana</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {diasSemana.map((dia) => (
                      <div key={dia.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${index}-${dia.id}`}
                          checked={(form.watch(`servicios.${index}.diasSemana`) || []).includes(dia.id)}
                          onCheckedChange={(checked) => {
                            const diasActuales = form.watch(`servicios.${index}.diasSemana`) || [];
                            if (checked) {
                              form.setValue(`servicios.${index}.diasSemana`, [...diasActuales, dia.id]);
                            } else {
                              form.setValue(
                                `servicios.${index}.diasSemana`,
                                diasActuales.filter(d => d !== dia.id)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`${index}-${dia.id}`} className="text-sm">
                          {dia.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.servicios?.[index]?.diasSemana && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.servicios[index]?.diasSemana?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-full">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`agregarCapacidad-${index}`}
                      checked={form.watch(`servicios.${index}.agregarCapacidadAdicional`)}
                      onCheckedChange={(checked) => 
                        form.setValue(`servicios.${index}.agregarCapacidadAdicional`, !!checked)
                      }
                    />
                    <Label htmlFor={`agregarCapacidad-${index}`} className="text-sm">
                      Agregar capacidad adicional (permite duplicados)
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Registrando...' : 'Registrar Servicios'}
        </Button>
      </div>
    </form>
  );
};

export default ServicioRegistrationForm;
