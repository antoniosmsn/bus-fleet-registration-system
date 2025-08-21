
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import TelemetriaFilters from '@/components/telemetria/TelemetriaFilters';
import TelemetriaCards from '@/components/telemetria/TelemetriaCards';
import TelemetriaMap from '@/components/telemetria/TelemetriaMap';
import TelemetriaPagination from '@/components/telemetria/TelemetriaPagination';
import { TelemetriaFiltros, TelemetriaRecord } from '@/types/telemetria';
import { generarTelemetria, filtrarTelemetria } from '@/data/mockTelemetria';
import { exportTelemetriaToPDF, exportTelemetriaToExcel } from '@/services/exportService';

const TelemetriaListado: React.FC = () => {
  const [filtrosTemporales, setFiltrosTemporales] = useState<TelemetriaFiltros>(() => {
    const ahora = new Date();
    const inicioHoy = new Date(ahora);
    inicioHoy.setHours(0, 0, 0, 0);
    const finHoy = new Date(ahora);
    finHoy.setHours(23, 59, 59, 999);

    return {
      desdeUtc: inicioHoy.toISOString(),
      hastaUtc: finHoy.toISOString(),
      tiposRegistro: [],
      ruta: '',
      placa: '',
      busId: '',
      conductorCodigo: '',
      conductorNombre: '',
      empresasTransporte: [],
      empresasCliente: []
    };
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState<TelemetriaFiltros>(filtrosTemporales);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Generar datos de telemetría usando filtros aplicados
  const todosLosRegistros = generarTelemetria({
    desdeUtc: filtrosAplicados.desdeUtc,
    hastaUtc: filtrosAplicados.hastaUtc
  }, 320);

  // Aplicar filtros usando filtros aplicados
  const registrosFiltrados = filtrarTelemetria(todosLosRegistros, filtrosAplicados);
  
  // Paginación
  const totalRecords = registrosFiltrados.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const registrosPaginados = registrosFiltrados.slice(startIndex, startIndex + pageSize);

  // Registros seleccionados para el mapa
  const registrosSeleccionados = registrosFiltrados.filter((registro, index) => {
    const recordId = `${registro.busId}-${registro.fechaHoraUtc}-${index}`;
    return selectedIds.has(recordId);
  });

  useEffect(() => {
    document.title = 'Listado de telemetría | SistemaTransporte';
  }, []);

  // Reset página cuando cambien los filtros aplicados
  useEffect(() => {
    setCurrentPage(1);
  }, [filtrosAplicados]);

  // Limpiar selección cuando cambien los filtros aplicados
  useEffect(() => {
    setSelectedIds(new Set());
  }, [filtrosAplicados, currentPage]);

  const handleSelectionChange = useCallback((id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = registrosPaginados.map((_, index) => 
      `${registrosPaginados[index].busId}-${registrosPaginados[index].fechaHoraUtc}-${index + startIndex}`
    );
    setSelectedIds(new Set(allIds));
  }, [registrosPaginados, startIndex]);

  const handleClearAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleAplicarFiltros = useCallback((nuevosFiltros: TelemetriaFiltros) => {
    setFiltrosAplicados(nuevosFiltros);
  }, []);

  const handleExportPDF = async () => {
    try {
      await exportTelemetriaToPDF(registrosFiltrados);
      toast.success('PDF exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportTelemetriaToExcel(registrosFiltrados);
      toast.success('Excel exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar Excel');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 z-10 min-h-[72px] w-full">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">Telemetría</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full flex-1 overflow-hidden bg-muted/30 p-6">
        <div className="h-full flex flex-col lg:flex-row gap-6">
          {/* Panel izquierdo - Filtros y listado */}
          <div className="flex-1 flex flex-col min-w-0">
            <TelemetriaFilters
              filtros={filtrosTemporales}
              filtrosAplicados={filtrosAplicados}
              onFiltrosChange={setFiltrosTemporales}
              onAplicarFiltros={handleAplicarFiltros}
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
              isOpen={filtersOpen}
              onToggle={() => setFiltersOpen(!filtersOpen)}
            />
            
            <div className="flex-1 overflow-hidden bg-card rounded-lg shadow-sm">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  <TelemetriaCards
                    registros={registrosPaginados}
                    selectedIds={selectedIds}
                    onSelectionChange={handleSelectionChange}
                    onSelectAll={handleSelectAll}
                    onClearAll={handleClearAll}
                  />
                </div>
                
                <TelemetriaPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalRecords={totalRecords}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            </div>
          </div>

          {/* Panel derecho - Mapa */}
          <div className="lg:w-1/2 xl:w-2/5 min-h-[500px] lg:min-h-0">
            <div className="h-full bg-card rounded-lg shadow-sm">
              <TelemetriaMap
                registros={registrosSeleccionados}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetriaListado;
