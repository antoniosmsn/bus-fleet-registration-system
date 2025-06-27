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
  servicios: z.array(z.object({
    turno: z.string().min(1, 'Turno es requerido'),
    transportista: z.string().min(1, 'Transportista es requerido'),
    ramal: z.string().min(1, 'Ramal es requerido'),
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
    { id: 'lunes', label: 'L' },
    { id: 'martes', label: 'M' },
    { id: 'miercoles', label: 'X' },
    { id: 'jueves', label: 'J' },
    { id: 'viernes', label: 'V' },
    { id: 'sabado', label: 'S' },
    { id: 'domingo', label: 'D' }
  ];

  const form = useForm<{ servicios: any[] }>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      servicios: [{
        turno: '',
        transportista: '',
        ramal: '',
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
    const duplicadosEncontrados: number[] = [];
    const combinaciones = new Set<string>();

    servicios.forEach((servicio, index) => {
      if (!servicio.agregarCapacidadAdicional) {
        servicio.diasSemana.forEach((dia: string) => {
          const clave = `${servicio.turno}-${servicio.transportista}-${servicio.ramal}-${servicio.horario}-${dia}-${servicio.sentido}`;
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

  const onSubmit = async (data: { servicios: any[] }) => {
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
      turno: '',
      transportista: '',
      ramal: '',
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Servicios Compactos */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Servicios</CardTitle>
            <Button type="button" onClick={agregarServicio} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {fields.map((field, index) => (
            <Card key={field.id} className={`${duplicados.includes(index) ? 'border-destructive' : ''} border-l-4 ${duplicados.includes(index) ? 'border-l-destructive' : 'border-l-blue-500'}`}>
              <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Servicio {index + 1}</span>
                  <div className="flex items-center gap-2">
                    {duplicados.includes(index) && (
                      <div className="flex items-center gap-1 text-destructive text-xs">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Duplicado</span>
                      </div>
                    )}
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-16 gap-1 pt-0">
                {/* Turno - más angosto */}
                <div className="col-span-1 space-y-1">
                  <Label className="text-xs font-medium">Turno*</Label>
                  <Select
                    value={form.watch(`servicios.${index}.turno`)}
                    onValueChange={(value) => form.setValue(`servicios.${index}.turno`, value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="T" />
                    </SelectTrigger>
                    <SelectContent>
                      {turnos.map((turno) => (
                        <SelectItem key={turno.id} value={turno.id}>
                          {turno.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transportista */}
                <div className="col-span-3 space-y-1">
                  <Label className="text-xs font-medium">Transportista*</Label>
                  <Combobox
                    options={transportistas.map(t => ({ value: t.id, label: `${t.nombre} (${t.codigo})` }))}
                    value={form.watch(`servicios.${index}.transportista`)}
                    onValueChange={(value) => form.setValue(`servicios.${index}.transportista`, value)}
                    placeholder="Transportista..."
                    className="h-7 text-xs"
                  />
                </div>

                {/* Ramal */}
                <div className="col-span-3 space-y-1">
                  <Label className="text-xs font-medium">Ramal*</Label>
                  <Combobox
                    options={ramales.map(r => ({ value: r.id, label: formatRamalLabel(r) }))}
                    value={form.watch(`servicios.${index}.ramal`)}
                    onValueChange={(value) => form.setValue(`servicios.${index}.ramal`, value)}
                    placeholder="Ramal..."
                    className="h-7 text-xs"
                  />
                </div>

                {/* Horario - más angosto */}
                <div className="col-span-1 space-y-1">
                  <Label className="text-xs font-medium">Hora*</Label>
                  <Input
                    type="time"
                    className="h-7 text-xs"
                    {...form.register(`servicios.${index}.horario`)}
                  />
                </div>

                {/* Sentido - más angosto */}
                <div className="col-span-1 space-y-1">
                  <Label className="text-xs font-medium">Sent*</Label>
                  <Select
                    value={form.watch(`servicios.${index}.sentido`)}
                    onValueChange={(value: 'ingreso' | 'salida') => 
                      form.setValue(`servicios.${index}.sentido`, value)
                    }
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ingreso">In</SelectItem>
                      <SelectItem value="salida">Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Días de la semana */}
                <div className="col-span-5 space-y-1">
                  <Label className="text-xs font-medium">Días*</Label>
                  <div className="flex gap-1">
                    {diasSemana.map((dia) => (
                      <div key={dia.id} className="flex flex-col items-center">
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
                          className="h-3 w-3"
                        />
                        <Label htmlFor={`${index}-${dia.id}`} className="text-xs mt-1">
                          {dia.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cantidad */}
                <div className="col-span-1 space-y-1">
                  <Label className="text-xs font-medium">Uni*</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    className="h-7 text-xs"
                    {...form.register(`servicios.${index}.cantidadUnidades`, { 
                      valueAsNumber: true 
                    })}
                  />
                </div>

                {/* Fee */}
                <div className="col-span-1 space-y-1">
                  <Label className="text-xs font-medium">Fee%*</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="h-7 text-xs"
                    {...form.register(`servicios.${index}.porcentajeFee`, { 
                      valueAsNumber: true 
                    })}
                  />
                </div>

                {/* Capacidad adicional */}
                <div className="col-span-16 mt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`agregarCapacidad-${index}`}
                      checked={form.watch(`servicios.${index}.agregarCapacidadAdicional`)}
                      onCheckedChange={(checked) => 
                        form.setValue(`servicios.${index}.agregarCapacidadAdicional`, !!checked)
                      }
                      className="h-3 w-3"
                    />
                    <Label htmlFor={`agregarCapacidad-${index}`} className="text-xs">
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
      <div className="flex justify-end gap-4 pt-4">
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
