
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Combobox } from '@/components/ui/combobox';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { mockTurnos } from '@/data/mockTurnos';
import { mockTransportistas } from '@/data/mockTransportistas';
import { mockRamales } from '@/data/mockRamales';

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

  // Validación en tiempo real
  useEffect(() => {
    const servicios = form.watch('servicios') || [];
    const duplicadosEncontrados: number[] = [];
    const combinaciones = new Set<string>();

    servicios.forEach((servicio, index) => {
      if (!servicio.agregarCapacidadAdicional && servicio.turno && servicio.transportista && 
          servicio.ramal && servicio.horario && servicio.sentido && servicio.diasSemana?.length > 0) {
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
  }, [form.watch()]);

  const validarDuplicados = () => {
    return duplicados.length === 0;
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

  const formatRamalLabel = (ramal: typeof mockRamales[0]) => {
    if (ramal.tipoRuta === 'privada' || ramal.tipoRuta === 'especial') {
      return `${ramal.nombre} - ${ramal.tipoRuta.charAt(0).toUpperCase() + ramal.tipoRuta.slice(1)} - ${ramal.empresaCliente}`;
    }
    return `${ramal.nombre} - ${ramal.tipoRuta.charAt(0).toUpperCase() + ramal.tipoRuta.slice(1)}`;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Servicios</CardTitle>
            <Button type="button" onClick={agregarServicio} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Agregar Servicio
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">#</TableHead>
                  <TableHead className="w-[140px]">Turno</TableHead>
                  <TableHead className="w-[180px]">Transportista</TableHead>
                  <TableHead className="w-[200px]">Ramal</TableHead>
                  <TableHead className="w-[100px]">Horario</TableHead>
                  <TableHead className="w-[120px]">Días</TableHead>
                  <TableHead className="w-[100px]">Sentido</TableHead>
                  <TableHead className="w-[80px]">Unidades</TableHead>
                  <TableHead className="w-[80px]">Fee %</TableHead>
                  <TableHead className="w-[120px]">Cap. Adic.</TableHead>
                  <TableHead className="w-[60px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id} className={duplicados.includes(index) ? 'bg-destructive/10 border-l-4 border-l-destructive' : ''}>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{index + 1}</span>
                        {duplicados.includes(index) && (
                          <AlertTriangle className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Turno */}
                    <TableCell className="p-2">
                      <Select
                        value={form.watch(`servicios.${index}.turno`)}
                        onValueChange={(value) => form.setValue(`servicios.${index}.turno`, value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Turno" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTurnos.map((turno) => (
                            <SelectItem key={turno.id} value={turno.id}>
                              {turno.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Transportista */}
                    <TableCell className="p-2">
                      <Combobox
                        options={mockTransportistas.map(t => ({ value: t.id, label: `${t.nombre} (${t.codigo})` }))}
                        value={form.watch(`servicios.${index}.transportista`)}
                        onValueChange={(value) => form.setValue(`servicios.${index}.transportista`, value)}
                        placeholder="Transportista"
                        className="h-8 text-xs"
                      />
                    </TableCell>

                    {/* Ramal */}
                    <TableCell className="p-2">
                      <Combobox
                        options={mockRamales.map(r => ({ value: r.id, label: formatRamalLabel(r) }))}
                        value={form.watch(`servicios.${index}.ramal`)}
                        onValueChange={(value) => form.setValue(`servicios.${index}.ramal`, value)}
                        placeholder="Ramal"
                        className="h-8 text-xs"
                      />
                    </TableCell>

                    {/* Horario */}
                    <TableCell className="p-2">
                      <Input
                        type="text"
                        placeholder="HH:MM"
                        className="h-8 text-xs"
                        value={form.watch(`servicios.${index}.horario`) || ''}
                        onChange={(e) => {
                          console.log('Horario change:', e.target.value);
                          form.setValue(`servicios.${index}.horario`, e.target.value);
                        }}
                      />
                    </TableCell>

                    {/* Días de la semana */}
                    <TableCell className="p-2">
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
                            />
                            <Label htmlFor={`${index}-${dia.id}`} className="text-xs mt-1">
                              {dia.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    {/* Sentido */}
                    <TableCell className="p-2">
                      <Select
                        value={form.watch(`servicios.${index}.sentido`)}
                        onValueChange={(value: 'ingreso' | 'salida') => 
                          form.setValue(`servicios.${index}.sentido`, value)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ingreso">Ingreso</SelectItem>
                          <SelectItem value="salida">Salida</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Cantidad de unidades */}
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        className="h-8 text-xs"
                        {...form.register(`servicios.${index}.cantidadUnidades`, { 
                          valueAsNumber: true 
                        })}
                      />
                    </TableCell>

                    {/* Porcentaje Fee */}
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className="h-8 text-xs"
                        {...form.register(`servicios.${index}.porcentajeFee`, { 
                          valueAsNumber: true 
                        })}
                      />
                    </TableCell>

                    {/* Capacidad adicional */}
                    <TableCell className="p-2">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          id={`agregarCapacidad-${index}`}
                          checked={form.watch(`servicios.${index}.agregarCapacidadAdicional`)}
                          onCheckedChange={(checked) => 
                            form.setValue(`servicios.${index}.agregarCapacidadAdicional`, !!checked)
                          }
                        />
                      </div>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="p-2">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3 p-4">
            {fields.map((field, index) => (
              <Card key={field.id} className={`${duplicados.includes(index) ? 'border-destructive bg-destructive/5' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Servicio {index + 1}</span>
                      {duplicados.includes(index) && (
                        <div className="flex items-center gap-1 text-destructive text-xs">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Duplicado</span>
                        </div>
                      )}
                    </div>
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
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Turno */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Turno*</Label>
                      <Select
                        value={form.watch(`servicios.${index}.turno`)}
                        onValueChange={(value) => form.setValue(`servicios.${index}.turno`, value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Turno" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTurnos.map((turno) => (
                            <SelectItem key={turno.id} value={turno.id}>
                              {turno.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sentido */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Sentido*</Label>
                      <Select
                        value={form.watch(`servicios.${index}.sentido`)}
                        onValueChange={(value: 'ingreso' | 'salida') => 
                          form.setValue(`servicios.${index}.sentido`, value)
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ingreso">Ingreso</SelectItem>
                          <SelectItem value="salida">Salida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Transportista */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Transportista*</Label>
                    <Combobox
                      options={mockTransportistas.map(t => ({ value: t.id, label: `${t.nombre} (${t.codigo})` }))}
                      value={form.watch(`servicios.${index}.transportista`)}
                      onValueChange={(value) => form.setValue(`servicios.${index}.transportista`, value)}
                      placeholder="Transportista"
                      className="h-8"
                    />
                  </div>

                  {/* Ramal */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Ramal*</Label>
                    <Combobox
                      options={mockRamales.map(r => ({ value: r.id, label: formatRamalLabel(r) }))}
                      value={form.watch(`servicios.${index}.ramal`)}
                      onValueChange={(value) => form.setValue(`servicios.${index}.ramal`, value)}
                      placeholder="Ramal"
                      className="h-8"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Horario */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Horario*</Label>
                      <Input
                        type="text"
                        placeholder="HH:MM"
                        className="h-8"
                        value={form.watch(`servicios.${index}.horario`) || ''}
                        onChange={(e) => {
                          console.log('Horario change mobile:', e.target.value);
                          form.setValue(`servicios.${index}.horario`, e.target.value);
                        }}
                      />
                    </div>

                    {/* Cantidad de unidades */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Unidades*</Label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        className="h-8"
                        {...form.register(`servicios.${index}.cantidadUnidades`, { 
                          valueAsNumber: true 
                        })}
                      />
                    </div>
                  </div>

                  {/* Porcentaje Fee */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Porcentaje Fee*</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="h-8"
                      placeholder="0.00"
                      {...form.register(`servicios.${index}.porcentajeFee`, { 
                        valueAsNumber: true 
                      })}
                    />
                  </div>

                  {/* Días de la semana */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Días de la semana*</Label>
                    <div className="flex gap-2 justify-center">
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
                          />
                          <Label htmlFor={`${index}-${dia.id}`} className="text-xs mt-1">
                            {dia.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Capacidad adicional */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`agregarCapacidad-${index}`}
                      checked={form.watch(`servicios.${index}.agregarCapacidadAdicional`)}
                      onCheckedChange={(checked) => 
                        form.setValue(`servicios.${index}.agregarCapacidadAdicional`, !!checked)
                      }
                    />
                    <Label htmlFor={`agregarCapacidad-${index}`} className="text-xs">
                      Agregar capacidad adicional
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
