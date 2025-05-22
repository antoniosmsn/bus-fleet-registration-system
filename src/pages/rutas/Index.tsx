
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import RutasFilter from '@/components/rutas/RutasFilter';
import RutasTable, { Ruta } from '@/components/rutas/RutasTable';
import RutasPagination from '@/components/rutas/RutasPagination';
import { useToast } from '@/hooks/use-toast';

const RutasIndex = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [filteredRutas, setFilteredRutas] = useState<Ruta[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const itemsPerPage = 10;

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockRutas = [
        {
          id: 1,
          pais: 'Costa Rica',
          provincia: 'San José',
          canton: 'San José',
          distrito: 'El Carmen',
          sector: 'Sector Central',
          ramal: 'Ramal 101',
          tipo: 'privada' as const,
          estado: 'active' as const,
          paradas: 8,
          geocercas: 2
        },
        {
          id: 2,
          pais: 'Costa Rica',
          provincia: 'Heredia',
          canton: 'Heredia',
          distrito: 'Central',
          sector: 'Sector Norte',
          ramal: 'Ramal 205',
          tipo: 'parque' as const,
          estado: 'active' as const,
          paradas: 12,
          geocercas: 1
        },
        {
          id: 3,
          pais: 'Costa Rica',
          provincia: 'Alajuela',
          canton: 'Alajuela',
          distrito: 'Central',
          sector: 'Sector Este',
          ramal: 'Ramal 304',
          tipo: 'especial' as const,
          estado: 'inactive' as const,
          paradas: 5,
          geocercas: 3
        }
      ];

      setRutas(mockRutas);
      setFilteredRutas(mockRutas);
      setTotalPages(Math.ceil(mockRutas.length / itemsPerPage));
      setIsLoading(false);
    }, 500);
  }, []);

  // Handle filtering
  const handleFilter = (filters: any) => {
    setIsLoading(true);
    
    // Filter logic
    const filtered = rutas.filter(ruta => {
      if (filters.pais && ruta.pais !== filters.pais) return false;
      if (filters.provincia && ruta.provincia !== filters.provincia) return false;
      if (filters.canton && ruta.canton !== filters.canton) return false;
      if (filters.distrito && ruta.distrito !== filters.distrito) return false;
      if (filters.sector && ruta.sector !== filters.sector) return false;
      if (filters.ramal && ruta.ramal !== filters.ramal) return false;
      if (filters.tipo && ruta.tipo !== filters.tipo) return false;
      if (filters.estado && ruta.estado !== filters.estado) return false;
      
      return true;
    });
    
    setFilteredRutas(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
    setIsLoading(false);
  };

  // Handle status change
  const handleChangeStatus = (id: number, newStatus: 'active' | 'inactive') => {
    const updatedRutas = rutas.map(ruta => 
      ruta.id === id ? { ...ruta, estado: newStatus } : ruta
    );
    
    setRutas(updatedRutas);
    
    // Update filtered rutas as well
    const updatedFilteredRutas = filteredRutas.map(ruta => 
      ruta.id === id ? { ...ruta, estado: newStatus } : ruta
    );
    
    setFilteredRutas(updatedFilteredRutas);
  };

  // Get current rutas for pagination
  const getCurrentRutas = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRutas.slice(startIndex, endIndex);
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Rutas</h1>
            <p className="text-gray-500">Gestione las rutas del sistema de transporte</p>
          </div>
          <Link to="/rutas/register">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Ruta
            </Button>
          </Link>
        </div>
        
        {/* Filters */}
        <RutasFilter onFilter={handleFilter} />
        
        {/* Table */}
        <div className="bg-white rounded-md shadow">
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Cargando rutas...</p>
            </div>
          ) : (
            <>
              <RutasTable 
                rutas={getCurrentRutas()} 
                onChangeStatus={handleChangeStatus} 
              />
              
              {/* Pagination */}
              {filteredRutas.length > 0 && (
                <RutasPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RutasIndex;
