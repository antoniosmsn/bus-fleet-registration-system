
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ParadasFilter from '@/components/paradas/ParadasFilter';
import ParadasTable from '@/components/paradas/ParadasTable';
import ParadasMap from '@/components/paradas/ParadasMap';
import ParadasExport from '@/components/paradas/ParadasExport';
import ParadasPagination from '@/components/paradas/ParadasPagination';

interface Parada {
  id: string;
  codigo: string;
  nombre: string;
  pais: string;
  provincia: string;
  canton: string;
  distrito: string;
  sector: string;
  estado: string;
  lat: number;
  lng: number;
}

// Mock data
const mockParadas: Parada[] = [
  {
    id: '1',
    codigo: 'PARA-001',
    nombre: 'Terminal Central',
    pais: 'Costa Rica',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Carmen',
    sector: 'Centro',
    estado: 'Activo',
    lat: 9.9347,
    lng: -84.0797
  },
  {
    id: '2',
    codigo: 'PARA-002',
    nombre: 'Parada Norte',
    pais: 'Costa Rica',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Merced',
    sector: 'Norte',
    estado: 'Activo',
    lat: 9.9397,
    lng: -84.0747
  },
  {
    id: '3',
    codigo: 'PARA-003',
    nombre: 'Parada Sur',
    pais: 'Costa Rica',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Hospital',
    sector: 'Sur',
    estado: 'Inactivo',
    lat: 9.9297,
    lng: -84.0847
  }
];

const ParadasIndex = () => {
  const [filteredParadas, setFilteredParadas] = useState<Parada[]>(mockParadas);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredParadas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParadas = filteredParadas.slice(startIndex, startIndex + itemsPerPage);

  const handleFilter = (filters: any) => {
    let filtered = mockParadas;

    if (filters.codigo) {
      filtered = filtered.filter(p => 
        p.codigo.toLowerCase().includes(filters.codigo.toLowerCase())
      );
    }
    if (filters.nombre) {
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(filters.nombre.toLowerCase())
      );
    }
    if (filters.pais) {
      filtered = filtered.filter(p => p.pais === filters.pais);
    }
    if (filters.provincia) {
      filtered = filtered.filter(p => p.provincia === filters.provincia);
    }
    if (filters.canton) {
      filtered = filtered.filter(p => p.canton === filters.canton);
    }
    if (filters.distrito) {
      filtered = filtered.filter(p => p.distrito === filters.distrito);
    }
    if (filters.sector) {
      filtered = filtered.filter(p => p.sector === filters.sector);
    }
    if (filters.estado) {
      filtered = filtered.filter(p => p.estado === filters.estado);
    }

    setFilteredParadas(filtered);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilteredParadas(mockParadas);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="w-full space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Puntos de Parada</h1>
            <p className="text-gray-500">Administración de puntos de parada</p>
          </div>
          <ParadasExport paradas={filteredParadas} />
        </div>

        <ParadasFilter 
          onFilter={handleFilter}
          onClearFilters={handleClearFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ParadasTable paradas={currentParadas} />
            <ParadasPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
          
          <div className="h-[600px]">
            <ParadasMap paradas={filteredParadas} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ParadasIndex;
