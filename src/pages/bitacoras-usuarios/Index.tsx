import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import BitacorasUsuariosFilters from '@/components/bitacoras-usuarios/BitacorasUsuariosFilters';
import BitacorasUsuariosTable from '@/components/bitacoras-usuarios/BitacorasUsuariosTable';
import BitacorasUsuariosPagination from '@/components/bitacoras-usuarios/BitacorasUsuariosPagination';
import BitacorasUsuariosExport from '@/components/bitacoras-usuarios/BitacorasUsuariosExport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BitacoraUsuario, BitacoraUsuarioFilter } from '@/types/bitacora-usuario';
import { mockBitacorasUsuarios } from '@/data/mockBitacorasUsuarios';
import { useToast } from '@/hooks/use-toast';
import { isDateInRange } from '@/lib/dateUtils';
import { Plus, FileText, FileSpreadsheet } from 'lucide-react';

const BitacorasUsuariosIndex: React.FC = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState<BitacoraUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Filtros con valores por defecto (hoy)
  const today = new Date();
  const fechaInicioDefault = today.toISOString().split('T')[0] + 'T00:00:00.000Z';
  const fechaFinDefault = today.toISOString().split('T')[0] + 'T23:59:59.999Z';

  const [filtros, setFiltros] = useState<BitacoraUsuarioFilter>({
    fechaInicio: fechaInicioDefault,
    fechaFin: fechaFinDefault,
    usuario: '',
    tipoAccion: 'todos',
    resultado: 'todos',
    textoDescripcion: ''
  });

  // Función para filtrar bitácoras
  const filterBitacoras = (data: BitacoraUsuario[], filtros: BitacoraUsuarioFilter): BitacoraUsuario[] => {
    return data.filter(bitacora => {
      // Filtro de fecha (obligatorio)
      if (!isDateInRange(bitacora.fechaHora, filtros.fechaInicio, filtros.fechaFin)) {
        return false;
      }

      // Filtro de usuario (búsqueda parcial en usuario y nombre completo)
      if (filtros.usuario) {
        const usuarioLower = filtros.usuario.toLowerCase();
        const matchUsuario = bitacora.usuario.toLowerCase().includes(usuarioLower);
        const matchNombre = bitacora.nombreCompleto.toLowerCase().includes(usuarioLower);
        if (!matchUsuario && !matchNombre) {
          return false;
        }
      }

      // Filtro de tipo de acción
      if (filtros.tipoAccion !== 'todos' && bitacora.tipoAccion !== filtros.tipoAccion) {
        return false;
      }

      // Filtro de resultado
      if (filtros.resultado !== 'todos' && bitacora.resultado !== filtros.resultado) {
        return false;
      }

      // Filtro de texto en descripción
      if (filtros.textoDescripcion && bitacora.descripcion) {
        const textoLower = filtros.textoDescripcion.toLowerCase();
        if (!bitacora.descripcion.toLowerCase().includes(textoLower) &&
            !bitacora.accion.toLowerCase().includes(textoLower)) {
          return false;
        }
      }

      return true;
    });
  };

  // Función para manejar la búsqueda
  const handleBuscar = async () => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const resultados = filterBitacoras(mockBitacorasUsuarios, filtros);
      setFilteredData(resultados);
      setCurrentPage(1); // Resetear a la primera página
      
      toast({
        title: "Búsqueda completada",
        description: `Se encontraron ${resultados.length} registros.`
      });
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al realizar la búsqueda. Por favor, intente nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar filtros
  const handleLimpiar = () => {
    setFilteredData([]);
    setHasSearched(false);
    setCurrentPage(1);
  };

  // Cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Cambio de elementos por página
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Resetear a la primera página
  };

  // Búsqueda inicial con filtros por defecto
  useEffect(() => {
    handleBuscar();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b px-6 py-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-slate-800">Bitácoras de Acciones de Usuario</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const { exportBitacorasUsuarioToPDF } = await import('@/services/exportService');
                    await exportBitacorasUsuarioToPDF(filteredData);
                    toast({
                      title: "Exportación exitosa",
                      description: "El archivo PDF se ha descargado correctamente."
                    });
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Error de exportación",
                      description: "No se pudo generar el archivo PDF."
                    });
                  }
                }}
                className="flex items-center gap-2 text-slate-600 border-slate-300"
                disabled={filteredData.length === 0}
              >
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const { exportBitacorasUsuarioToExcel } = await import('@/services/exportService');
                    await exportBitacorasUsuarioToExcel(filteredData);
                    toast({
                      title: "Exportación exitosa",
                      description: "El archivo Excel se ha descargado correctamente."
                    });
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Error de exportación",
                      description: "No se pudo generar el archivo Excel."
                    });
                  }
                }}
                className="flex items-center gap-2 text-slate-600 border-slate-300"
                disabled={filteredData.length === 0}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
            </div>
          </div>

          {/* Filtros con Tabs */}
          <BitacorasUsuariosFilters
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onBuscar={handleBuscar}
            onLimpiar={handleLimpiar}
            loading={loading}
          />
        </div>

        {/* Contenido */}
        <div className="p-6">
          {loading ? (
            <Card>
              <CardContent className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </CardContent>
            </Card>
          ) : hasSearched ? (
            <>
              <Card>
                <CardContent className="p-0">
                  <BitacorasUsuariosTable
                    bitacoras={filteredData}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                  />
                </CardContent>
              </Card>
              
              {filteredData.length > 0 && (
                <div className="mt-4">
                  <BitacorasUsuariosPagination
                    currentPage={currentPage}
                    totalItems={filteredData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12 text-slate-500">
                Aplique filtros y haga clic en "Buscar" para ver los resultados
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BitacorasUsuariosIndex;