import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  AsignacionRegistroForm, 
  Ramal, 
  EmpresaCliente, 
  TarifaPasajero, 
  TarifaServicio 
} from '@/types/asignacion-registro';

const asignacionSchema = z.object({
  ramal: z.string().min(1, 'Ramal es requerido'),
  empresaCliente: z.string().optional(),
  cuentaPO: z.string().optional(),
  tipoUnidad: z.enum(['autobus', 'buseta', 'microbus'], { required_error: 'Tipo de unidad es requerido' }),
  montoFee: z.number().min(0, 'Porcentaje fee debe ser mayor o igual a 0').max(100, 'Porcentaje fee no puede ser mayor a 100'),
  tarifasPasajero: z.array(z.object({
    monto: z.number().min(0.01, 'Monto debe ser mayor a 0'),
    fechaInicioVigencia: z.string().min(1, 'Fecha es requerida'),
    estado: z.enum(['activo', 'inactivo'])
  })).min(1, 'Debe agregar al menos una tarifa de pasajero'),
  tarifasServicio: z.array(z.object({
    monto: z.number().min(0.01, 'Monto debe ser mayor a 0'),
    fechaInicioVigencia: z.string().min(1, 'Fecha es requerida'),
    estado: z.enum(['activo', 'inactivo'])
  })).optional()
});

// Mock data - Reemplazar con datos reales de API
const mockRamales: Ramal[] = [
  { id: '1', nombre: 'San José - Cartago', tipoRuta: 'publica' as 'privada' },
  { id: '2', nombre: 'Heredia - Alajuela', tipoRuta: 'publica' as 'privada' },
  { id: '3', nombre: 'Zona Franca Intel', tipoRuta: 'privada' },
  { id: '4', nombre: 'Campus Tecnológico', tipoRuta: 'especial' },
  { id: '5', nombre: 'Parque Industrial', tipoRuta: 'parque' }
];

const mockEmpresasCliente: EmpresaCliente[] = [
  {
    id: '1',
    nombre: 'Intel Corporation',
    cuentasPO: [
      { id: '1', nombre: 'Cuenta Principal', codigo: 'MAIN001', esPrincipal: true },
      { id: '2', nombre: 'Desarrollo R&D', codigo: 'RD001', esPrincipal: false },
      { id: '3', nombre: 'Manufactura', codigo: 'MFG001', esPrincipal: false }
    ]
  },
  {
    id: '2',
    nombre: 'Universidad Nacional',
    cuentasPO: [
      { id: '4', nombre: 'Cuenta Principal', codigo: 'UNA001', esPrincipal: true },
      { id: '5', nombre: 'Campus Tecnológico', codigo: 'TECH001', esPrincipal: false }
    ]
  },
  {
    id: '3',
    nombre: 'Compañía Manufacturera XYZ',
    cuentasPO: [
      { id: '6', nombre: 'Cuenta Principal', codigo: 'XYZ001', esPrincipal: true }
    ]
  }
];

const AsignacionRegistrationForm = () => {
  const navigate = useNavigate();
  const [nuevaTarifaPasajero, setNuevaTarifaPasajero] = useState<Partial<TarifaPasajero>>({
    monto: 0,
    fechaInicioVigencia: '',
    estado: 'activo'
  });
  const [nuevaTarifaServicio, setNuevaTarifaServicio] = useState<Partial<TarifaServicio>>({
    monto: 0,
    fechaInicioVigencia: '',
    estado: 'activo'
  });

  const form = useForm<AsignacionRegistroForm>({
    resolver: zodResolver(asignacionSchema),
    defaultValues: {
      ramal: '',
      empresaCliente: '',
      cuentaPO: '',
      tipoUnidad: '' as any,
      montoFee: 0,
      tarifasPasajero: [],
      tarifasServicio: []
    }
  });

  const ramalSeleccionado = form.watch('ramal');
  const empresaClienteSeleccionada = form.watch('empresaCliente');
  const tarifasPasajero = form.watch('tarifasPasajero') || [];
  const tarifasServicio = form.watch('tarifasServicio') || [];

  const ramalInfo = useMemo(() => {
    return mockRamales.find(r => r.id === ramalSeleccionado);
  }, [ramalSeleccionado]);

  const empresaClienteInfo = useMemo(() => {
    return mockEmpresasCliente.find(e => e.id === empresaClienteSeleccionada);
  }, [empresaClienteSeleccionada]);

  const requiereEmpresaCliente = ramalInfo?.tipoRuta === 'privada' || ramalInfo?.tipoRuta === 'especial';
  const requiereTarifasServicio = ramalInfo?.tipoRuta === 'privada' || ramalInfo?.tipoRuta === 'especial';

  const validarTarifaDuplicada = (tipo: 'pasajero' | 'servicio', nuevaTarifa: { monto: number; fechaInicioVigencia: string }) => {
    const tarifas = tipo === 'pasajero' ? tarifasPasajero : tarifasServicio;
    return tarifas.some(t => 
      t.monto === nuevaTarifa.monto && 
      t.fechaInicioVigencia === nuevaTarifa.fechaInicioVigencia
    );
  };

  const agregarTarifaPasajero = () => {
    if (!nuevaTarifaPasajero.monto || !nuevaTarifaPasajero.fechaInicioVigencia) {
      toast({
        title: "Error",
        description: "Complete todos los campos de la tarifa",
        variant: "destructive"
      });
      return;
    }

    if (validarTarifaDuplicada('pasajero', nuevaTarifaPasajero as any)) {
      toast({
        title: "Error",
        description: "Ya existe una tarifa con el mismo monto y fecha",
        variant: "destructive"
      });
      return;
    }

    const nuevaTarifa: TarifaPasajero = {
      id: Date.now().toString(),
      monto: nuevaTarifaPasajero.monto!,
      fechaInicioVigencia: nuevaTarifaPasajero.fechaInicioVigencia!,
      estado: nuevaTarifaPasajero.estado || 'activo'
    };

    form.setValue('tarifasPasajero', [...tarifasPasajero, nuevaTarifa]);
    setNuevaTarifaPasajero({ monto: 0, fechaInicioVigencia: '', estado: 'activo' });
  };

  const agregarTarifaServicio = () => {
    if (!nuevaTarifaServicio.monto || !nuevaTarifaServicio.fechaInicioVigencia) {
      toast({
        title: "Error",
        description: "Complete todos los campos de la tarifa",
        variant: "destructive"
      });
      return;
    }

    if (validarTarifaDuplicada('servicio', nuevaTarifaServicio as any)) {
      toast({
        title: "Error",
        description: "Ya existe una tarifa con el mismo monto y fecha",
        variant: "destructive"
      });
      return;
    }

    const nuevaTarifa: TarifaServicio = {
      id: Date.now().toString(),
      monto: nuevaTarifaServicio.monto!,
      fechaInicioVigencia: nuevaTarifaServicio.fechaInicioVigencia!,
      estado: nuevaTarifaServicio.estado || 'activo'
    };

    form.setValue('tarifasServicio', [...tarifasServicio, nuevaTarifa]);
    setNuevaTarifaServicio({ monto: 0, fechaInicioVigencia: '', estado: 'activo' });
  };

  const eliminarTarifaPasajero = (id: string) => {
    form.setValue('tarifasPasajero', tarifasPasajero.filter(t => t.id !== id));
  };

  const eliminarTarifaServicio = (id: string) => {
    form.setValue('tarifasServicio', tarifasServicio.filter(t => t.id !== id));
  };

  const onSubmit = async (data: AsignacionRegistroForm) => {
    try {
      // Validaciones adicionales
      if (requiereEmpresaCliente && !data.empresaCliente) {
        toast({
          title: "Error",
          description: "Debe seleccionar una empresa cliente para este tipo de ruta",
          variant: "destructive"
        });
        return;
      }

      if (requiereTarifasServicio && (!data.tarifasServicio || data.tarifasServicio.length === 0)) {
        toast({
          title: "Error",
          description: "Debe agregar al menos una tarifa de servicio para este tipo de ruta",
          variant: "destructive"
        });
        return;
      }

      console.log('Enviando datos:', data);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Éxito",
        description: "Asignación de ruta registrada exitosamente"
      });

      navigate('/asignaciones');
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar la asignación",
        variant: "destructive"
      });
    }
  };

  const limpiarFormulario = () => {
    form.reset();
    setNuevaTarifaPasajero({ monto: 0, fechaInicioVigencia: '', estado: 'activo' });
    setNuevaTarifaServicio({ monto: 0, fechaInicioVigencia: '', estado: 'activo' });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className={`grid gap-6 ${!requiereTarifasServicio ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ramal */}
            <div className="space-y-2">
              <Label htmlFor="ramal">Ramal *</Label>
              <Combobox
                options={mockRamales.map(r => ({ 
                  value: r.id, 
                  label: `${r.nombre} - ${r.tipoRuta.charAt(0).toUpperCase() + r.tipoRuta.slice(1)}` 
                }))}
                value={form.watch('ramal')}
                onValueChange={(value) => {
                  form.setValue('ramal', value);
                  // Limpiar empresa cliente si cambia el tipo de ruta
                  form.setValue('empresaCliente', '');
                  form.setValue('cuentaPO', '');
                }}
                placeholder="Seleccionar ramal..."
              />
              {form.formState.errors.ramal && (
                <p className="text-sm text-destructive">{form.formState.errors.ramal.message}</p>
              )}
            </div>

            {/* Empresa Cliente - Solo para rutas privadas y especiales */}
            {requiereEmpresaCliente && (
              <div className="space-y-2">
                <Label htmlFor="empresaCliente">Empresa Cliente *</Label>
                <Combobox
                  options={mockEmpresasCliente.map(e => ({ value: e.id, label: e.nombre }))}
                  value={form.watch('empresaCliente')}
                  onValueChange={(value) => {
                    form.setValue('empresaCliente', value);
                    form.setValue('cuentaPO', ''); // Limpiar cuenta PO
                  }}
                  placeholder="Seleccionar empresa cliente..."
                />
                {form.formState.errors.empresaCliente && (
                  <p className="text-sm text-destructive">{form.formState.errors.empresaCliente.message}</p>
                )}
              </div>
            )}

            {/* Cuenta PO - Solo si hay empresa cliente seleccionada */}
            {empresaClienteInfo && empresaClienteInfo.cuentasPO.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="cuentaPO">Cuenta PO (Opcional)</Label>
                <Select
                  value={form.watch('cuentaPO')}
                  onValueChange={(value) => form.setValue('cuentaPO', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cuenta PO (por defecto: cuenta principal)" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresaClienteInfo.cuentasPO.map((cuenta) => (
                      <SelectItem key={cuenta.id} value={cuenta.id}>
                        {cuenta.nombre} ({cuenta.codigo}) {cuenta.esPrincipal && '- Principal'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Tipo de Unidad */}
            <div className="space-y-2">
              <Label htmlFor="tipoUnidad">Tipo de Unidad *</Label>
              <Select
                value={form.watch('tipoUnidad')}
                onValueChange={(value: 'autobus' | 'buseta' | 'microbus') => 
                  form.setValue('tipoUnidad', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="autobus">Autobús</SelectItem>
                  <SelectItem value="buseta">Buseta</SelectItem>
                  <SelectItem value="microbus">Microbús</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.tipoUnidad && (
                <p className="text-sm text-destructive">{form.formState.errors.tipoUnidad.message}</p>
              )}
            </div>

            {/* Porcentaje Fee */}
            <div className="space-y-2">
              <Label htmlFor="montoFee">Porcentaje Fee a la Ruta (%)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...form.register('montoFee', { valueAsNumber: true })}
              />
              {form.formState.errors.montoFee && (
                <p className="text-sm text-destructive">{form.formState.errors.montoFee.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tarifas de Pasajero */}
        <Card>
          <CardHeader>
            <CardTitle>Tarifas de Pasajero *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Agregar nueva tarifa */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Monto *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={nuevaTarifaPasajero.monto || ''}
                  onChange={(e) => setNuevaTarifaPasajero(prev => ({ 
                    ...prev, 
                    monto: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha de Inicio *</Label>
                <Input
                  type="date"
                  value={nuevaTarifaPasajero.fechaInicioVigencia || ''}
                  onChange={(e) => setNuevaTarifaPasajero(prev => ({ 
                    ...prev, 
                    fechaInicioVigencia: e.target.value 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={nuevaTarifaPasajero.estado || 'activo'}
                  onValueChange={(value: 'activo' | 'inactivo') => 
                    setNuevaTarifaPasajero(prev => ({ ...prev, estado: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={agregarTarifaPasajero} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </div>

            {/* Tabla de tarifas */}
            {tarifasPasajero.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha de Inicio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-20">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tarifasPasajero.map((tarifa) => (
                      <TableRow key={tarifa.id}>
                        <TableCell>₡{tarifa.monto.toFixed(2)}</TableCell>
                        <TableCell>{tarifa.fechaInicioVigencia}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tarifa.estado === 'activo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tarifa.estado.charAt(0).toUpperCase() + tarifa.estado.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => eliminarTarifaPasajero(tarifa.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {form.formState.errors.tarifasPasajero && (
              <p className="text-sm text-destructive">{form.formState.errors.tarifasPasajero.message}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tarifas de Servicio - Solo para rutas privadas y especiales */}
      {requiereTarifasServicio && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Espaciador para mantener el layout */}
          <div></div>
          
          <Card>
            <CardHeader>
              <CardTitle>Tarifas de Servicio *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Agregar nueva tarifa */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Monto *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={nuevaTarifaServicio.monto || ''}
                    onChange={(e) => setNuevaTarifaServicio(prev => ({ 
                      ...prev, 
                      monto: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Inicio *</Label>
                  <Input
                    type="date"
                    value={nuevaTarifaServicio.fechaInicioVigencia || ''}
                    onChange={(e) => setNuevaTarifaServicio(prev => ({ 
                      ...prev, 
                      fechaInicioVigencia: e.target.value 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    value={nuevaTarifaServicio.estado || 'activo'}
                    onValueChange={(value: 'activo' | 'inactivo') => 
                      setNuevaTarifaServicio(prev => ({ ...prev, estado: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button type="button" onClick={agregarTarifaServicio} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>

              {/* Tabla de tarifas */}
              {tarifasServicio.length > 0 && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Monto</TableHead>
                        <TableHead>Fecha de Inicio</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-20">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tarifasServicio.map((tarifa) => (
                        <TableRow key={tarifa.id}>
                          <TableCell>₡{tarifa.monto.toFixed(2)}</TableCell>
                          <TableCell>{tarifa.fechaInicioVigencia}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              tarifa.estado === 'activo' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {tarifa.estado.charAt(0).toUpperCase() + tarifa.estado.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => eliminarTarifaServicio(tarifa.id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Botones de Acción */}
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/asignaciones')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancelar
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={limpiarFormulario}>
            Limpiar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AsignacionRegistrationForm;