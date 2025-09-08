import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { PlantillasMatrizFilters } from '@/components/plantillas-matriz/PlantillasMatrizFilters';
import { PlantillasMatrizCards } from '@/components/plantillas-matriz/PlantillasMatrizCards';
import { PlantillasMatrizPagination } from '@/components/plantillas-matriz/PlantillasMatrizPagination';
import { ConfirmarCambioEstadoDialog } from '@/components/plantillas-matriz/ConfirmarCambioEstadoDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PlantillaMatrizFilter, PlantillaMatriz } from '@/types/plantilla-matriz';
import { mockPlantillasMatriz } from '@/data/mockPlantillasMatriz';
import { registrarAcceso } from '@/services/bitacoraService';
import { toast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

export default function PlantillasMatrizIndex() {
  console.log('PlantillasMatrizIndex component loaded - no dialogState should exist');
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<PlantillaMatrizFilter>({ estado: 'todos' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedPlantilla, setSelectedPlantilla] = useState<PlantillaMatriz | null>(null);

  // Registrar acceso al módulo
  useEffect(() => {
    registrarAcceso('PLANTILLAS_MATRIZ_MANTENIMIENTO');
  }, []);

  // Filtrar plantillas según los criterios
  const filteredPlantillas = mockPlantillasMatriz.filter(plantilla => {
    // Filtro por nombre
    if (filtros.nombre && filtros.nombre.trim()) {
      if (filtros.nombre.length < 2) {
        return true; // No aplicar filtro si es menos de 2 caracteres
      }
      const nombreBusqueda = filtros.nombre.toLowerCase();
      const nombrePlantilla = plantilla.nombre.toLowerCase();
      if (!nombrePlantilla.includes(nombreBusqueda)) {
        return false;
      }
    }

    // Filtro por identificador
    if (filtros.identificador && filtros.identificador.trim()) {
      const identificadorBusqueda = filtros.identificador.toLowerCase();
      const identificadorPlantilla = plantilla.identificador.toString().toLowerCase();
      if (!identificadorPlantilla.includes(identificadorBusqueda)) {
        return false;
      }
    }

    // Filtro por rango de fechas
    if (filtros.fechaInicio && plantilla.fechaCreacion < filtros.fechaInicio) {
      return false;
    }
    if (filtros.fechaFin && plantilla.fechaCreacion > filtros.fechaFin + 'T23:59:59.999Z') {
      return false;
    }

    // Filtro por estado
    if (filtros.estado && filtros.estado !== 'todos') {
      const estadoDeseado = filtros.estado === 'activos';
      if (plantilla.activa !== estadoDeseado) {
        return false;
      }
    }

    return true;
  });

  // Paginación
  const totalPages = Math.ceil(filteredPlantillas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPlantillas = filteredPlantillas.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFiltrosChange = (newFiltros: PlantillaMatrizFilter) => {
    setFiltros(newFiltros);
    setCurrentPage(1); // Reset to first page when filters change
    setError(null);

    // Simular carga
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Datos actualizados",
        description: "La información se ha cargado correctamente"
      });
    }, 1000);
  };

  const handleEdit = (plantilla: PlantillaMatriz) => {
    navigate(`/mantenimiento/plantillas-matriz/editar/${plantilla.id}`);
  };

  const handleToggleEstado = (plantilla: PlantillaMatriz) => {
    setSelectedPlantilla(plantilla);
    setConfirmDialogOpen(true);
  };

  const handleConfirmarCambioEstado = () => {
    if (!selectedPlantilla) return;

    // Actualizar el estado de la plantilla en el mock data
    const plantillaIndex = mockPlantillasMatriz.findIndex(p => p.id === selectedPlantilla.id);
    if (plantillaIndex !== -1) {
      mockPlantillasMatriz[plantillaIndex] = {
        ...mockPlantillasMatriz[plantillaIndex],
        activa: !mockPlantillasMatriz[plantillaIndex].activa
      };
    }

    const accion = selectedPlantilla.activa ? 'desactivada' : 'activada';
    
    toast({
      title: `Plantilla ${accion}`,
      description: `La plantilla "${selectedPlantilla.nombre}" ha sido ${accion} correctamente.`
    });
    
    // Cerrar el dialog
    setConfirmDialogOpen(false);
    setSelectedPlantilla(null);
  };

  const handleRegistrar = () => {
    navigate('/mantenimiento/plantillas-matriz/registrar');
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Plantillas de Matriz de Mantenimiento</h1>
            <p className="text-muted-foreground">
              Gestión de plantillas personalizadas para inspecciones de vehículos
            </p>
          </div>
          <Button 
            onClick={handleRegistrar}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Registrar Plantilla
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error temporal</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>No se pudieron cargar los datos. Por favor, inténtelo de nuevo.</span>
              <Button variant="outline" size="sm" onClick={handleRetry} className="ml-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <PlantillasMatrizFilters
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          loading={loading}
        />

        <PlantillasMatrizCards
          plantillas={paginatedPlantillas}
          filtros={filtros}
          loading={loading}
          onEdit={handleEdit}
          onToggleEstado={handleToggleEstado}
        />

        <PlantillasMatrizPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Información de resultados */}
        {!loading && !error && (
          <div className="text-center text-sm text-muted-foreground">
            Mostrando {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredPlantillas.length)} de {filteredPlantillas.length} registros
            {filteredPlantillas.length !== mockPlantillasMatriz.length && (
              <span> (filtrados de {mockPlantillasMatriz.length} totales)</span>
            )}
          </div>
        )}

        <ConfirmarCambioEstadoDialog
          plantilla={selectedPlantilla}
          open={confirmDialogOpen}
          onOpenChange={(open) => {
            setConfirmDialogOpen(open);
            if (!open) {
              setSelectedPlantilla(null);
            }
          }}
          onConfirm={handleConfirmarCambioEstado}
        />
      </div>
    </Layout>
  );
}