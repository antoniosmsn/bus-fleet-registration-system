
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Conductor, 
  ConductorFilterParams, 
  SortParams 
} from "@/types/conductor";
import { 
  getConductores,
  isDocumentoProximoAVencer 
} from "@/services/conductorService";
import ConductoresFilter from "@/components/conductores/ConductoresFilter";
import ConductoresTable from "@/components/conductores/ConductoresTable";
import ConductoresPagination from "@/components/conductores/ConductoresPagination";
import ConductoresExport from "@/components/conductores/ConductoresExport";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ConductoresIndex = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado para almacenar los conductores
  const [conductores, setConductores] = useState<Conductor[]>([]);
  
  // Estado para la paginación
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  
  // Estado para los filtros
  const [filters, setFilters] = useState<ConductorFilterParams>({
    estado: 'Todos'
  });
  
  // Estado para el ordenamiento
  const [sortParams, setSortParams] = useState<SortParams>({
    column: null,
    direction: null
  });
  
  // Estado para indicar si está cargando
  const [loading, setLoading] = useState<boolean>(false);
  
  // Función para cargar los conductores
  const loadConductores = async () => {
    setLoading(true);
    try {
      const result = await getConductores(
        pagination.currentPage,
        pagination.pageSize,
        filters,
        sortParams
      );
      
      setConductores(result.conductores);
      setPagination({
        ...pagination,
        totalItems: result.pagination.totalItems,
        totalPages: result.pagination.totalPages
      });
    } catch (error) {
      console.error('Error al cargar conductores:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al cargar los conductores."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar conductores cuando cambien los filtros, la paginación o el ordenamiento
  useEffect(() => {
    loadConductores();
  }, [filters, pagination.currentPage, pagination.pageSize, sortParams]);
  
  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      currentPage: page
    });
  };
  
  // Función para cambiar el tamaño de página
  const handlePageSizeChange = (size: number) => {
    setPagination({
      ...pagination,
      currentPage: 1,
      pageSize: size
    });
  };
  
  // Función para manejar los cambios en los filtros
  const handleFilterChange = (newFilters: ConductorFilterParams) => {
    setFilters(newFilters);
    setPagination({
      ...pagination,
      currentPage: 1
    });
  };
  
  // Función para resetear los filtros
  const handleResetFilters = () => {
    setFilters({
      estado: 'Todos'
    });
    setPagination({
      ...pagination,
      currentPage: 1
    });
  };
  
  // Función para manejar el ordenamiento
  const handleSort = (column: keyof Conductor) => {
    setSortParams(prevSort => {
      if (prevSort.column === column) {
        // Si ya estamos ordenando por esta columna, cambiar la dirección
        if (prevSort.direction === 'asc') {
          return { column, direction: 'desc' };
        } else if (prevSort.direction === 'desc') {
          return { column: null, direction: null };
        }
      }
      // Si no, establecer orden ascendente
      return { column, direction: 'asc' };
    });
  };
  
  // Función para manejar la edición de un conductor
  const handleEdit = (conductor: Conductor) => {
    toast({
      title: "Función en desarrollo",
      description: `Editar conductor: ${conductor.nombre} ${conductor.apellidos}`
    });
    // navigate(`/conductores/edit/${conductor.id}`);
  };
  
  // Función para ver documentos de un conductor
  const handleViewDocuments = (conductor: Conductor) => {
    toast({
      title: "Función en desarrollo",
      description: `Ver documentos de: ${conductor.nombre} ${conductor.apellidos}`
    });
    // navigate(`/conductores/${conductor.id}/documentos`);
  };
  
  // Función para cambiar el estado de un conductor
  const handleToggleStatus = (conductor: Conductor) => {
    const newStatus = conductor.estado === 'Activo' ? 'Inactivo' : 'Activo';
    toast({
      title: "Estado actualizado",
      description: `Conductor ${conductor.nombre} ${conductor.apellidos} ahora está ${newStatus}`
    });
    
    // En una aplicación real, actualizaríamos esto en el backend y recargaríamos
    // Por ahora, actualizamos localmente para la demo
    setConductores(prevConductores =>
      prevConductores.map(c => {
        if (c.id === conductor.id) {
          return { ...c, estado: newStatus as 'Activo' | 'Inactivo' };
        }
        return c;
      })
    );
  };
  
  // Calcular si hay conductores con documentos próximos a vencer
  const hayDocumentosPorVencer = conductores.some(
    c => isDocumentoProximoAVencer(c.fechaVencimientoCedula) || 
         isDocumentoProximoAVencer(c.fechaVencimientoLicencia)
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Conductores</h1>
            <p className="text-gray-600">
              Administre la información de los conductores registrados en el sistema
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0 flex items-center gap-1"
            onClick={() => navigate('/conductores/register')}
          >
            <Plus className="h-4 w-4" /> Nuevo Conductor
          </Button>
        </div>
        
        {hayDocumentosPorVencer && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atención</AlertTitle>
            <AlertDescription>
              Hay conductores con documentos próximos a vencer. Revise la columna de fechas de vencimiento.
            </AlertDescription>
          </Alert>
        )}
        
        <ConductoresFilter 
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
        
        <ConductoresExport conductores={conductores} />
        
        <ConductoresTable 
          conductores={conductores}
          sortParams={sortParams}
          onSort={handleSort}
          onEdit={handleEdit}
          onViewDocuments={handleViewDocuments}
          onToggleStatus={handleToggleStatus}
        />
        
        <ConductoresPagination 
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </Layout>
  );
};

export default ConductoresIndex;
