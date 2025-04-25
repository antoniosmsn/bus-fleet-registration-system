import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BusesFilter from '@/components/buses/BusesFilter';
import BusesTable from '@/components/buses/BusesTable';
import BusesExport from '@/components/buses/BusesExport';
import { Bus, BusFilter } from '@/types/bus';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isDateInRange, isDateCloseToExpiration } from '@/lib/dateUtils';

const BusesIndex = () => {
  // Mock data for demonstration
  const allBuses: Bus[] = [
    { 
      id: 1, 
      plate: 'SJB-1234', 
      busId: 'AB001',
      readerSerial: 'SR1234ABC',
      company: 'Transport Co SA', 
      brand: 'Mercedes Benz', 
      year: 2021, 
      capacity: 52,
      dekraExpirationDate: '2025-06-15',
      insuranceExpirationDate: '2025-07-20',
      ctpExpirationDate: '2025-05-10',
      type: 'autobus', 
      status: 'active',
      approved: true,
      approvalDate: '2024-01-10',
      approvalUser: 'admin@transportesa.com'
    },
    { 
      id: 2, 
      plate: 'SJB-5678', 
      busId: 'AB002',
      readerSerial: 'SR5678DEF',
      company: 'Costa Buses Inc', 
      brand: 'Volvo', 
      year: 2020, 
      capacity: 48,
      dekraExpirationDate: '2025-08-05',
      insuranceExpirationDate: '2025-09-15',
      ctpExpirationDate: '2025-08-20',
      type: 'autobus', 
      status: 'active',
      approved: true,
      approvalDate: '2024-02-15',
      approvalUser: 'admin@costabuses.com'
    },
    { 
      id: 3, 
      plate: 'SJB-9012', 
      busId: 'AB003',
      readerSerial: 'SR9012GHI',
      company: 'Metropolitan Transit', 
      brand: 'Scania', 
      year: 2019, 
      capacity: 60,
      dekraExpirationDate: '2025-04-30',
      insuranceExpirationDate: '2025-05-25',
      ctpExpirationDate: '2025-06-30',
      type: 'autobus', 
      status: 'inactive',
      approved: false,
      approvalDate: null,
      approvalUser: null
    },
    { 
      id: 4, 
      plate: 'SJB-3456', 
      busId: 'AB004',
      readerSerial: 'SR3456JKL',
      company: 'Urban Mobility SA', 
      brand: 'MAN', 
      year: 2022, 
      capacity: 45,
      dekraExpirationDate: '2026-02-28',
      insuranceExpirationDate: '2026-03-15',
      ctpExpirationDate: '2026-01-20',
      type: 'buseta', 
      status: 'active',
      approved: true,
      approvalDate: '2024-03-05',
      approvalUser: 'admin@urbanmobility.com'
    },
    { 
      id: 5, 
      plate: 'SJB-7890', 
      busId: 'AB005',
      readerSerial: 'SR7890MNO',
      company: 'Express Lines', 
      brand: 'Isuzu', 
      year: 2018, 
      capacity: 35,
      dekraExpirationDate: '2025-05-10',
      insuranceExpirationDate: '2025-06-05',
      ctpExpirationDate: '2026-07-15',
      type: 'microbus', 
      status: 'active',
      approved: true,
      approvalDate: '2024-01-22',
      approvalUser: 'admin@expresslines.com'
    },
  ];

  const [buses, setBuses] = useState<Bus[]>(allBuses);
  const [currentFilter, setCurrentFilter] = useState<BusFilter | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expirationMonths, setExpirationMonths] = useState<number | null>(null);
  const [dialogState, setDialogState] = useState<{ 
    isOpen: boolean; 
    type: 'status' | 'approval'; 
    busId: number | null;
  }>({
    isOpen: false,
    type: 'status',
    busId: null
  });
  
  const { toast } = useToast();
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(buses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBuses = buses.slice(startIndex, startIndex + itemsPerPage);
  
  const applyFilters = (filterValues: any) => {
    let filtered = [...allBuses];
    
    if (filterValues.plate) {
      filtered = filtered.filter(bus => 
        bus.plate.toLowerCase().includes(filterValues.plate.toLowerCase())
      );
    }
    
    if (filterValues.busId) {
      filtered = filtered.filter(bus => 
        bus.busId && bus.busId.toLowerCase().includes(filterValues.busId.toLowerCase())
      );
    }
    
    if (filterValues.readerSerial) {
      filtered = filtered.filter(bus => 
        bus.readerSerial && bus.readerSerial.toLowerCase().includes(filterValues.readerSerial.toLowerCase())
      );
    }
    
    if (filterValues.company) {
      filtered = filtered.filter(bus => 
        bus.company.toLowerCase().includes(filterValues.company.toLowerCase())
      );
    }
    
    if (filterValues.brand) {
      filtered = filtered.filter(bus => 
        bus.brand.toLowerCase().includes(filterValues.brand.toLowerCase())
      );
    }
    
    if (filterValues.year) {
      filtered = filtered.filter(bus => 
        bus.year.toString() === filterValues.year.toString()
      );
    }
    
    if (filterValues.capacity) {
      filtered = filtered.filter(bus => 
        bus.capacity && bus.capacity.toString() === filterValues.capacity.toString()
      );
    }
    
    if (filterValues.type && filterValues.type !== 'all') {
      filtered = filtered.filter(bus => bus.type === filterValues.type);
    }
    
    if (filterValues.status && filterValues.status !== 'all') {
      filtered = filtered.filter(bus => bus.status === filterValues.status);
    }
    
    if (filterValues.approval && filterValues.approval !== 'all') {
      const isApproved = filterValues.approval === 'approved';
      filtered = filtered.filter(bus => bus.approved === isApproved);
    }

    // Date range filters
    if (filterValues.vencimientoDekraStart || filterValues.vencimientoDekraEnd) {
      filtered = filtered.filter(bus => 
        isDateInRange(bus.dekraExpirationDate, filterValues.vencimientoDekraStart, filterValues.vencimientoDekraEnd)
      );
    }
    
    if (filterValues.vencimientoPolizaStart || filterValues.vencimientoPolizaEnd) {
      filtered = filtered.filter(bus => 
        isDateInRange(bus.insuranceExpirationDate, filterValues.vencimientoPolizaStart, filterValues.vencimientoPolizaEnd)
      );
    }
    
    if (filterValues.vencimientoCTPStart || filterValues.vencimientoCTPEnd) {
      filtered = filtered.filter(bus => 
        isDateInRange(bus.ctpExpirationDate, filterValues.vencimientoCTPStart, filterValues.vencimientoCTPEnd)
      );
    }
    
    // Expiration months filter
    if (filterValues.expirationMonths && filterValues.expirationMonths !== 'none') {
      setExpirationMonths(parseInt(filterValues.expirationMonths));
      
      // Filter buses with documents expiring within the selected months
      const months = parseInt(filterValues.expirationMonths);
      filtered = filtered.filter(bus => {
        return (
          (bus.dekraExpirationDate && isDateCloseToExpiration(new Date(bus.dekraExpirationDate), months)) ||
          (bus.insuranceExpirationDate && isDateCloseToExpiration(new Date(bus.insuranceExpirationDate), months)) ||
          (bus.ctpExpirationDate && isDateCloseToExpiration(new Date(bus.ctpExpirationDate), months))
        );
      });
    } else {
      setExpirationMonths(null);
    }
    
    setBuses(filtered);
    setCurrentFilter({
      plate: filterValues.plate || undefined,
      busId: filterValues.busId || undefined,
      readerSerial: filterValues.readerSerial || undefined,
      company: filterValues.company || undefined,
      brand: filterValues.brand || undefined,
      year: filterValues.year ? parseInt(filterValues.year) : undefined,
      capacity: filterValues.capacity ? parseInt(filterValues.capacity) : undefined,
      type: filterValues.type !== 'all' ? filterValues.type : undefined,
      status: filterValues.status !== 'all' ? (filterValues.status as 'active' | 'inactive' | '') : '',
      approved: filterValues.approval === 'approved' ? true : 
               filterValues.approval === 'not_approved' ? false : null,
      expirationMonths: filterValues.expirationMonths && filterValues.expirationMonths !== 'none' ? 
                        parseInt(filterValues.expirationMonths) : null,
      dekraExpirationDateRange: {
        start: filterValues.vencimientoDekraStart || null,
        end: filterValues.vencimientoDekraEnd || null
      },
      insuranceExpirationDateRange: {
        start: filterValues.vencimientoPolizaStart || null,
        end: filterValues.vencimientoPolizaEnd || null
      },
      ctpExpirationDateRange: {
        start: filterValues.vencimientoCTPStart || null,
        end: filterValues.vencimientoCTPEnd || null
      }
    });
    setCurrentPage(1);
  };
  
  const handleChangeStatus = (busId: number) => {
    setDialogState({
      isOpen: true,
      type: 'status',
      busId
    });
  };
  
  const handleApprove = (busId: number) => {
    setDialogState({
      isOpen: true,
      type: 'approval',
      busId
    });
  };
  
  const handleConfirmAction = () => {
    if (dialogState.busId === null) return;
    
    if (dialogState.type === 'status') {
      const updatedBuses = buses.map(bus => {
        if (bus.id === dialogState.busId) {
          // Ensure the status is strictly typed as 'active' or 'inactive'
          const newStatus: 'active' | 'inactive' = bus.status === 'active' ? 'inactive' : 'active';
          const statusText = newStatus === 'active' ? 'activado' : 'desactivado';
          
          toast({
            title: "Estado actualizado",
            description: `El autobús ${bus.plate} ha sido ${statusText} correctamente.`
          });
          
          return { ...bus, status: newStatus };
        }
        return bus;
      });
      
      setBuses(updatedBuses);
    } else if (dialogState.type === 'approval') {
      const updatedBuses = buses.map(bus => {
        if (bus.id === dialogState.busId) {
          toast({
            title: "Autobús aprobado",
            description: `El autobús ${bus.plate} ha sido aprobado correctamente.`
          });
          
          return { 
            ...bus, 
            approved: true, 
            approvalDate: new Date().toISOString(),
            approvalUser: 'usuario.actual@sistema.com'
          };
        }
        return bus;
      });
      
      setBuses(updatedBuses);
    }
    
    setDialogState({ isOpen: false, type: 'status', busId: null });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Autobuses</h1>
            <p className="text-gray-600">Administre el registro y estado de su flota de autobuses</p>
          </div>
          <div className="flex items-center gap-4">
            <BusesExport buses={buses} />
            <Link to="/buses/register">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Registrar Nuevo Autobús
              </Button>
            </Link>
          </div>
        </div>
        
        <BusesFilter onFilter={applyFilters} />
        
        <Card>
          <CardHeader>
            <CardTitle>Autobuses Registrados</CardTitle>
            <CardDescription>
              {buses.length} autobuses encontrados
              {currentFilter && Object.values(currentFilter).some(v => v !== undefined && v !== null && v !== '') && " (filtrados)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BusesTable 
              buses={paginatedBuses} 
              expirationMonths={expirationMonths}
              onChangeStatus={handleChangeStatus}
              onApprove={handleApprove}
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

      <Dialog open={dialogState.isOpen} onOpenChange={(isOpen) => !isOpen && setDialogState(prev => ({ ...prev, isOpen: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogState.type === 'status' ? 'Cambiar estado del autobús' : 'Aprobar autobús'}
            </DialogTitle>
            <DialogDescription>
              {dialogState.type === 'status' 
                ? '¿Está seguro que desea cambiar el estado de este autobús? Esta acción afectará su disponibilidad en el sistema.'
                : '¿Está seguro que desea aprobar este autobús? Esta acción certificará que el autobús cumple con todos los requisitos necesarios.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogState(prev => ({ ...prev, isOpen: false }))}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmAction}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusesIndex;
