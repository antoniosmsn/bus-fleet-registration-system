
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
import ParadaMap from '@/components/paradas/ParadaMap';
import ParadasExport from '@/components/paradas/ParadasExport';
import ParadasPagination from '@/components/paradas/ParadasPagination';
import ParadasFilter from '@/components/paradas/ParadasFilter';
import { Edit, Trash, Plus, Save, MapPin, RotateCcw } from 'lucide-react';
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
  distrito: string;
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

// Convert paradas to the format expected by ParadaMap
const convertToMapParadas = (paradas: Parada[]): MapParada[] => {
  return paradas.map(parada => ({
    id: parada.id,
    codigo: parada.codigo,
    nombre: parada.nombre,
    pais: parada.pais,
    provincia: parada.provincia,
    canton: parada.canton,
    distrito: parada.distrito,
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
      distrito: '',
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
    distrito: '',
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
      distrito: '',
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
  const watchDistrito = form.watch('distrito');
  const watchLat = form.watch('lat');
  const watchLng = form.watch('lng');

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
          distrito: '',
          sector: '',
          lat: newLocation.lat.toFixed(6),
          lng: newLocation.lng.toFixed(6),
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
      distrito: parada.distrito,
      sector: parada.sector || '',
      lat: parada.lat.toFixed(6),
      lng: parada.lng.toFixed(6),
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
      distrito: parada.distrito,
      sector: parada.sector || '',
      lat: newLocation.lat.toFixed(6),
      lng: newLocation.lng.toFixed(6),
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
      distrito: parada.distrito,
      sector: parada.sector || '',
      lat: parada.lat.toFixed(6),
      lng: parada.lng.toFixed(6),
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

  const handleClearForm = () => {
    form.reset({
      codigo: '',
      nombre: '',
      pais: 'Costa Rica',
      provincia: '',
      canton: '',
      distrito: '',
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
      distrito: '',
      sector: '',
      lat: '',
      lng: '',
      active: true
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

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gestión Integral de Puntos de Parada</h1>
            <p className="text-gray-500">Registro, edición, listado y activación/inactivación desde una interfaz única</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleNewParada}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Parada
            </Button>
            <ParadasExport paradas={filteredParadas} filtros={filterValues} />
          </div>
        </div>
        
        {/* Componente de filtros */}
        <ParadasFilter
          onFilter={handleApplyFilters}
          onClearFilters={handleClearFilters}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
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
              <ParadaMap 
                paradasExistentes={convertToMapParadas(paradas)}
                selectedLocation={selectedLocation}
                onLocationChange={handleLocationChange}
                isDraggingEnabled={isDraggingEnabled}
                onParadaLocationChange={handleParadaLocationChange}
                onParadaSelect={handleParadaSelect}
              />
            </div>
          </div>
        </div>
        
        {/* Formulario en la página principal */}
        {showForm && (
          <div id="parada-form" className="bg-white shadow rounded-lg p-6 mb-8 border-t-2 border-primary">
            <h2 className="text-xl font-semibold mb-4">{editMode ? 'Editar Parada' : 'Nueva Parada'}</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleParadaFormSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codigo"
                    rules={{ 
                      required: 'El código de parada es obligatorio',
                      maxLength: { value: 20, message: 'El código no puede exceder 20 caracteres' }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Código de parada</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ingrese el código único (máx. 20 caracteres)" 
                            maxLength={20} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nombre"
                    rules={{ 
                      required: 'El nombre de la parada es obligatorio',
                      maxLength: { value: 100, message: 'El nombre no puede exceder 100 caracteres' }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Nombre</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ingrese el nombre de la parada (máx. 100 caracteres)" 
                            maxLength={100} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pais"
                    rules={{ required: 'El país es obligatorio' }}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="provincia"
                    rules={{ required: 'La provincia es obligatoria' }}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="canton"
                    rules={{ required: 'El cantón es obligatorio' }}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="distrito"
                    rules={{ required: 'El distrito es obligatorio' }}
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
                        <FormMessage />
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

                {/* Campos de coordenadas manuales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <FormLabel className="required-field">Latitud</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: 9.932000 (rango: -90.000000 a 90.000000)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">Puede seleccionar en el mapa o ingresar manualmente</p>
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
                        <FormLabel className="required-field">Longitud</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: -84.079000 (rango: -180.000000 a 180.000000)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">Puede seleccionar en el mapa o ingresar manualmente</p>
                      </FormItem>
                    )}
                  />
                </div>

                {selectedLocation && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <Label>Ubicación actual:</Label>
                    <div className="text-sm font-mono mt-1">
                      {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </div>
                    <div className="text-xs text-blue-500 mt-1">
                      Para ajustar la posición, arrastra el pin en el mapa o modifica las coordenadas arriba.
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-2">
                  <Button variant="outline" type="button" onClick={handleClearForm}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Limpiar
                  </Button>
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
