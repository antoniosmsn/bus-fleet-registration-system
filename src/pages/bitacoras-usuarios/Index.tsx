import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import BitacorasUsuariosFilters from '@/components/bitacoras-usuarios/BitacorasUsuariosFilters';
import BitacorasUsuariosTable from '@/components/bitacoras-usuarios/BitacorasUsuariosTable';
import BitacorasUsuariosPagination from '@/components/bitacoras-usuarios/BitacorasUsuariosPagination';
import BitacorasUsuariosExport from '@/components/bitacoras-usuarios/BitacorasUsuariosExport';
import { BitacoraUsuario, BitacoraUsuarioFilter } from '@/types/bitacora-usuario';
import { mockBitacorasUsuarios } from '@/data/mockBitacorasUsuarios';
import { useToast } from '@/hooks/use-toast';
import { isDateInRange } from '@/lib/dateUtils';

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
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Bitácoras de Acciones de Usuario</h1>
          <div className="flex items-center gap-2">
            <BitacorasUsuariosExport 
              bitacoras={filteredData} 
              filtros={filtros}
            />
          </div>
        </div>

        {/* Filtros */}
        <BitacorasUsuariosFilters
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onBuscar={handleBuscar}
          onLimpiar={handleLimpiar}
        />

        {/* Resultados */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : hasSearched ? (
          <>
            <BitacorasUsuariosTable
              bitacoras={filteredData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
            
            {filteredData.length > 0 && (
              <BitacorasUsuariosPagination
                currentPage={currentPage}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aplique filtros y haga clic en "Buscar" para ver los resultados
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BitacorasUsuariosIndex;