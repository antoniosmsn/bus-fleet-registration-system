import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { MantenimientoFilters } from '@/components/mantenimiento/MantenimientoFilters';
import { MantenimientoTable } from '@/components/mantenimiento/MantenimientoTable';
import { MantenimientoPagination } from '@/components/mantenimiento/MantenimientoPagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MantenimientoFilter, MantenimientoRecord } from '@/types/mantenimiento';
import { mockMantenimientos, mockCategoriasMantenimiento } from '@/data/mockMantenimientos';
import { mockTransportistas } from '@/data/mockTransportistas';
import { registrarAcceso } from '@/services/bitacoraService';
import { toast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

export default function MantenimientoIndex() {
  const [filtros, setFiltros] = useState<MantenimientoFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Simulación de permisos de usuario
  const [isTransportistaUser] = useState(false); // En implementación real, obtener del contexto de auth
  const [transportistaUsuario] = useState<string | undefined>(undefined);

  // Registrar acceso al módulo
  useEffect(() => {
    registrarAcceso('MANTENIMIENTO_AUTOBUSES');
  }, []);

  // Filtrar mantenimientos según los criterios
  const filteredMantenimientos = mockMantenimientos.filter((mantenimiento) => {
    // Filtro por rango de fechas
    if (filtros.fechaInicio && mantenimiento.fechaMantenimiento < filtros.fechaInicio) {
      return false;
    }
    if (filtros.fechaFin && mantenimiento.fechaMantenimiento > filtros.fechaFin) {
      return false;
    }

    // Filtro por categorías (si no se selecciona ninguna, mostrar todas)
    if (filtros.categorias && filtros.categorias.length > 0) {
      if (!filtros.categorias.includes(mantenimiento.categoria.id)) {
        return false;
      }
    }

    // Filtro por placa (coincidencia parcial, mínimo 2 caracteres)
    if (filtros.placa && filtros.placa.trim()) {
      if (filtros.placa.length < 2) {
        return true; // No aplicar filtro si es menos de 2 caracteres
      }
      const placaBusqueda = filtros.placa.toLowerCase();
      const placaMantenimiento = mantenimiento.placa.toLowerCase();
      if (!placaMantenimiento.includes(placaBusqueda)) {
        return false;
      }
    }

    // Filtro por transportista
    if (filtros.transportista && mantenimiento.transportista.id !== filtros.transportista) {
      return false;
    }

    return true;
  });

  // Paginación
  const totalPages = Math.ceil(filteredMantenimientos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMantenimientos = filteredMantenimientos.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleFiltrosChange = (newFiltros: MantenimientoFilter) => {
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
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Simular reintento
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Datos actualizados",
        description: "La información se ha cargado correctamente",
      });
    }, 1000);
  };

  // Filtros de transportistas según permisos
  const availableTransportistas = isTransportistaUser 
    ? mockTransportistas.filter(t => t.id === transportistaUsuario)
    : mockTransportistas;

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Mantenimiento de Autobuses</h1>
          <p className="text-muted-foreground">
            Consulte el historial de mantenimientos realizados a los vehículos de la flota
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error temporal</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>No se pudieron cargar los datos. Por favor, inténtelo de nuevo.</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <MantenimientoFilters
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          categorias={mockCategoriasMantenimiento}
          transportistas={availableTransportistas}
          isTransportistaUser={isTransportistaUser}
          transportistaUsuario={transportistaUsuario}
        />

        <MantenimientoTable
          mantenimientos={paginatedMantenimientos}
          filtros={filtros}
          loading={loading}
        />

        <MantenimientoPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Información de resultados */}
        {!loading && !error && (
          <div className="text-center text-sm text-muted-foreground">
            Mostrando {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredMantenimientos.length)} de {filteredMantenimientos.length} registros
            {filteredMantenimientos.length !== mockMantenimientos.length && (
              <span> (filtrados de {mockMantenimientos.length} totales)</span>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}