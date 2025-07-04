import React, { useState, useMemo, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, ArrowLeft, Edit, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  AsignacionEdicionForm, 
  AsignacionEdicionData, 
  TarifaEdicion, 
  TarifaExistente, 
  TarifaNueva 
} from '@/types/asignacion-edicion';
import { 
  EmpresaCliente, 
  Ramal 
} from '@/types/asignacion-registro';

const asignacionEditSchema = z.object({
  tipoUnidad: z.enum(['autobus', 'buseta', 'microbus'], { required_error: 'Tipo de unidad es requerido' }),
  empresaCliente: z.string().optional(),
  cuentaPO: z.string().optional(),
  montoFee: z.number().min(0, 'Porcentaje fee debe ser mayor o igual a 0').max(100, 'Porcentaje fee no puede ser mayor a 100'),
  tarifasPasajero: z.array(z.object({
    monto: z.number().min(0.01, 'Monto debe ser mayor a 0'),
    fechaInicioVigencia: z.string().min(1, 'Fecha es requerida'),
    estado: z.enum(['activo', 'inactivo'])
  })).min(1, 'Debe tener al menos una tarifa de pasajero'),
  tarifasServicio: z.array(z.object({
    monto: z.number().min(0.01, 'Monto debe ser mayor a 0'),
    fechaInicioVigencia: z.string().min(1, 'Fecha es requerida'),
    estado: z.enum(['activo', 'inactivo'])
  })).optional()
});

// Mock data - mismos datos del registro
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

interface AsignacionEditFormProps {
  asignacionId: number;
}

const AsignacionEditForm: React.FC<AsignacionEditFormProps> = ({ asignacionId }) => {
  const navigate = useNavigate();
  const [datosAsignacion, setDatosAsignacion] = useState<AsignacionEdicionData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [nuevaTarifaPasajero, setNuevaTarifaPasajero] = useState<Partial<TarifaNueva>>({
    monto: 0,
    fechaInicioVigencia: '',
    estado: 'activo'
  });
  const [nuevaTarifaServicio, setNuevaTarifaServicio] = useState<Partial<TarifaNueva>>({
    monto: 0,
    fechaInicioVigencia: '',
    estado: 'activo'
  });
  
  const [editandoTarifaPasajero, setEditandoTarifaPasajero] = useState<string | null>(null);
  const [editandoTarifaServicio, setEditandoTarifaServicio] = useState<string | null>(null);
  const [tarifaPasajeroEditando, setTarifaPasajeroEditando] = useState<Partial<TarifaEdicion>>({});
  const [tarifaServicioEditando, setTarifaServicioEditando] = useState<Partial<TarifaEdicion>>({});

  const form = useForm<AsignacionEdicionForm>({
    resolver: zodResolver(asignacionEditSchema),
    defaultValues: {
      id: asignacionId,
      ramal: '',
      ramalNombre: '',
      tipoRuta: 'privada',
      empresaCliente: '',
      cuentaPO: '',
      tipoUnidad: '' as any,
      montoFee: 0,
      tarifasPasajero: [],
      tarifasServicio: [],
      ocultarTarifasPasadas: false
    }
  });

  // Cargar datos de la asignación
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Mock de carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: AsignacionEdicionData = {
          id: asignacionId,
          ramal: '3',
          ramalNombre: 'Zona Franca Intel',
          tipoRuta: 'privada',
          empresaCliente: '1',
          empresaTransporte: 'Transportes Unidos S.A.',
          cuentaPO: '2',
          tipoUnidad: 'autobus',
          montoFee: 5.5,
          tarifasPasajeroExistentes: [
            {
              id: 'existing-1',
              monto: 850,
              fechaInicioVigencia: '2024-01-01',
              estado: 'activo',
              esExistente: true
            },
            {
              id: 'existing-2',
              monto: 800,
              fechaInicioVigencia: '2023-06-01',
              estado: 'inactivo',
              esExistente: true
            }
          ],
          tarifasServicioExistentes: [
            {
              id: 'existing-s1',
              monto: 15000,
              fechaInicioVigencia: '2024-01-01',
              estado: 'activo',
              esExistente: true
            }
          ]
        };

        setDatosAsignacion(mockData);
        
        // Establecer valores del formulario
        form.setValue('ramal', mockData.ramal);
        form.setValue('ramalNombre', mockData.ramalNombre);
        form.setValue('tipoRuta', mockData.tipoRuta);
        form.setValue('empresaCliente', mockData.empresaCliente);
        form.setValue('cuentaPO', mockData.cuentaPO);
        form.setValue('tipoUnidad', mockData.tipoUnidad);
        form.setValue('montoFee', mockData.montoFee);
        form.setValue('tarifasPasajero', [...mockData.tarifasPasajeroExistentes]);
        form.setValue('tarifasServicio', [...mockData.tarifasServicioExistentes]);
        
      } catch (error) {
        console.error('Error cargando datos:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la asignación",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [asignacionId, form]);

  const empresaClienteSeleccionada = form.watch('empresaCliente');
  const tarifasPasajero = form.watch('tarifasPasajero') || [];
  const tarifasServicio = form.watch('tarifasServicio') || [];
  const ocultarTarifasPasadas = form.watch('ocultarTarifasPasadas');
  const tipoRuta = form.watch('tipoRuta');

  const empresaClienteInfo = useMemo(() => {
    return mockEmpresasCliente.find(e => e.id === empresaClienteSeleccionada);
  }, [empresaClienteSeleccionada]);

  const requiereEmpresaCliente = tipoRuta === 'privada' || tipoRuta === 'especial';
  const requiereTarifasServicio = tipoRuta === 'privada' || tipoRuta === 'especial';

  const fechaActual = new Date().toISOString().split('T')[0];

  const tarifasPasajeroFiltradas = useMemo(() => {
    if (!ocultarTarifasPasadas) return tarifasPasajero;
    return tarifasPasajero.filter(t => 
      !t.esExistente || t.fechaInicioVigencia >= fechaActual
    );
  }, [tarifasPasajero, ocultarTarifasPasadas, fechaActual]);

  const tarifasServicioFiltradas = useMemo(() => {
    if (!ocultarTarifasPasadas) return tarifasServicio;
    return tarifasServicio.filter(t => 
      !t.esExistente || t.fechaInicioVigencia >= fechaActual
    );
  }, [tarifasServicio, ocultarTarifasPasadas, fechaActual]);

  const validarTarifaDuplicada = (tipo: 'pasajero' | 'servicio', nuevaTarifa: { monto: number; fechaInicioVigencia: string; estado: string }, excludeId?: string) => {
    const tarifas = tipo === 'pasajero' ? tarifasPasajero : tarifasServicio;
    return tarifas.some(t => 
      t.id !== excludeId &&
      t.monto === nuevaTarifa.monto && 
      t.fechaInicioVigencia === nuevaTarifa.fechaInicioVigencia &&
      t.estado === nuevaTarifa.estado
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
        description: "Ya existe una tarifa con el mismo monto, fecha y estado",
        variant: "destructive"
      });
      return;
    }

    const nuevaTarifa: TarifaNueva = {
      id: `new-${Date.now()}`,
      monto: nuevaTarifaPasajero.monto!,
      fechaInicioVigencia: nuevaTarifaPasajero.fechaInicioVigencia!,
      estado: nuevaTarifaPasajero.estado || 'activo',
      esExistente: false
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
        description: "Ya existe una tarifa con el mismo monto, fecha y estado",
        variant: "destructive"
      });
      return;
    }

    const nuevaTarifa: TarifaNueva = {
      id: `new-${Date.now()}`,
      monto: nuevaTarifaServicio.monto!,
      fechaInicioVigencia: nuevaTarifaServicio.fechaInicioVigencia!,
      estado: nuevaTarifaServicio.estado || 'activo',
      esExistente: false
    };

    form.setValue('tarifasServicio', [...tarifasServicio, nuevaTarifa]);
    setNuevaTarifaServicio({ monto: 0, fechaInicioVigencia: '', estado: 'activo' });
  };

  const eliminarTarifa = (tipo: 'pasajero' | 'servicio', id: string) => {
    if (tipo === 'pasajero') {
      const tarifa = tarifasPasajero.find(t => t.id === id);
      if (tarifa?.esExistente) {
        toast({
          title: "Error",
          description: "No se pueden eliminar tarifas existentes",
          variant: "destructive"
        });
        return;
      }
      form.setValue('tarifasPasajero', tarifasPasajero.filter(t => t.id !== id));
    } else {
      const tarifa = tarifasServicio.find(t => t.id === id);
      if (tarifa?.esExistente) {
        toast({
          title: "Error",
          description: "No se pueden eliminar tarifas existentes",
          variant: "destructive"
        });
        return;
      }
      form.setValue('tarifasServicio', tarifasServicio.filter(t => t.id !== id));
    }
  };

  const iniciarEdicionTarifa = (tipo: 'pasajero' | 'servicio', tarifa: TarifaEdicion) => {
    if (tipo === 'pasajero') {
      setEditandoTarifaPasajero(tarifa.id);
      setTarifaPasajeroEditando({
        monto: tarifa.monto,
        fechaInicioVigencia: tarifa.fechaInicioVigencia,
        estado: tarifa.estado
      });
    } else {
      setEditandoTarifaServicio(tarifa.id);
      setTarifaServicioEditando({
        monto: tarifa.monto,
        fechaInicioVigencia: tarifa.fechaInicioVigencia,
        estado: tarifa.estado
      });
    }
  };

  const cancelarEdicionTarifa = (tipo: 'pasajero' | 'servicio') => {
    if (tipo === 'pasajero') {
      setEditandoTarifaPasajero(null);
      setTarifaPasajeroEditando({});
    } else {
      setEditandoTarifaServicio(null);
      setTarifaServicioEditando({});
    }
  };

  const guardarEdicionTarifa = (tipo: 'pasajero' | 'servicio') => {
    const editando = tipo === 'pasajero' ? tarifaPasajeroEditando : tarifaServicioEditando;
    const idEditando = tipo === 'pasajero' ? editandoTarifaPasajero : editandoTarifaServicio;

    if (!editando.monto || !editando.fechaInicioVigencia) {
      toast({
        title: "Error",
        description: "Complete todos los campos de la tarifa",
        variant: "destructive"
      });
      return;
    }

    if (validarTarifaDuplicada(tipo, editando as any, idEditando!)) {
      toast({
        title: "Error",
        description: "Ya existe una tarifa con el mismo monto, fecha y estado",
        variant: "destructive"
      });
      return;
    }

    const tarifas = tipo === 'pasajero' ? tarifasPasajero : tarifasServicio;
    const tarifasActualizadas = tarifas.map(t => 
      t.id === idEditando 
        ? { 
            ...t, 
            monto: editando.monto!,
            fechaInicioVigencia: editando.fechaInicioVigencia!,
            estado: editando.estado as 'activo' | 'inactivo'
          }
        : t
    );

    if (tipo === 'pasajero') {
      form.setValue('tarifasPasajero', tarifasActualizadas);
      setEditandoTarifaPasajero(null);
      setTarifaPasajeroEditando({});
    } else {
      form.setValue('tarifasServicio', tarifasActualizadas as TarifaEdicion[]);
      setEditandoTarifaServicio(null);
      setTarifaServicioEditando({});
    }

    toast({
      title: "Éxito",
      description: `Tarifa de ${tipo} actualizada correctamente`
    });
  };

  const onSubmit = async (data: AsignacionEdicionForm) => {
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
          description: "Debe tener al menos una tarifa de servicio para este tipo de ruta",
          variant: "destructive"
        });
        return;
      }

      console.log('Actualizando datos:', data);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Éxito",
        description: "Asignación de ruta actualizada exitosamente"
      });

      navigate('/asignaciones');
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar la asignación",
        variant: "destructive"
      });
    }
  };

  const limpiarFormulario = () => {
    if (datosAsignacion) {
      form.setValue('empresaCliente', datosAsignacion.empresaCliente || '');
      form.setValue('cuentaPO', datosAsignacion.cuentaPO || '');
      form.setValue('tipoUnidad', datosAsignacion.tipoUnidad);
      form.setValue('montoFee', datosAsignacion.montoFee);
      form.setValue('tarifasPasajero', [...datosAsignacion.tarifasPasajeroExistentes]);
      form.setValue('tarifasServicio', [...datosAsignacion.tarifasServicioExistentes]);
      form.setValue('ocultarTarifasPasadas', false);
    }
    setNuevaTarifaPasajero({ monto: 0, fechaInicioVigencia: '', estado: 'activo' });
    setNuevaTarifaServicio({ monto: 0, fechaInicioVigencia: '', estado: 'activo' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos de la asignación...</p>
        </div>
      </div>
    );
  }

  if (!datosAsignacion) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">No se pudieron cargar los datos de la asignación</p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ramal (Solo lectura) */}
          <div className="space-y-2">
            <Label htmlFor="ramal">Ramal</Label>
            <Input
              value={`${datosAsignacion.ramalNombre} - ${datosAsignacion.tipoRuta.charAt(0).toUpperCase() + datosAsignacion.tipoRuta.slice(1)}`}
              readOnly
              className="bg-muted"
            />
          </div>

          {/* Empresa Cliente */}
          {requiereEmpresaCliente && (
            <div className="space-y-2">
              <Label htmlFor="empresaCliente">Empresa Cliente *</Label>
              <Combobox
                options={mockEmpresasCliente.map(e => ({ value: e.id, label: e.nombre }))}
                value={form.watch('empresaCliente')}
                onValueChange={(value) => {
                  form.setValue('empresaCliente', value);
                  form.setValue('cuentaPO', '');
                }}
                placeholder="Seleccionar empresa cliente..."
              />
              {form.formState.errors.empresaCliente && (
                <p className="text-sm text-destructive">{form.formState.errors.empresaCliente.message}</p>
              )}
            </div>
          )}

          {/* Cuenta PO */}
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tarifas de Pasajero *</CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ocultarTarifasPasadas"
              checked={form.watch('ocultarTarifasPasadas')}
              onCheckedChange={(checked) => 
                form.setValue('ocultarTarifasPasadas', checked as boolean)
              }
            />
            <Label htmlFor="ocultarTarifasPasadas" className="text-xs text-muted-foreground">
              Ocultar tarifas pasadas
            </Label>
          </div>
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
          {tarifasPasajeroFiltradas.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha de Inicio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-20">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tarifasPasajeroFiltradas
                    .sort((a, b) => new Date(b.fechaInicioVigencia).getTime() - new Date(a.fechaInicioVigencia).getTime())
                    .map((tarifa) => (
                    <TableRow key={tarifa.id}>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tarifa.esExistente 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {tarifa.esExistente ? 'Existente' : 'Nueva'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {editandoTarifaPasajero === tarifa.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={tarifaPasajeroEditando.monto || ''}
                            onChange={(e) => setTarifaPasajeroEditando(prev => ({
                              ...prev,
                              monto: parseFloat(e.target.value) || 0
                            }))}
                            className="w-24"
                          />
                        ) : (
                          `₡${tarifa.monto.toFixed(2)}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editandoTarifaPasajero === tarifa.id ? (
                          <Input
                            type="date"
                            value={tarifaPasajeroEditando.fechaInicioVigencia || ''}
                            onChange={(e) => setTarifaPasajeroEditando(prev => ({
                              ...prev,
                              fechaInicioVigencia: e.target.value
                            }))}
                            className="w-36"
                          />
                        ) : (
                          tarifa.fechaInicioVigencia
                        )}
                      </TableCell>
                      <TableCell>
                        {editandoTarifaPasajero === tarifa.id ? (
                          <Select
                            value={tarifaPasajeroEditando.estado || 'activo'}
                            onValueChange={(value: 'activo' | 'inactivo') =>
                              setTarifaPasajeroEditando(prev => ({ ...prev, estado: value }))
                            }
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="activo">Activo</SelectItem>
                              <SelectItem value="inactivo">Inactivo</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tarifa.estado === 'activo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tarifa.estado.charAt(0).toUpperCase() + tarifa.estado.slice(1)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {editandoTarifaPasajero === tarifa.id ? (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => guardarEdicionTarifa('pasajero')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => cancelarEdicionTarifa('pasajero')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => iniciarEdicionTarifa('pasajero', tarifa)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {!tarifa.esExistente && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => eliminarTarifa('pasajero', tarifa.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
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

      {/* Tarifas de Servicio */}
      {requiereTarifasServicio && (
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
            {tarifasServicioFiltradas.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha de Inicio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-20">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tarifasServicioFiltradas
                      .sort((a, b) => new Date(b.fechaInicioVigencia).getTime() - new Date(a.fechaInicioVigencia).getTime())
                      .map((tarifa) => (
                      <TableRow key={tarifa.id}>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tarifa.esExistente 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {tarifa.esExistente ? 'Existente' : 'Nueva'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {editandoTarifaServicio === tarifa.id ? (
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={tarifaServicioEditando.monto || ''}
                              onChange={(e) => setTarifaServicioEditando(prev => ({
                                ...prev,
                                monto: parseFloat(e.target.value) || 0
                              }))}
                              className="w-24"
                            />
                          ) : (
                            `₡${tarifa.monto.toFixed(2)}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editandoTarifaServicio === tarifa.id ? (
                            <Input
                              type="date"
                              value={tarifaServicioEditando.fechaInicioVigencia || ''}
                              onChange={(e) => setTarifaServicioEditando(prev => ({
                                ...prev,
                                fechaInicioVigencia: e.target.value
                              }))}
                              className="w-36"
                            />
                          ) : (
                            tarifa.fechaInicioVigencia
                          )}
                        </TableCell>
                        <TableCell>
                          {editandoTarifaServicio === tarifa.id ? (
                            <Select
                              value={tarifaServicioEditando.estado || 'activo'}
                              onValueChange={(value: 'activo' | 'inactivo') =>
                                setTarifaServicioEditando(prev => ({ ...prev, estado: value }))
                              }
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="inactivo">Inactivo</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              tarifa.estado === 'activo' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {tarifa.estado.charAt(0).toUpperCase() + tarifa.estado.slice(1)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {editandoTarifaServicio === tarifa.id ? (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => guardarEdicionTarifa('servicio')}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => cancelarEdicionTarifa('servicio')}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => iniciarEdicionTarifa('servicio', tarifa)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {!tarifa.esExistente && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => eliminarTarifa('servicio', tarifa.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
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

export default AsignacionEditForm;