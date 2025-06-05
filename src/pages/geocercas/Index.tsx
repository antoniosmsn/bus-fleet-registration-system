import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import GeocercasFilter from '@/components/geocercas/GeocercasFilter';
import GeocercasTable from '@/components/geocercas/GeocercasTable';
import GeocercasPagination from '@/components/geocercas/GeocercasPagination';
import { toast } from 'sonner';

interface Vertex {
  lat: number;
  lng: number;
}

interface Geocerca {
  id: string;
  nombre: string;
  vertices: Vertex[];
  active: boolean;
}

// Mock data - in real app, this would come from an API
const geocercasMockData: Geocerca[] = [
  {
    id: '1',
    nombre: 'ZONA INDUSTRIAL ESTE',
    vertices: [
      { lat: 9.935, lng: -84.105 },
      { lat: 9.932, lng: -84.100 },
      { lat: 9.930, lng: -84.103 },
    ],
    active: true
  },
  {
    id: '2',
    nombre: 'ZONA COMERCIAL CENTRO',
    vertices: [
      { lat: 9.940, lng: -84.110 },
      { lat: 9.943, lng: -84.115 },
      { lat: 9.945, lng: -84.112 },
      { lat: 9.942, lng: -84.108 },
    ],
    active: true
  },
  {
    id: '3',
    nombre: 'PARQUE LOGÍSTICO NORTE',
    vertices: [
      { lat: 9.948, lng: -84.098 },
      { lat: 9.952, lng: -84.102 },
      { lat: 9.950, lng: -84.105 },
    ],
    active: true
  },
  {
    id: '4',
    nombre: 'SECTOR ADMINISTRATIVO',
    vertices: [
      { lat: 9.938, lng: -84.095 },
      { lat: 9.940, lng: -84.092 },
      { lat: 9.936, lng: -84.090 },
    ],
    active: false
  },
  {
    id: '5',
    nombre: 'ÁREA DE MANUFACTURA',
    vertices: [
      { lat: 9.945, lng: -84.120 },
      { lat: 9.948, lng: -84.118 },
      { lat: 9.950, lng: -84.122 },
      { lat: 9.947, lng: -84.125 },
    ],
    active: true
  },
  {
    id: '6',
    nombre: 'TERMINAL DE CARGA',
    vertices: [
      { lat: 9.955, lng: -84.115 },
      { lat: 9.958, lng: -84.112 },
      { lat: 9.960, lng: -84.115 },
      { lat: 9.957, lng: -84.118 },
    ],
    active: false
  },
  {
    id: '7',
    nombre: 'ALMACENES ZONA SUR',
    vertices: [
      { lat: 9.930, lng: -84.115 },
      { lat: 9.933, lng: -84.112 },
      { lat: 9.935, lng: -84.115 },
      { lat: 9.932, lng: -84.118 },
    ],
    active: true
  },
];

const GeocercasIndex = () => {
  const [geocercas, setGeocercas] = useState<Geocerca[]>([]);
  const [filteredGeocercas, setFilteredGeocercas] = useState<Geocerca[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ nombre: '' });
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Simulating API call to load geocercas
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setGeocercas(geocercasMockData);
      setFilteredGeocercas(geocercasMockData);
      setLoading(false);
    }, 500); // Simulate loading delay
  }, []);

  // Apply filters
  const handleFilterChange = (newFilters: { nombre: string }) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
    
    // Filter geocercas based on nombre
    if (newFilters.nombre) {
      const filtered = geocercas.filter(geocerca => 
        geocerca.nombre.toLowerCase().includes(newFilters.nombre.toLowerCase())
      );
      setFilteredGeocercas(filtered);
    } else {
      setFilteredGeocercas(geocercas);
    }
    
    // In a real app, log this action to audit trail
    console.log('Audit: User applied filters', newFilters);
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredGeocercas.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(filteredGeocercas.length / itemsPerPage));
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, log this action to audit trail
    console.log('Audit: User navigated to page', page);
  };

  // Handle selecting a geocerca
  const handleSelectGeocerca = (id: string) => {
    console.log('Geocerca selected:', id);
    // En una app real, aquí se registraría en la bitácora de auditoría
    console.log('Audit: Usuario seleccionó geocerca', id);
  };

  // Handle editing a geocerca
  const handleEditGeocerca = (id: string) => {
    console.log('Edit geocerca:', id);
    navigate(`/geocercas/editar/${id}`);
    // En una app real, aquí se registraría en la bitácora de auditoría
    console.log('Audit: Usuario navegó a editar geocerca', id);
  };

  // Handle toggling a geocerca's active status
  const handleToggleActive = (id: string, active: boolean) => {
    const updatedGeocercas = geocercas.map(g => 
      g.id === id ? { ...g, active } : g
    );
    setGeocercas(updatedGeocercas);
    
    // Update filtered list as well
    const updatedFiltered = filteredGeocercas.map(g => 
      g.id === id ? { ...g, active } : g
    );
    setFilteredGeocercas(updatedFiltered);
    
    // Show toast notification
    toast(active ? 'Geocerca activada' : 'Geocerca desactivada', {
      description: `La geocerca "${updatedGeocercas.find(g => g.id === id)?.nombre}" ha sido ${active ? 'activada' : 'desactivada'}.`,
      duration: 3000,
    });
    
    // En una app real, aquí se registraría en la bitácora de auditoría
    console.log('Audit: Usuario cambió estado de geocerca', id, active ? 'activo' : 'inactivo');
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Geocercas</h1>
          </div>
          <Link to="/geocercas/crear">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Registrar
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <GeocercasFilter onFilterChange={handleFilterChange} />

        {/* Table */}
        <GeocercasTable 
          geocercas={getCurrentPageItems()} 
          loading={loading}
          onSelectGeocerca={handleSelectGeocerca}
          onEditGeocerca={handleEditGeocerca}
          onToggleActive={handleToggleActive}
        />

        {/* Pagination */}
        {!loading && filteredGeocercas.length > 0 && (
          <GeocercasPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Layout>
  );
};

export default GeocercasIndex;
