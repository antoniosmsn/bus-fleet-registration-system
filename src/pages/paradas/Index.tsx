
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ParadaMap from '@/components/paradas/ParadaMap';
import ParadasExport from '@/components/paradas/ParadasExport';
import ParadasPagination from '@/components/paradas/ParadasPagination';
import ParadasFilter from '@/components/paradas/ParadasFilter';
import { Edit, Trash, Plus, Save, MapPin, RotateCcw, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Parada {
  id: string;
  codigo: string;
  nombre: string;
  pais: string;
  provincia: string;
  canton: string;
  sector: string;
  lat: number;
  lng: number;
  active: boolean;
}

interface MapParada {
  id: string;
  codigo: string;
  nombre: string;
  pais: string;
  provincia: string;
  canton: string;
  distrito: string;
  sector: string;
  estado: string;
  lat: number;
  lng: number;
}

interface Location {
  lat: number;
  lng: number;
}

interface ParadaFormValues {
  id?: string;
  codigo: string;
  nombre: string;
  pais: string;
  provincia: string;
  canton: string;
  sector: string;
  lat: string;
  lng: string;
  active: boolean;
}

interface ParadaFilterValues {
  codigo: string;
  nombre: string;
  pais: string;
  provincia: string;
  canton: string;
  sector: string;
  estado: string;
}

// Mock data para paradas - en una app real, esto vendría de una API
const paradasMock: Parada[] = [
  {
    id: '1',
    codigo: 'PARA-001',
    nombre: 'Terminal Central',
    pais: 'Costa Rica',
    provincia: 'San José',
    canton: 'San José',
    sector: 'Centro',
    lat: 9.932,
    lng: -84.079,
    active: true
  },
  {
    id: '2',
    codigo: 'PARA-002',
    nombre: 'Parada Norte',
    pais: 'Costa Rica',
    provincia: 'San José',
    canton: 'San José',
    sector: 'Industrial',
    lat: 9.945,
    lng: -84.085,
    active: true
  },
  {
    id: '3',
    codigo: 'PARA-003',
    nombre: 'Parada Sur',
    pais: 'Costa Rica',
    provincia: 'San José',
    canton: 'San José',
    sector: 'Residencial Sur',
    lat: 9.925,
    lng: -84.082,
    active: false
  }
];

// Convert paradas to the format expected by ParadaMap
const convertToMapParadas = (paradas: Parada[]): MapParada[] => {
  return paradas.map(parada => ({
    id: parada.id,
    codigo: parada.codigo,
    nombre: parada.nombre,
    pais: parada.pais,
    provincia: parada.provincia,
    canton: parada.canton,
    distrito: '', // Ya no usamos distrito
    sector: parada.sector || '',
    estado: parada.active ? 'Activo' : 'Inactivo',
    lat: parada.lat,
    lng: parada.lng
  }));
};

// Datos de catálogos - en una app real, esto vendría de una API
const paises = ['Costa Rica'];
const provincias = {
  'Costa Rica': ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón']
};
const cantones = {
  'San José': ['San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 'Aserrí', 'Mora']
};

// Distancia mínima entre paradas en metros
const DISTANCIA_MINIMA = 25;

// Cantidad de filas a mostrar por página
const ROWS_PER_PAGE = 8;

const ParadasIndex = () => {
  const [paradas, setParadas] = useState<Parada[]>(paradasMock);
  const [filteredParadas, setFilteredParadas] = useState<Parada[]>(paradasMock);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedParada, setSelectedParada] = useState<Parada | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paradaToDelete, setParadaToDelete] = useState<Parada | null>(null);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedParadas, setPaginatedParadas] = useState<Parada[]>([]);
  
  const form = useForm<ParadaFormValues>({
    defaultValues: {
      codigo: '',
      nombre: '',
      pais: 'Costa Rica',
      provincia: '',
      canton: '',
      sector: '',
      lat: '',
      lng: '',
      active: true
    }
  });

  const [filterValues, setFilterValues] = useState<ParadaFilterValues>({
    codigo: '',
    nombre: '',
    pais: '',
    provincia: '',
    canton: '',
    sector: '',
    estado: ''
  });

  // Validar coordenadas manuales
  const validateCoordinates = (lat: string, lng: string): { isValid: boolean; error?: string } => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    
    if (isNaN(latNum) || isNaN(lngNum)) {
      return { isValid: false, error: 'Las coordenadas deben ser números válidos' };
    }
    
    if (latNum < -90 || latNum > 90) {
      return { isValid: false, error: 'La latitud debe estar entre -90.000000 y 90.000000' };
    }
    
    if (lngNum < -180 || lngNum > 180) {
      return { isValid: false, error: 'La longitud debe estar entre -180.000000 y 180.000000' };
    }
    
    return { isValid: true };
  };

  // Aplicar filtros avanzados
  const handleApplyFilters = (filterValues: ParadaFilterValues) => {
    // Save the filter values for export component
    setFilterValues(filterValues);
    
    const filtered = paradas.filter(parada => {
      // Filtrar por código si se proporciona
      if (filterValues.codigo && !parada.codigo.toLowerCase().includes(filterValues.codigo.toLowerCase())) {
        return false;
      }
      
      // Filtrar por nombre si se proporciona
      if (filterValues.nombre && !parada.nombre.toLowerCase().includes(filterValues.nombre.toLowerCase())) {
        return false;
      }
      
      // Filtrar por país si se proporciona
      if (filterValues.pais && parada.pais !== filterValues.pais) {
        return false;
      }
      
      // Filtrar por provincia si se proporciona
      if (filterValues.provincia && parada.provincia !== filterValues.provincia) {
        return false;
      }
      
      // Filtrar por cantón si se proporciona
      if (filterValues.canton && parada.canton !== filterValues.canton) {
        return false;
      }
      
      // Filtrar por sector si se proporciona
      if (filterValues.sector && !parada.sector.toLowerCase().includes(filterValues.sector.toLowerCase())) {
        return false;
      }
      
      // Filtrar por estado si se proporciona
      if (filterValues.estado) {
        if (filterValues.estado === 'Activo' && !parada.active) {
          return false;
        }
        if (filterValues.estado === 'Inactivo' && parada.active) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredParadas(filtered);
    // Reiniciar a la primera página al aplicar filtros
    setCurrentPage(1);
    
    // Notificar al usuario
    toast.info(`Se encontraron ${filtered.length} paradas con los filtros aplicados`);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilteredParadas(paradas);
    setFilterValues({
      codigo: '',
      nombre: '',
      pais: '',
      provincia: '',
      canton: '',
      sector: '',
      estado: ''
    });
    setCurrentPage(1);
    toast.info('Filtros limpiados');
  };

  // Toggle filtros
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Actualizar las paradas paginadas cuando cambian las filtradas o la página actual
  useEffect(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    setPaginatedParadas(filteredParadas.slice(startIndex, endIndex));
  }, [filteredParadas, currentPage]);

  // Calcular el total de páginas
  const totalPages = Math.max(1, Math.ceil(filteredParadas.length / ROWS_PER_PAGE));

  // Manejar el cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Gestionar dependencias en los selectores
  const watchPais = form.watch('pais');
  const watchProvincia = form.watch('provincia');
  const watchCanton = form.watch('canton');
  const watchLat = form.watch('lat');
  const watchLng = form.watch('lng');

  useEffect(() => {
    // Resetear provincia y cantón cuando cambia el país
    if (form.getValues('pais') !== watchPais) {
      form.setValue('provincia', '');
      form.setValue('canton', '');
    }
  }, [watchPais, form]);

  useEffect(() => {
    // Resetear cantón cuando cambia la provincia
    if (form.getValues('provincia') !== watchProvincia) {
      form.setValue('canton', '');
    }
  }, [watchProvincia, form]);

  // Actualizar mapa cuando se cambian coordenadas manualmente
  useEffect(() => {
    if (watchLat && watchLng) {
      const validation = validateCoordinates(watchLat, watchLng);
      if (validation.isValid) {
        const newLocation = { lat: parseFloat(watchLat), lng: parseFloat(watchLng) };
        setSelectedLocation(newLocation);
        setIsDraggingEnabled(true);
      }
    }
  }, [watchLat, watchLng]);

  const handleLocationChange = (newLocation: Location | null) => {
    setSelectedLocation(newLocation);
    if (newLocation) {
      // Actualizar campos de latitud y longitud en el formulario
      form.setValue('lat', newLocation.lat.toFixed(6));
      form.setValue('lng', newLocation.lng.toFixed(6));
      
      // Enable dragging
      setIsDraggingEnabled(true);
      
      // Show the form for new paradas
      if (!showForm) {
        // Resetear el formulario antes de mostrar
        form.reset({
          codigo: '',
          nombre: '',
          pais: 'Costa Rica',
          provincia: '',
          canton: '',
          sector: '',
          lat: newLocation.lat.toFixed(6),
          lng: newLocation.lng.toFixed(6),
          active: true
        });
        setEditMode(false);
        setShowForm(true);
        setSelectedParada(null); // Clear any selected parada
      }
    }
  };

  // Handle selection of a parada from the map
  const handleParadaSelect = (mapParada: MapParada) => {
    // Convert back from map format to our format
    const parada = paradas.find(p => p.id === mapParada.id);
    if (!parada) return;

    setSelectedParada(parada);
    setSelectedLocation({ lat: parada.lat, lng: parada.lng });
    setEditMode(true);
    setIsDraggingEnabled(true);
    
    form.reset({
      id: parada.id,
      codigo: parada.codigo,
      nombre: parada.nombre,
      pais: parada.pais,
      provincia: parada.provincia,
      canton: parada.canton,
      sector: parada.sector || '',
      lat: parada.lat.toFixed(6),
      lng: parada.lng.toFixed(6),
      active: parada.active
    });
    
    setShowForm(true);
  };

  // Nuevo manejador para cuando se arrastra un pin de parada existente
  const handleParadaLocationChange = (mapParada: MapParada, newLocation: Location) => {
    // Convert back from map format to our format
    const parada = paradas.find(p => p.id === mapParada.id);
    if (!parada) return;

    const updatedParadas = paradas.map(p => 
      p.id === parada.id ? { ...p, lat: newLocation.lat, lng: newLocation.lng } : p
    );
    
    // Actualizar el estado de paradas
    setParadas(updatedParadas);
    
    // Preparar el formulario con los datos actualizados
    setSelectedParada({...parada, lat: newLocation.lat, lng: newLocation.lng});
    setSelectedLocation(newLocation);
    setEditMode(true);
    setIsDraggingEnabled(true);
    
    // Resetear el formulario con los datos actualizados
    form.reset({
      id: parada.id,
      codigo: parada.codigo,
      nombre: parada.nombre,
      pais: parada.pais,
      provincia: parada.provincia,
      canton: parada.canton,
      sector: parada.sector || '',
      lat: newLocation.lat.toFixed(6),
      lng: newLocation.lng.toFixed(6),
      active: parada.active
    });
    
    setShowForm(true);
    
    // Mostrar notificación al usuario
    toast.info("Arrastraste la parada. Confirma los cambios para guardar la nueva ubicación.");
  };

  // Validar distancia mínima entre paradas
  const validarDistanciaMinima = (lat: number, lng: number, paradaId?: string): boolean => {
    for (const parada of paradas) {
      // Ignorar la propia parada si estamos editando
      if (paradaId && parada.id === paradaId) continue;
      
      // Calcular distancia en línea recta (fórmula de Haversine)
      const R = 6371e3; // Radio de la Tierra en metros
      const φ1 = (parada.lat * Math.PI) / 180;
      const φ2 = (lat * Math.PI) / 180;
      const Δφ = ((lat - parada.lat) * Math.PI) / 180;
      const Δλ = ((lng - parada.lng) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance < DISTANCIA_MINIMA) {
        return false;
      }
    }
    return true;
  };

  const handleParadaFormSubmit = (values: ParadaFormValues) => {
    // Validar coordenadas
    const coordValidation = validateCoordinates(values.lat, values.lng);
    if (!coordValidation.isValid) {
      toast.error(coordValidation.error);
      return;
    }

    const lat = parseFloat(values.lat);
    const lng = parseFloat(values.lng);

    if (!validarDistanciaMinima(lat, lng, values.id)) {
      toast.error(`La parada debe estar al menos a ${DISTANCIA_MINIMA} metros de otras paradas existentes`);
      return;
    }

    if (!editMode) {
      // Verificar código único al crear
      if (paradas.some(p => p.codigo.toLowerCase() === values.codigo.toLowerCase())) {
        toast.error('Ya existe una parada con este código');
        return;
      }

      // Verificar nombre único al crear
      if (paradas.some(p => p.nombre.toLowerCase() === values.nombre.toLowerCase())) {
        toast.error('Ya existe una parada con este nombre en la zona franca');
        return;
      }
    } else if (values.id) {
      // Verificar código único al editar (excluyendo la parada actual)
      if (paradas.some(p => p.id !== values.id && p.codigo.toLowerCase() === values.codigo.toLowerCase())) {
        toast.error('Ya existe otra parada con este código');
        return;
      }

      // Verificar nombre único al editar (excluyendo la parada actual)
      if (paradas.some(p => p.id !== values.id && p.nombre.toLowerCase() === values.nombre.toLowerCase())) {
        toast.error('Ya existe otra parada con este nombre en la zona franca');
        return;
      }
    }

    if (editMode && values.id) {
      // Actualizar parada existente
      const paradaAnterior = paradas.find(p => p.id === values.id);
      const updatedParadas = paradas.map(p => 
        p.id === values.id ? 
        { ...values, lat, lng, id: values.id } : 
        p
      );
      setParadas(updatedParadas);
      
      // Registrar en bitácora de auditoría
      console.log('Audit: Usuario actualizó parada', {
        paradaId: values.id,
        codigo: values.codigo,
        valoresAnteriores: paradaAnterior,
        valoresNuevos: { ...values, lat, lng },
        usuario: 'Usuario actual',
        fecha: new Date().toISOString(),
        accion: 'actualizar_parada'
      });
      
      toast.success('Punto de parada actualizado correctamente');
    } else {
      // Crear nueva parada
      const newParada = {
        ...values,
        id: `${Date.now()}`,
        lat,
        lng
      };
      setParadas([...paradas, newParada]);
      
      // Registrar en bitácora de auditoría
      console.log('Audit: Usuario registró nueva parada', {
        paradaId: newParada.id,
        codigo: values.codigo,
        valoresNuevos: newParada,
        usuario: 'Usuario actual',
        fecha: new Date().toISOString(),
        accion: 'registrar_parada'
      });
      
      toast.success('Punto de parada registrado correctamente');
    }

    // Reset form and state
    setShowForm(false);
    setSelectedLocation(null);
    form.reset();
    setIsDraggingEnabled(false);
    setSelectedParada(null);
    setEditMode(false);
  };

  const handleEditParada = (parada: Parada) => {
    setSelectedParada(parada);
    setSelectedLocation({ lat: parada.lat, lng: parada.lng });
    setEditMode(true);
    setIsDraggingEnabled(true);
    
    form.reset({
      id: parada.id,
      codigo: parada.codigo,
      nombre: parada.nombre,
      pais: parada.pais,
      provincia: parada.provincia,
      canton: parada.canton,
      sector: parada.sector || '',
      lat: parada.lat.toFixed(6),
      lng: parada.lng.toFixed(6),
      active: parada.active
    });
    
    setShowForm(true);
  };

  const handleClearForm = () => {
    form.reset({
      codigo: '',
      nombre: '',
      pais: 'Costa Rica',
      provincia: '',
      canton: '',
      sector: '',
      lat: '',
      lng: '',
      active: true
    });
    setSelectedLocation(null);
    setIsDraggingEnabled(false);
    setSelectedParada(null);
    setEditMode(false);
    toast.info('Formulario limpiado');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedLocation(null);
    setIsDraggingEnabled(false);
    form.reset();
    setSelectedParada(null);
    setEditMode(false);
  };

  const handleDeleteClick = (parada: Parada) => {
    setParadaToDelete(parada);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (paradaToDelete) {
      setParadas(paradas.filter(p => p.id !== paradaToDelete.id));
      
      // Registrar en bitácora de auditoría
      console.log('Audit: Usuario eliminó parada', {
        paradaId: paradaToDelete.id,
        codigo: paradaToDelete.codigo,
        valoresAnteriores: paradaToDelete,
        usuario: 'Usuario actual',
        fecha: new Date().toISOString(),
        accion: 'eliminar_parada'
      });
      
      toast.success(`Parada ${paradaToDelete.codigo} eliminada correctamente`);
      
      setDeleteDialogOpen(false);
      setParadaToDelete(null);
    }
  };

  // Toggle parada active status
  const handleToggleStatus = (parada: Parada) => {
    const estadoAnterior = parada.active;
    const estadoNuevo = !parada.active;
    
    const updatedParadas = paradas.map(p => 
      p.id === parada.id ? { ...p, active: estadoNuevo } : p
    );
    
    setParadas(updatedParadas);
    
    // Update filtered paradas to reflect the change
    const updatedFilteredParadas = filteredParadas.map(p => 
      p.id === parada.id ? { ...p, active: estadoNuevo } : p
    );
    
    setFilteredParadas(updatedFilteredParadas);
    
    // Registrar en bitácora de auditoría
    console.log('Audit: Usuario cambió estado de parada', {
      paradaId: parada.id,
      codigo: parada.codigo,
      estadoAnterior: estadoAnterior ? 'activo' : 'inactivo',
      estadoNuevo: estadoNuevo ? 'activo' : 'inactivo',
      usuario: 'Usuario actual',
      fecha: new Date().toISOString(),
      accion: 'cambiar_estado_parada'
    });
    
    toast.success(`Parada ${parada.codigo} ${estadoNuevo ? 'activada' : 'inactivada'} correctamente`);
  };

  const handleNewParada = () => {
    setEditMode(false);
    setSelectedParada(null);
    setSelectedLocation(null);
    setIsDraggingEnabled(false);
    
    form.reset({
      codigo: '',
      nombre: '',
      pais: 'Costa Rica',
      provincia: '',
      canton: '',
      sector: '',
      lat: '',
      lng: '',
      active: true
    });
    
    setShowForm(true);
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
        {/* Header compacto */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold">Gestión de Paradas</h1>
            <p className="text-sm text-gray-500">Administra los puntos de parada de la zona franca</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleNewParada} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Parada
            </Button>
            <ParadasExport paradas={filteredParadas} filtros={filterValues} />
          </div>
        </div>
        
        {/* Filtros colapsables */}
        <ParadasFilter
          onFilter={handleApplyFilters}
          onClearFilters={handleClearFilters}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
        />
        
        {/* Layout principal en grid responsivo */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Columna izquierda - Lista y Formulario */}
          <div className="xl:col-span-2 space-y-4">
            {/* Lista de paradas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Lista de Paradas ({filteredParadas.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto max-h-80">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Código</TableHead>
                        <TableHead className="text-xs">Nombre</TableHead>
                        <TableHead className="text-xs">Estado</TableHead>
                        <TableHead className="text-xs text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedParadas.length > 0 ? (
                        paginatedParadas.map((parada) => (
                          <TableRow 
                            key={parada.id} 
                            className={`cursor-pointer hover:bg-gray-50 ${selectedParada?.id === parada.id ? 'bg-blue-50' : ''}`}
                            onClick={() => handleEditParada(parada)}
                            data-paradaid={parada.id}
                          >
                            <TableCell className="text-xs font-medium">{parada.codigo}</TableCell>
                            <TableCell className="text-xs">{parada.nombre}</TableCell>
                            <TableCell>
                              <Switch 
                                checked={parada.active}
                                onCheckedChange={() => handleToggleStatus(parada)}
                                onClick={(e) => e.stopPropagation()}
                                className="scale-75"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditParada(parada);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(parada);
                                  }}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500 text-sm">
                            No se encontraron paradas
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Paginación compacta */}
                {filteredParadas.length > 0 && (
                  <div className="p-3 border-t">
                    <ParadasPagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Formulario colapsable */}
            {showForm && (
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {editMode ? 'Editar Parada' : 'Nueva Parada'}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleCancelForm}
                      className="h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleParadaFormSubmit)} className="space-y-3">
                      {/* Campos básicos - 3 columnas */}
                      <div className="grid grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name="codigo"
                          rules={{ 
                            required: 'El código es obligatorio',
                            maxLength: { value: 20, message: 'Máx. 20 caracteres' }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs required-field">Código</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="PARA-001" 
                                  maxLength={20} 
                                  className="h-8 text-xs"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="nombre"
                          rules={{ 
                            required: 'El nombre es obligatorio',
                            maxLength: { value: 100, message: 'Máx. 100 caracteres' }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs required-field">Nombre</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Terminal Central" 
                                  maxLength={100} 
                                  className="h-8 text-xs"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="active"
                          render={({ field }) => (
                            <FormItem className="flex flex-col justify-center">
                              <FormLabel className="text-xs">Estado</FormLabel>
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <Switch 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="scale-75"
                                  />
                                  <span className="text-xs">{field.value ? 'Activa' : 'Inactiva'}</span>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Ubicación geográfica - 3 columnas */}
                      <div className="grid grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name="pais"
                          rules={{ required: 'El país es obligatorio' }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs required-field">País</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Seleccione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {paises.map(p => (
                                    <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="provincia"
                          rules={{ required: 'La provincia es obligatoria' }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs required-field">Provincia</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                                disabled={!watchPais}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Seleccione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {watchPais && provincias[watchPais]?.map(p => (
                                    <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="canton"
                          rules={{ required: 'El cantón es obligatorio' }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs required-field">Cantón</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                                disabled={!watchProvincia}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Seleccione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {watchProvincia && cantones[watchProvincia]?.map(c => (
                                    <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Sector y coordenadas - 3 columnas */}
                      <div className="grid grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name="sector"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Sector</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Sector (opcional)" 
                                  maxLength={100} 
                                  className="h-8 text-xs"
                                  {...field} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lat"
                          rules={{ 
                            required: 'La latitud es obligatoria',
                            validate: (value) => {
                              const validation = validateCoordinates(value, form.getValues('lng'));
                              return validation.isValid || validation.error;
                            }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs required-field">Latitud</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="9.932000" 
                                  className="h-8 text-xs"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lng"
                          rules={{ 
                            required: 'La longitud es obligatoria',
                            validate: (value) => {
                              const validation = validateCoordinates(form.getValues('lat'), value);
                              return validation.isValid || validation.error;
                            }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs required-field">Longitud</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="-84.079000" 
                                  className="h-8 text-xs"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {selectedLocation && (
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Ubicación:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                          <div className="text-blue-600 mt-1">
                            Arrastra el pin en el mapa para ajustar la posición
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="outline" type="button" onClick={handleClearForm} size="sm">
                          <RotateCcw className="mr-1 h-3 w-3" />
                          Limpiar
                        </Button>
                        <Button variant="secondary" type="button" onClick={handleCancelForm} size="sm">
                          Cancelar
                        </Button>
                        <Button type="submit" size="sm">
                          <Save className="mr-1 h-3 w-3" />
                          {editMode ? 'Actualizar' : 'Registrar'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Columna derecha - Mapa */}
          <div className="xl:col-span-3">
            <Card className="h-[600px]">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Mapa de Paradas</CardTitle>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>Clic para agregar | Arrastra para editar</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-2 h-[calc(100%-4rem)]">
                <ParadaMap 
                  paradasExistentes={convertToMapParadas(paradas)}
                  selectedLocation={selectedLocation}
                  onLocationChange={handleLocationChange}
                  isDraggingEnabled={isDraggingEnabled}
                  onParadaLocationChange={handleParadaLocationChange}
                  onParadaSelect={handleParadaSelect}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Diálogo de confirmación para eliminar */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Está seguro que desea eliminar la parada {paradaToDelete?.codigo} - {paradaToDelete?.nombre}?
                <br />
                Esta acción no puede deshacerse.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default ParadasIndex;
