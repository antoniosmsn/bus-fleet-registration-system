
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AsignacionesFilter from '@/components/asignaciones/AsignacionesFilter';
import AsignacionesTable from '@/components/asignaciones/AsignacionesTable';
import { AsignacionRuta, AsignacionRutaFilter } from '@/types/asignacion-ruta';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from '@/hooks/use-toast';

const AsignacionesIndex = () => {
  const allAsignaciones: AsignacionRuta[] = [
    {
      id: 1,
      ramal: 'Ramal 101',
      tipoRuta: 'privada',
      empresaCliente: 'Zona Franca Los Santos SA',
      empresaTransporte: 'Transport Co SA',
      tipoUnidad: 'autobus',
      pais: 'Costa Rica',
      provincia: 'San José',
      canton: 'San José',
      distrito: 'El Carmen',
      sector: 'Sector Central',
      tarifaVigentePasajero: 850,
      tarifaVigenteServicio: 1200,
      fechaInicioVigencia: '2024-01-15',
      estado: 'activo',
      fechaCreacion: '2024-01-10T08:30:00Z',
      usuarioCreacion: 'admin@transportco.com',
      fechaModificacion: '2024-03-15T14:20:00Z',
      usuarioModificacion: 'supervisor@transportco.com'
    },
    {
      id: 2,
      ramal: 'Ramal 205',
      tipoRuta: 'parque',
      empresaCliente: 'Parque Industrial Cartago',
      empresaTransporte: 'Costa Buses Inc',
      tipoUnidad: 'buseta',
      pais: 'Costa Rica',
      provincia: 'Cartago',
      canton: 'Cartago',
      distrito: 'Oriental',
      sector: 'Sector Norte',
      tarifaVigentePasajero: 650,
      tarifaVigenteServicio: 900,
      fechaInicioVigencia: '2024-02-01',
      estado: 'activo',
      fechaCreacion: '2024-01-25T10:15:00Z',
      usuarioCreacion: 'admin@costabuses.com',
      fechaModificacion: null,
      usuarioModificacion: null
    },
    {
      id: 3,
      ramal: 'Ramal 304',
      tipoRuta: 'especial',
      empresaCliente: 'Zona Franca Metropolitana',
      empresaTransporte: 'Metropolitan Transit',
      tipoUnidad: 'microbus',
      pais: 'Costa Rica',
      provincia: 'Alajuela',
      canton: 'Alajuela',
      distrito: 'Central',
      sector: 'Sector Este',
      tarifaVigentePasajero: 750,
      tarifaVigenteServicio: 1000,
      fechaInicioVigencia: '2024-03-01',
      estado: 'inactivo',
      fechaCreacion: '2024-02-20T16:45:00Z',
      usuarioCreacion: 'admin@metropolitan.com',
      fechaModificacion: '2024-04-10T11:30:00Z',
      usuarioModificacion: 'manager@metropolitan.com'
    },
    {
      id: 4,
      ramal: 'Ramal 412',
      tipoRuta: 'privada',
      empresaCliente: 'Tech Park Heredia SA',
      empresaTransporte: 'Urban Mobility SA',
      tipoUnidad: 'autobus',
      pais: 'Costa Rica',
      provincia: 'Heredia',
      canton: 'Heredia',
      distrito: 'Central',
      sector: 'Sector Tecnológico',
      tarifaVigentePasajero: 950,
      tarifaVigenteServicio: 1350,
      fechaInicioVigencia: '2024-04-15',
      estado: 'activo',
      fechaCreacion: '2024-04-01T09:20:00Z',
      usuarioCreacion: 'admin@urbanmobility.com',
      fechaModificacion: null,
      usuarioModificacion: null
    },
    {
      id: 5,
      ramal: 'Ramal 520',
      tipoRuta: 'parque',
      empresaCliente: 'Zona Franca Puntarenas',
      empresaTransporte: 'Express Lines',
      tipoUnidad: 'buseta',
      pais: 'Costa Rica',
      provincia: 'Puntarenas',
      canton: 'Puntarenas',
      distrito: 'Central',
      sector: 'Sector Portuario',
      tarifaVigentePasajero: 1100,
      tarifaVigenteServicio: 1500,
      fechaInicioVigencia: '2024-05-01',
      estado: 'activo',
      fechaCreacion: '2024-04-20T13:10:00Z',
      usuarioCreacion: 'admin@expresslines.com',
      fechaModificacion: '2024-05-15T17:25:00Z',
      usuarioModificacion: 'coordinator@expresslines.com'
    }
  ];

  const [asignaciones, setAsignaciones] = useState<AsignacionRuta[]>(allAsignaciones);
  const [currentFilter, setCurrentFilter] = useState<AsignacionRutaFilter | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { toast } = useToast();
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(asignaciones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAsignaciones = asignaciones.slice(startIndex, startIndex + itemsPerPage);

  const isDateInRange = (dateString: string | null, startDate: string, endDate: string) => {
    if (!dateString) return false;
    if (!startDate && !endDate) return true;
    
    const date = new Date(dateString);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && end) {
      return date >= start && date <= end;
    } else if (start) {
      return date >= start;
    } else if (end) {
      return date <= end;
    }
    
    return true;
  };
  
  const applyFilters = (filterValues: any) => {
    let filtered = [...allAsignaciones];
    
    if (filterValues.ramal) {
      filtered = filtered.filter(asignacion => 
        asignacion.ramal.toLowerCase().includes(filterValues.ramal.toLowerCase())
      );
    }
    
    if (filterValues.empresaTransporte) {
      filtered = filtered.filter(asignacion => 
        asignacion.empresaTransporte.toLowerCase().includes(filterValues.empresaTransporte.toLowerCase())
      );
    }
    
    if (filterValues.empresaCliente) {
      filtered = filtered.filter(asignacion => 
        asignacion.empresaCliente.toLowerCase().includes(filterValues.empresaCliente.toLowerCase())
      );
    }
    
    if (filterValues.tipoRuta && filterValues.tipoRuta !== 'all') {
      filtered = filtered.filter(asignacion => asignacion.tipoRuta === filterValues.tipoRuta);
    }
    
    if (filterValues.provincia) {
      filtered = filtered.filter(asignacion => 
        asignacion.provincia.toLowerCase().includes(filterValues.provincia.toLowerCase())
      );
    }
    
    if (filterValues.canton) {
      filtered = filtered.filter(asignacion => 
        asignacion.canton.toLowerCase().includes(filterValues.canton.toLowerCase())
      );
    }
    
    if (filterValues.sector) {
      filtered = filtered.filter(asignacion => 
        asignacion.sector.toLowerCase().includes(filterValues.sector.toLowerCase())
      );
    }
    
    if (filterValues.tipoUnidad && filterValues.tipoUnidad !== 'all') {
      filtered = filtered.filter(asignacion => asignacion.tipoUnidad === filterValues.tipoUnidad);
    }
    
    if (filterValues.estado && filterValues.estado !== 'all') {
      filtered = filtered.filter(asignacion => asignacion.estado === filterValues.estado);
    }

    // Date range filter
    if (filterValues.habilitarFiltroFecha && (filterValues.fechaInicioVigenciaStart || filterValues.fechaInicioVigenciaEnd)) {
      filtered = filtered.filter(asignacion => 
        isDateInRange(asignacion.fechaInicioVigencia, filterValues.fechaInicioVigenciaStart, filterValues.fechaInicioVigenciaEnd)
      );
    }
    
    setAsignaciones(filtered);
    setCurrentPage(1);
  };
  
  const handleChangeStatus = (asignacionId: number) => {
    const updatedAsignaciones = asignaciones.map(asignacion => {
      if (asignacion.id === asignacionId) {
        const newStatus: 'activo' | 'inactivo' = asignacion.estado === 'activo' ? 'inactivo' : 'activo';
        const statusText = newStatus === 'activo' ? 'activada' : 'desactivada';
        
        toast({
          title: "Estado actualizado",
          description: `La asignación ${asignacion.ramal} ha sido ${statusText} correctamente.`
        });
        
        return { 
          ...asignacion, 
          estado: newStatus,
          fechaModificacion: new Date().toISOString(),
          usuarioModificacion: 'usuario.actual@sistema.com'
        };
      }
      return asignacion;
    });
    
    setAsignaciones(updatedAsignaciones);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Asignaciones de Rutas</h1>
            <p className="text-gray-600">Gestione las asignaciones de rutas y consulte sus tarifas vigentes</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/asignaciones/register">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Asignación
              </Button>
            </Link>
          </div>
        </div>
        
        <AsignacionesFilter onFilter={applyFilters} />
        
        <Card>
          <CardHeader>
            <CardTitle>Asignaciones Registradas</CardTitle>
            <CardDescription>
              {asignaciones.length} asignaciones encontradas
              {currentFilter && Object.values(currentFilter).some(v => v !== undefined && v !== null && v !== '') && " (filtradas)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AsignacionesTable 
              asignaciones={paginatedAsignaciones} 
              onChangeStatus={handleChangeStatus}
            />
            
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      let pageNumber: number;
                      
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else {
                        if (currentPage <= 3) {
                          pageNumber = i + 1;
                          if (i === 4) pageNumber = totalPages;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                      }
                      
                      const showEllipsis = totalPages > 5 && 
                        ((pageNumber === totalPages && currentPage < totalPages - 2) || 
                         (pageNumber === 1 && currentPage > 3));
                      
                      return (
                        <PaginationItem key={i}>
                          {showEllipsis ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              isActive={pageNumber === currentPage}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AsignacionesIndex;
