import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import CargaCreditosFiltros from '@/components/carga-creditos/CargaCreditosFiltros';
import TablaCargaCreditos from '@/components/carga-creditos/TablaCargaCreditos';
import CargaCreditosPagination from '@/components/carga-creditos/CargaCreditosPagination';
import { CargueCredito, FiltrosCargueCredito } from '@/types/carga-creditos';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { mockCarguesCreditos } from '@/data/mockCargaCreditos';
import { toast } from '@/hooks/use-toast';
import { isDateInRange } from '@/lib/dateUtils';
import { registrarAcceso, registrarExportacion } from '@/services/bitacoraService';

const CargaCreditosIndex = () => {
  const [filtros, setFiltros] = useState<FiltrosCargueCredito>({});
  const [cargues] = useState<CargueCredito[]>(mockCarguesCreditos);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Registrar acceso al módulo
  React.useEffect(() => {
    registrarAcceso('Carga de créditos');
  }, []);

  const carguesFiltrados = useMemo(() => {
    return cargues.filter(cargue => {
      // Filtro por rango de fechas
      if (filtros.fechaInicio || filtros.fechaFin) {
        const fechaCargue = new Date(cargue.fechaCargue).toISOString().split('T')[0];
        if (!isDateInRange(fechaCargue, filtros.fechaInicio || null, filtros.fechaFin || null)) {
          return false;
        }
      }

      // Filtro por nombre de archivo
      if (filtros.nombreArchivo && !cargue.nombreArchivo.toLowerCase().includes(filtros.nombreArchivo.toLowerCase())) {
        return false;
      }

      // Filtro por nombre de usuario
      if (filtros.nombreUsuario && cargue.nombreUsuario !== filtros.nombreUsuario) {
        return false;
      }

      // Filtro por estado
      if (filtros.estado && filtros.estado !== 'todos' && cargue.estado !== filtros.estado) {
        return false;
      }

      // Filtro por zona franca
      if (filtros.zonaFranca && cargue.zonaFranca !== filtros.zonaFranca) {
        return false;
      }

      return true;
    });
  }, [cargues, filtros]);

  // Ordenar por fecha de cargue descendente por defecto
  const carguesOrdenados = useMemo(() => {
    return [...carguesFiltrados].sort((a, b) => 
      new Date(b.fechaCargue).getTime() - new Date(a.fechaCargue).getTime()
    );
  }, [carguesFiltrados]);

  // Calcular paginación
  const totalPages = Math.ceil(carguesOrdenados.length / itemsPerPage);
  
  const carguesPaginados = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return carguesOrdenados.slice(startIndex, endIndex);
  }, [carguesOrdenados, currentPage]);

  const handleFilter = (newFilters: FiltrosCargueCredito) => {
    setFiltros(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
    console.log('Filtros aplicados:', newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCargarArchivo = () => {
    toast({
      title: "Funcionalidad en desarrollo",
      description: "La carga masiva de créditos estará disponible en HU_170",
      variant: "default"
    });
  };

  const handleDescargarPlantilla = () => {
    // Simular descarga de plantilla Excel
    const link = document.createElement('a');
    link.href = '#'; // En implementación real, sería la URL del archivo
    link.download = 'plantilla_carga_creditos.xlsx';
    
    toast({
      title: "Descarga iniciada",
      description: "Se ha iniciado la descarga de la plantilla base de cargue en Excel",
      variant: "default"
    });
    
    console.log('Descargando plantilla Excel...');
  };

  const handleExportPDF = () => {
    registrarExportacion('PDF', 'Carga de créditos', filtros);
    toast({
      title: "Exportando a PDF",
      description: "Se está generando el reporte en formato PDF",
      variant: "default"
    });
  };

  const handleExportExcel = () => {
    registrarExportacion('Excel', 'Carga de créditos', filtros);
    toast({
      title: "Exportando a Excel",
      description: "Se está generando el reporte en formato Excel",
      variant: "default"
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cargue de créditos de pasajeros</h1>
            <p className="text-gray-600">Consulte el historial de cargas de crédito con sus detalles individuales</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleDescargarPlantilla}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar plantilla base de cargue en excel
            </Button>
            <Button
              onClick={handleCargarArchivo}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Cargar archivo
            </Button>
          </div>
        </div>
        
        <CargaCreditosFiltros 
          onFilter={handleFilter}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
        />
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <TablaCargaCreditos cargues={carguesPaginados} />
          </div>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <CargaCreditosPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Información de resultados */}
        <div className="text-sm text-muted-foreground text-center">
          Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, carguesOrdenados.length)} de {carguesOrdenados.length} cargues
        </div>
      </div>
    </Layout>
  );
};

export default CargaCreditosIndex;