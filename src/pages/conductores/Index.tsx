
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
  
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState<ConductorFilterParams>({
    estado: 'Todos'
  });
  const [sortParams, setSortParams] = useState<SortParams>({
    column: null,
    direction: null
  });
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    loadConductores();
  }, [filters, pagination.currentPage, pagination.pageSize, sortParams]);

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      currentPage: page
    });
  };

  const handlePageSizeChange = (size: number) => {
    setPagination({
      ...pagination,
      currentPage: 1,
      pageSize: size
    });
  };

  const handleFilterChange = (newFilters: ConductorFilterParams) => {
    setFilters(newFilters);
    setPagination({
      ...pagination,
      currentPage: 1
    });
  };

  const handleResetFilters = () => {
    setFilters({
      estado: 'Todos'
    });
    setPagination({
      ...pagination,
      currentPage: 1
    });
  };

  const handleSort = (column: keyof Conductor) => {
    setSortParams(prevSort => {
      if (prevSort.column === column) {
        if (prevSort.direction === 'asc') {
          return { column, direction: 'desc' };
        } else if (prevSort.direction === 'desc') {
          return { column: null, direction: null };
        }
      }
      return { column, direction: 'asc' };
    });
  };

  const handleEdit = (conductor: Conductor) => {
    // No longer needed as we now navigate directly from the table component
  };

  const handleViewDocuments = (conductor: Conductor) => {
    toast({
      title: "Función en desarrollo",
      description: `Ver documentos de: ${conductor.nombre} ${conductor.apellidos}`
    });
    // navigate(`/conductores/${conductor.id}/documentos`);
  };

  const handleToggleStatus = (conductor: Conductor) => {
    const newStatus = conductor.estado === 'Activo' ? 'Inactivo' : 'Activo';
    toast({
      title: "Estado actualizado",
      description: `Conductor ${conductor.nombre} ${conductor.apellidos} ahora está ${newStatus}`
    });
    
    setConductores(prevConductores =>
      prevConductores.map(c => {
        if (c.id === conductor.id) {
          return { ...c, estado: newStatus as 'Activo' | 'Inactivo' };
        }
        return c;
      })
    );
  };

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
          <div className="flex items-center gap-2">
            <Button 
              className="mt-4 md:mt-0 flex items-center gap-1"
              onClick={() => navigate('/conductores/register')}
            >
              <Plus className="h-4 w-4" /> Nuevo Conductor
            </Button>
            <ConductoresExport conductores={conductores} />
          </div>
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
        
        <ConductoresTable 
          conductores={conductores}
          sortParams={sortParams}
          onSort={handleSort}
          onEdit={handleEdit}
          onViewDocuments={handleViewDocuments}
          onToggleStatus={handleToggleStatus}
          canChangeCompany={true}
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
