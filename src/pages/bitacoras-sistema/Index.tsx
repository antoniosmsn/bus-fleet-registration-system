import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import BitacorasSistemaFilters from '@/components/bitacoras-sistema/BitacorasSistemaFilters';
import BitacorasSistemaTable from '@/components/bitacoras-sistema/BitacorasSistemaTable';
import BitacorasSistemaPagination from '@/components/bitacoras-sistema/BitacorasSistemaPagination';
import BitacorasSistemaExport from '@/components/bitacoras-sistema/BitacorasSistemaExport';
import { BitacoraSistema, BitacoraSistemaFilter } from '@/types/bitacora-sistema';
import { mockBitacorasSistema } from '@/data/mockBitacorasSistema';
import { Loader2 } from 'lucide-react';

const BitacorasSistemaIndex: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [bitacorasData, setBitacorasData] = useState<BitacoraSistema[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Initialize filters with today's date range
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const [filtros, setFiltros] = useState<BitacoraSistemaFilter>({
    fechaInicio: startOfDay.toISOString(),
    fechaFin: endOfDay.toISOString(),
    application: 'todos',
    logLevel: 'todos',
    user: '',
    message: '',
    errorCode: '',
    apiErrorMessage: '',
    internalErrorMessage: ''
  });

  // Filter function
  const filterBitacoras = (data: BitacoraSistema[], filtros: BitacoraSistemaFilter): BitacoraSistema[] => {
    return data.filter(bitacora => {
      const fechaBitacora = new Date(bitacora.fechaHora);
      const fechaInicio = new Date(filtros.fechaInicio);
      const fechaFin = new Date(filtros.fechaFin);
      
      // Date range filter (required)
      if (fechaBitacora < fechaInicio || fechaBitacora > fechaFin) {
        return false;
      }

      // Application filter
      if (filtros.application !== 'todos' && bitacora.application !== filtros.application) {
        return false;
      }

      // Log level filter
      if (filtros.logLevel !== 'todos' && bitacora.logLevel !== filtros.logLevel) {
        return false;
      }

      // User filter (partial match)
      if (filtros.user && bitacora.user && 
          !bitacora.user.toLowerCase().includes(filtros.user.toLowerCase())) {
        return false;
      }

      // Message filter (partial match)
      if (filtros.message && bitacora.message && 
          !bitacora.message.toLowerCase().includes(filtros.message.toLowerCase())) {
        return false;
      }

      // Error code filter (exact match)
      if (filtros.errorCode && bitacora.errorCode !== filtros.errorCode) {
        return false;
      }

      // API error message filter (partial match)
      if (filtros.apiErrorMessage && bitacora.apiErrorMessage && 
          !bitacora.apiErrorMessage.toLowerCase().includes(filtros.apiErrorMessage.toLowerCase())) {
        return false;
      }

      // Internal error message filter (partial match)
      if (filtros.internalErrorMessage && bitacora.internalErrorMessage && 
          !bitacora.internalErrorMessage.toLowerCase().includes(filtros.internalErrorMessage.toLowerCase())) {
        return false;
      }

      return true;
    });
  };

  const handleBuscar = () => {
    setLoading(true);
    setHasSearched(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredData = filterBitacoras(mockBitacorasSistema, filtros);
      setBitacorasData(filteredData);
      setCurrentPage(1);
      setLoading(false);
    }, 800);
  };

  const handleLimpiar = () => {
    setBitacorasData([]);
    setCurrentPage(1);
    setHasSearched(false);
  };

  // Paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBitacoras = bitacorasData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(bitacorasData.length / itemsPerPage);

  // Initial search on component mount
  useEffect(() => {
    handleBuscar();
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Bitácoras del Sistema</h1>
              <p className="text-slate-600 mt-1">
                Consulta y gestión de registros de eventos del sistema
              </p>
            </div>
            <div className="flex items-center gap-3">
              <BitacorasSistemaExport 
                bitacoras={bitacorasData} 
                filtros={filtros}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <BitacorasSistemaFilters
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onBuscar={handleBuscar}
            onLimpiar={handleLimpiar}
            loading={loading}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-slate-600">Buscando registros...</span>
            </div>
          ) : hasSearched ? (
            <>
              <BitacorasSistemaTable bitacoras={paginatedBitacoras} />
              {bitacorasData.length > 0 && (
                <BitacorasSistemaPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={bitacorasData.length}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(newItemsPerPage) => {
                    setItemsPerPage(newItemsPerPage);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">Utiliza los filtros anteriores para buscar registros de bitácoras del sistema.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BitacorasSistemaIndex;