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
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import ParadasMap from '@/components/paradas/ParadasMap';
import ParadasExport from '@/components/paradas/ParadasExport';
import ParadasPagination from '@/components/paradas/ParadasPagination';
import ParadasFilter from '@/components/paradas/ParadasFilter';
import { Edit, Trash, Plus, Save, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Parada {
  id: string;
  codigo: string;
  nombre: string;
  pais: string;
  provincia: string;
  canton: string;
  distrito: string;
  sector: string;
  lat: number;
  lng: number;
  active: boolean;
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
  distrito: string;
  sector: string;
  active: boolean;
}

interface ParadaFilterValues {
  codigo: string;
  nombre: string;
  pais: string;
  provincia: string;
  canton: string;
  distrito: string;
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
    distrito: 'El Carmen',
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
    distrito: 'Uruca',
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
    distrito: 'Hospital',
    sector: 'Sur',
    lat: 9.925,
    lng: -84.082,
    active: false
  }
];

// Datos de catálogos - en una app real, esto vendría de una API
const paises = ['Costa Rica'];
const provincias = {
  'Costa Rica': ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón']
};
const cantones = {
  'San José': ['San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 'Aserrí', 'Mora']
};
const distritos = {
  'San José': ['El Carmen', 'Merced', 'Hospital', 'Catedral', 'Zapote', 'San Francisco de Dos Ríos']
};
const sectores = {
  'El Carmen': ['Centro', 'Norte', 'Este', 'Oeste', 'Sur']
};

// Distancia mínima entre paradas en metros
const DISTANCIA_MINIMA = 25;

// Cantidad de filas a mostrar por página
const ROWS_PER_PAGE = 5;

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
      distrito: '',
      sector: '',
      active: true
    }
  });

  const [filterValues, setFilterValues] = useState<ParadaFilterValues>({
    codigo: '',
    nombre: '',
    pais: '',
    provincia: '',
    canton: '',
    distrito: '',
    sector: '',
    estado: ''
  });

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
      
      // Filtrar por distrito si se proporciona
      if (filterValues.distrito && parada.distrito !== filterValues.distrito) {
        return false;
      }
      
      // Filtrar por sector si se proporciona
      if (filterValues.sector && parada.sector !== filterValues.sector) {
        return false;
      }
      
      // Filtrar por estado si se proporciona
      if (filterValues.estado) {
        if (filterValues.estado === 'active' && !parada.active) {
          return false;
        }
        if (filterValues.estado === 'inactive' && parada.active) {
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
  const watchDistrito = form.watch('distrito');

  useEffect(() => {
    // Resetear provincia, cantón, distrito y sector cuando cambia el país
    if (form.getValues('pais') !== watchPais) {
      form.setValue('provincia', '');
      form.setValue('canton', '');
      form.setValue('distrito', '');
      form.setValue('sector', '');
    }
  }, [watchPais, form]);

  useEffect(() => {
    // Resetear cantón, distrito y sector cuando cambia la provincia
    if (form.getValues('provincia') !== watchProvincia) {
      form.setValue('canton', '');
      form.setValue('distrito', '');
      form.setValue('sector', '');
    }
  }, [watchProvincia, form]);

  useEffect(() => {
    // Resetear distrito y sector cuando cambia el cantón
    if (form.getValues('canton') !== watchCanton) {
      form.setValue('distrito', '');
      form.setValue('sector', '');
    }
  }, [watchCanton, form]);

  useEffect(() => {
    // Resetear sector cuando cambia el distrito
    if (form.getValues('distrito') !== watchDistrito) {
      form.setValue('sector', '');
    }
  }, [watchDistrito, form]);

  const handleLocationChange = (newLocation: Location | null) => {
    setSelectedLocation(newLocation);
    if (newLocation) {
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
          distrito: '',
          sector: '',
          active: true
        });
        setEditMode(false);
        setShowForm(true);
        setSelectedParada(null); // Clear any selected parada
        
        // Scroll to the form
        setTimeout(() => {
          const formElement = document.getElementById('parada-form');
          if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  // Handle selection of a parada from the map
  const handleParadaSelect = (parada: Parada) => {
    // Update selectedParada state
    setSelectedParada(parada);
    setSelectedLocation({ lat: parada.lat, lng: parada.lng });
    setEditMode(true);
    setIsDraggingEnabled(true);
    
    // Reset form with the parada data
    form.reset({
      id: parada.id,
      codigo: parada.codigo,
      nombre: parada.nombre,
      pais: parada.pais,
      provincia: parada.provincia,
      canton: parada.canton,
      distrito: parada.distrito,
      sector: parada.sector || '',
      active: parada.active
    });
    
    setShowForm(true);
    
    // Scroll to the form
    setTimeout(() => {
      const formElement = document.getElementById('parada-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    // Scroll to ensure the selected row is visible
    setTimeout(() => {
      // Find the table row for the selected parada
      const tableRow = document.querySelector(`tr[data-paradaid="${parada.id}"]`);
      if (tableRow) {
        tableRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  };

  // Nuevo manejador para cuando se arrastra un pin de parada existente
  const handleParadaLocationChange = (parada: Parada, newLocation: Location) => {
    // Actualizar la ubicación en el estado
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
      distrito: parada.distrito,
      sector: parada.sector || '',
      active: parada.active
    });
    
    setShowForm(true);
    
    // Scroll to the form
    setTimeout(() => {
      const formElement = document.getElementById('parada-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
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
    if (!selectedLocation) {
      toast.error('Debe seleccionar la ubicación en el mapa');
      return;
    }

    if (!validarDistanciaMinima(selectedLocation.lat, selectedLocation.lng, values.id)) {
      toast.error(`La parada debe estar al menos a ${DISTANCIA_MINIMA} metros de otras paradas existentes`);
      return;
    }

    if (!editMode) {
      // Verificar código único al crear
      if (paradas.some(p => p.codigo.toLowerCase() === values.codigo.toLowerCase())) {
        toast.error('Ya existe una parada con este código');
        return;
      }
    } else if (values.id) {
      // Verificar código único al editar (excluyendo la parada actual)
      if (paradas.some(p => p.id !== values.id && p.codigo.toLowerCase() === values.codigo.toLowerCase())) {
        toast.error('Ya existe otra parada con este código');
        return;
      }
    }

    if (editMode && values.id) {
      // Actualizar parada existente
      const updatedParadas = paradas.map(p => 
        p.id === values.id ? 
        { ...values, lat: selectedLocation.lat, lng: selectedLocation.lng, id: values.id } : 
        p
      );
      setParadas(updatedParadas);
      toast.success('Punto de parada actualizado correctamente');
    } else {
      // Crear nueva parada
      const newParada = {
        ...values,
        id: `${Date.now()}`,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      };
      setParadas([...paradas, newParada]);
      toast.success('Punto de parada registrado correctamente');
    }

    // En una app real, registraríamos en la bitácora de auditoría
    console.log('Audit:', editMode ? 'Usuario actualizó parada:' : 'Usuario registró nueva parada:', values.codigo);

    // Reset form and state
    setShowForm(false);
    setSelectedLocation(null);
    form.reset();
    setIsDraggingEnabled(false);
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
      distrito: parada.distrito,
      sector: parada.sector || '',
      active: parada.active
    });
    
    setShowForm(true);
    
    // Scroll to the form
    setTimeout(() => {
      const formElement = document.getElementById('parada-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedLocation(null);
    setIsDraggingEnabled(false);
    form.reset();
  };

  const handleDeleteClick = (parada: Parada) => {
    setParadaToDelete(parada);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (paradaToDelete) {
      setParadas(paradas.filter(p => p.id !== paradaToDelete.id));
      toast.success(`Parada ${paradaToDelete.codigo} eliminada correctamente`);
      
      // En una app real, registraríamos en la bitácora de auditoría
      console.log('Audit: Usuario eliminó parada:', paradaToDelete.codigo);
      
      setDeleteDialogOpen(false);
      setParadaToDelete(null);
    }
  };

  // Toggle parada active status
  const handleToggleStatus = (parada: Parada) => {
    const updatedParadas = paradas.map(p => 
      p.id === parada.id ? { ...p, active: !p.active } : p
    );
    
    setParadas(updatedParadas);
    
    // Update filtered paradas to reflect the change
    const updatedFilteredParadas = filteredParadas.map(p => 
      p.id === parada.id ? { ...p, active: !p.active } : p
    );
    
    setFilteredParadas(updatedFilteredParadas);
    
    toast.success(`Parada ${parada.codigo} ${!parada.active ? 'activada' : 'desactivada'} correctamente`);
    
    // In a real app, we would log this in the audit trail
    console.log('Audit:', `Usuario cambió estado de parada ${parada.codigo} a ${!parada.active ? 'activo' : 'inactivo'}`);
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Puntos de Parada</h1>
            <p className="text-gray-500">Administración de puntos de parada</p>
          </div>
          <ParadasExport paradas={filteredParadas} filtros={filterValues} />
        </div>
        
        {/* Nuevo componente de filtros */}
        <ParadasFilter
          onFilter={handleApplyFilters}
          paises={paises}
          provincias={provincias}
          cantones={cantones}
          distritos={distritos}
          sectores={sectores}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Panel izquierdo - Lista de paradas */}
          <div className="bg-white shadow rounded-lg p-6">
            
            
            <div className="overflow-auto mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Provincia</TableHead>
                    <TableHead>Cantón</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
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
                        <TableCell className="font-medium">{parada.codigo}</TableCell>
                        <TableCell>{parada.nombre}</TableCell>
                        <TableCell>{parada.pais}</TableCell>
                        <TableCell>{parada.provincia}</TableCell>
                        <TableCell>{parada.canton}</TableCell>
                        <TableCell>{parada.distrito}</TableCell>
                        <TableCell>{parada.sector || '-'}</TableCell>
                        <TableCell>
                          <Switch 
                            checked={parada.active}
                            onCheckedChange={() => handleToggleStatus(parada)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditParada(parada);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(parada);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                        No se encontraron paradas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Paginación */}
              {filteredParadas.length > 0 && (
                <ParadasPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
          
          {/* Panel derecho - Mapa */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-4 h-[450px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Mapa de Paradas</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>Haz clic en el mapa para agregar o arrastra pins para editarlos</span>
                </div>
              </div>
              <ParadasMap 
                paradas={paradas.map(p => ({
                  ...p,
                  estado: p.active ? 'Activo' : 'Inactivo'
                }))}
              />
            </div>
          </div>
        </div>
        
        {/* Formulario en la página principal en lugar de modal */}
        {showForm && (
          <div id="parada-form" className="bg-white shadow rounded-lg p-6 mb-8 border-t-2 border-primary">
            <h2 className="text-xl font-semibold mb-4">{editMode ? 'Editar Parada' : 'Nueva Parada'}</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleParadaFormSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Código de parada</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ingrese el código único" 
                            maxLength={20} 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Nombre</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ingrese el nombre de la parada" 
                            maxLength={100} 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pais"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">País</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un país" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paises.map(p => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="provincia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Provincia</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                          disabled={!watchPais}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una provincia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {watchPais && provincias[watchPais]?.map(p => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="canton"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Cantón</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                          disabled={!watchProvincia}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un cantón" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {watchProvincia && cantones[watchProvincia]?.map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="distrito"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Distrito</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                          disabled={!watchCanton}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un distrito" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {watchCanton && distritos[watchCanton]?.map(d => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sector</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                          disabled={!watchDistrito}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un sector (opcional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {watchDistrito && sectores[watchDistrito]?.map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-2">
                        <FormControl>
                          <Switch 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="pt-2">Parada activa</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {selectedLocation && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <Label>Ubicación seleccionada:</Label>
                    <div className="text-sm font-mono mt-1">
                      {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </div>
                    <div className="text-xs text-blue-500 mt-1">
                      Para ajustar la posición, arrastra el pin en el mapa.
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-2">
                  <Button variant="secondary" type="button" onClick={handleCancelForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {editMode ? 'Actualizar' : 'Registrar'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Diálogo de confirmación para eliminar (mantenido como modal) */}
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
