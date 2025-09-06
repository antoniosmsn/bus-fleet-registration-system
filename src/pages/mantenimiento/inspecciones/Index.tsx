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
    // Filtro por fecha
    if (filtros.fechaInicio && inspeccion.fechaInspeccion < filtros.fechaInicio) return false;
    if (filtros.fechaFin && inspeccion.fechaInspeccion > filtros.fechaFin) return false;
    
    // Filtro por hora (usar fechaCreacion que tiene hora completa)
    if (filtros.horaInicio || filtros.horaFin) {
      const fechaCompleta = new Date(inspeccion.fechaCreacion);
      const horaInspeccion = fechaCompleta.toTimeString().substring(0, 5);
      
      if (filtros.horaInicio && horaInspeccion < filtros.horaInicio) return false;
      if (filtros.horaFin && horaInspeccion > filtros.horaFin) return false;
    }
    
    // Otros filtros
    if (filtros.placa && !inspeccion.placa.toLowerCase().includes(filtros.placa.toLowerCase())) return false;
    if (filtros.responsable && !inspeccion.usuarioCreacion.toLowerCase().includes(filtros.responsable.toLowerCase())) return false;
    if (filtros.transportista && inspeccion.transportista.id !== filtros.transportista) return false;
    if (filtros.consecutivo && !inspeccion.consecutivo.toString().includes(filtros.consecutivo)) return false;
    return true;
  });

  // Ordenar por fecha de inspección descendente (más recientes primero)
  const sortedInspecciones = [...filteredInspecciones].sort((a, b) => 
    new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
  );

  // Paginación
  const totalPages = Math.ceil(sortedInspecciones.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedInspecciones = sortedInspecciones.slice(startIndex, startIndex + pageSize);

  const handleFiltrosChange = (newFiltros: InspeccionFilter) => {
    setFiltros(newFiltros);
    setCurrentPage(1);
    setError(null);
  };

  const handleBuscar = () => {
    setLoading(true);
    setCurrentPage(1);
    setError(null);
    
    // Validar fechas
    if (filtros.fechaInicio && filtros.fechaFin && filtros.fechaInicio > filtros.fechaFin) {
      toast({
        title: "Error en fechas",
        description: "La fecha de inicio no puede ser mayor que la fecha de fin",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    // Validar horas
    if (filtros.horaInicio && filtros.horaFin && filtros.horaInicio > filtros.horaFin) {
      toast({
        title: "Error en horas",
        description: "La hora de inicio no puede ser mayor que la hora de fin",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    setTimeout(() => setLoading(false), 500);
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
            <h1 className="text-2xl font-bold">Listado Ficha Mantenimientos</h1>
            <p className="text-muted-foreground">Gestión de inspecciones de mantenimiento</p>
          </div>
          <Button onClick={() => navigate('/mantenimiento/inspecciones/registrar')}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar
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
          onBuscar={handleBuscar}
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
          totalItems={sortedInspecciones.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </Layout>
  );
}