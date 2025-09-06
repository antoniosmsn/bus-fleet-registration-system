import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { InspeccionFilters } from '@/components/inspecciones/InspeccionFilters';
import { InspeccionTable } from '@/components/inspecciones/InspeccionTable';
import { InspeccionPagination } from '@/components/inspecciones/InspeccionPagination';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InspeccionFilter } from '@/types/inspeccion-autobus';
import { mockInspeccionesAutobus } from '@/data/mockInspeccionesAutobus';
import { mockPlantillasInspeccion } from '@/data/mockPlantillasInspeccion';
import { mockTransportistas } from '@/data/mockTransportistas';
import { registrarAcceso } from '@/services/bitacoraService';
import { toast } from '@/hooks/use-toast';

export default function InspeccionesIndex() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<InspeccionFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    registrarAcceso('INSPECCIONES_AUTOBUS');
  }, []);

  // Filtrar inspecciones
  const filteredInspecciones = mockInspeccionesAutobus.filter(inspeccion => {
    if (filtros.fechaInicio && inspeccion.fechaInspeccion < filtros.fechaInicio) return false;
    if (filtros.fechaFin && inspeccion.fechaInspeccion > filtros.fechaFin) return false;
    if (filtros.placa && !inspeccion.placa.toLowerCase().includes(filtros.placa.toLowerCase())) return false;
    if (filtros.conductor && !`${inspeccion.conductor.nombre} ${inspeccion.conductor.apellidos}`.toLowerCase().includes(filtros.conductor.toLowerCase())) return false;
    if (filtros.transportista && inspeccion.transportista.id !== filtros.transportista) return false;
    if (filtros.plantilla && inspeccion.plantilla.id !== filtros.plantilla) return false;
    if (filtros.calificacionMin !== undefined && inspeccion.calificacionFinal < filtros.calificacionMin) return false;
    if (filtros.calificacionMax !== undefined && inspeccion.calificacionFinal > filtros.calificacionMax) return false;
    if (filtros.estado && inspeccion.estado !== filtros.estado) return false;
    return true;
  });

  // Paginación
  const totalPages = Math.ceil(filteredInspecciones.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedInspecciones = filteredInspecciones.slice(startIndex, startIndex + pageSize);

  const handleFiltrosChange = (newFiltros: InspeccionFilter) => {
    setFiltros(newFiltros);
    setCurrentPage(1);
    setError(null);
    
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
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

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Listado de inspecciones autobuses</h1>
            <p className="text-muted-foreground">Gestión de inspecciones de mantenimiento</p>
          </div>
          <Button onClick={() => navigate('/mantenimiento/inspecciones/registrar')}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Inspección
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error temporal</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>No se pudieron cargar los datos.</span>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <InspeccionFilters
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          plantillas={mockPlantillasInspeccion}
          transportistas={mockTransportistas}
          loading={loading}
        />

        <InspeccionTable
          inspecciones={paginatedInspecciones}
          loading={loading}
        />

        <InspeccionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredInspecciones.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </Layout>
  );
}