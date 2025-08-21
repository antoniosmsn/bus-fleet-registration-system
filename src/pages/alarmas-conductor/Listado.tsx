import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import AlarmasConductorFilters from '@/components/alarmas-conductor/AlarmasConductorFilters';
import AlarmasConductorCards from '@/components/alarmas-conductor/AlarmasConductorCards';
import AlarmasConductorMap from '@/components/alarmas-conductor/AlarmasConductorMap';
import AlarmasConductorPagination from '@/components/alarmas-conductor/AlarmasConductorPagination';
import { AlarmasFiltros, AlarmaRecord } from '@/types/alarma-conductor';
import { generarAlarmas, filtrarAlarmas } from '@/data/mockAlarmasConductor';

const AlarmasConductorListado: React.FC = () => {
  const [filtrosTemporales, setFiltrosTemporales] = useState<AlarmasFiltros>(() => {
    const ahora = new Date();
    const inicioHoy = new Date(ahora);
    inicioHoy.setHours(0, 0, 0, 0);
    const finHoy = new Date(ahora);
    finHoy.setHours(23, 59, 59, 999);
    
    return {
      desdeUtc: inicioHoy.toISOString(),
      hastaUtc: finHoy.toISOString(),
      tiposAlarma: [],
      conductor: '',
      conductorCodigo: '',
      placa: '',
      busId: '',
      ruta: '',
      empresasTransporte: [],
      empresasCliente: []
    };
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState<AlarmasFiltros>(filtrosTemporales);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Generar datos mock usando el rango de fechas de los filtros aplicados
  const todasLasAlarmas = generarAlarmas({
    desdeUtc: filtrosAplicados.desdeUtc,
    hastaUtc: filtrosAplicados.hastaUtc
  }, 150);

  // Aplicar filtros usando filtros aplicados
  const alarmasFiltradas = filtrarAlarmas(todasLasAlarmas, filtrosAplicados);
  
  // Paginación
  const totalRecords = alarmasFiltradas.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const alarmasPaginadas = alarmasFiltradas.slice(startIndex, startIndex + pageSize);

  // Alarmas seleccionadas para el mapa
  const alarmasSeleccionadas = alarmasFiltradas.filter((alarma, index) => {
    const alarmaId = `${alarma.busId}-${alarma.fechaHoraGeneracion}-${index}`;
    return selectedIds.has(alarmaId);
  });

  useEffect(() => {
    document.title = 'Alertas de Conductor | SistemaTransporte';
  }, []);

  // Reset página cuando cambien los filtros aplicados
  useEffect(() => {
    setCurrentPage(1);
  }, [filtrosAplicados]);

  // Reset selección cuando cambien los filtros aplicados
  useEffect(() => {
    setSelectedIds(new Set());
  }, [filtrosAplicados]);

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
    const allIds = alarmasPaginadas.map((alarma, index) => 
      `${alarma.busId}-${alarma.fechaHoraGeneracion}-${index}`
    );
    setSelectedIds(new Set(allIds));
  }, [alarmasPaginadas]);

  const handleClearAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleAplicarFiltros = useCallback((filtros: AlarmasFiltros) => {
    setFiltrosAplicados(filtros);
    setFiltersOpen(false);
  }, []);

  const handleExportPDF = async () => {
    try {
      // Aquí iría la lógica de exportación a PDF
      toast.success('PDF exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      // Aquí iría la lógica de exportación a Excel
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
    <Layout>
      <div className="h-[calc(100vh-120px)] w-full flex flex-col bg-background">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Alertas de Conductor</h1>
        </div>
        
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          {/* Panel izquierdo - Filtros y listado */}
          <div className="flex-1 flex flex-col min-w-0">
            <AlarmasConductorFilters
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
                  <AlarmasConductorCards
                    alarmas={alarmasPaginadas}
                    selectedIds={selectedIds}
                    onSelectionChange={handleSelectionChange}
                    onSelectAll={handleSelectAll}
                    onClearAll={handleClearAll}
                  />
                </div>
                
                <AlarmasConductorPagination
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
              <AlarmasConductorMap
                alarmas={alarmasSeleccionadas}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AlarmasConductorListado;