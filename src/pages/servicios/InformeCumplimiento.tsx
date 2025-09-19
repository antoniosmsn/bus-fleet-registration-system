import React, { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import InformeCumplimientoFilters from '@/components/informe-cumplimiento/InformeCumplimientoFilters';
import InformeCumplimientoCards from '@/components/informe-cumplimiento/InformeCumplimientoCards';
import InformeCumplimientoPagination from '@/components/informe-cumplimiento/InformeCumplimientoPagination';
import { FiltrosInformeCumplimiento, InformeCumplimiento } from '@/types/informe-cumplimiento';
import { mockInformesCumplimiento } from '@/data/mockInformesCumplimiento';
import { useToast } from '@/hooks/use-toast';

// Initial filter values
const filtrosIniciales: FiltrosInformeCumplimiento = {
  fechaInicio: new Date().toISOString().split('T')[0],
  fechaFin: new Date().toISOString().split('T')[0],
  horaInicio: '00:00',
  horaFin: '23:59',
  numeroServicio: '',
  autobus: [],
  ramal: [],
  estadoServicio: [],
  cumplimientoServicio: [],
  empresaCliente: [],
  estadoRevision: [],
  programado: [],
  verSoloPendientes: true
};

export default function InformeCumplimientoPage() {
  const [filtros, setFiltros] = useState<FiltrosInformeCumplimiento>(filtrosIniciales);
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosInformeCumplimiento>(filtrosIniciales);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortField, setSortField] = useState<keyof InformeCumplimiento>('fechaServicio');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const { toast } = useToast();

  // Apply current month filter on initial load
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
      const filtrosMes = {
        ...filtrosIniciales,
        fechaInicio: firstDayOfMonth.toISOString().split('T')[0],
        fechaFin: today.toISOString().split('T')[0],
        verSoloPendientes: true,
      };
    setFiltros(filtrosMes);
    setFiltrosAplicados(filtrosMes);
  }, []);

  // Convert DD/MM/YYYY to Date for comparison
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Filter informes based on applied filters
  const informesFiltrados = useMemo(() => {
    try {
      if (!Array.isArray(mockInformesCumplimiento)) {
        console.error('mockInformesCumplimiento is not an array');
        return [];
      }

      const filtered = mockInformesCumplimiento.filter(informe => {
        // Filter by pendientes only if checked
        if (filtrosAplicados.verSoloPendientes && informe.estadoRevision !== 'Pendiente') {
          return false;
        }
        
        // Número Servicio filter
        if (filtrosAplicados.numeroServicio && !informe.idServicio.toLowerCase().includes(filtrosAplicados.numeroServicio.toLowerCase())) {
          return false;
        }

        // Date range filter
        if (filtrosAplicados.fechaInicio || filtrosAplicados.fechaFin) {
          const informeDate = parseDate(informe.fechaServicio);
          
          if (filtrosAplicados.fechaInicio) {
            const fechaInicio = new Date(filtrosAplicados.fechaInicio);
            fechaInicio.setHours(0, 0, 0, 0);
            if (informeDate < fechaInicio) return false;
          }
          
          if (filtrosAplicados.fechaFin) {
            const fechaFin = new Date(filtrosAplicados.fechaFin);
            fechaFin.setHours(23, 59, 59, 999);
            if (informeDate > fechaFin) return false;
          }
        }

        // Array filters
        if (filtrosAplicados.autobus.length > 0 && !filtrosAplicados.autobus.includes(informe.placa)) return false;
        if (filtrosAplicados.ramal.length > 0 && !filtrosAplicados.ramal.includes(informe.ramal)) return false;
        if (filtrosAplicados.estadoServicio.length > 0 && !filtrosAplicados.estadoServicio.includes(informe.estado)) return false;
        if (filtrosAplicados.cumplimientoServicio.length > 0 && !filtrosAplicados.cumplimientoServicio.includes(informe.cumplimiento)) return false;
        if (filtrosAplicados.empresaCliente.length > 0 && !filtrosAplicados.empresaCliente.includes(informe.empresaCliente)) return false;
        if (filtrosAplicados.estadoRevision.length > 0 && !filtrosAplicados.estadoRevision.includes(informe.estadoRevision)) return false;
        if (filtrosAplicados.programado.length > 0 && !filtrosAplicados.programado.includes(informe.programado)) return false;

        return true;
      });
      
      return Array.isArray(filtered) ? filtered : [];
    } catch (error) {
      console.error('Error filtering informes:', error);
      return [];
    }
  }, [filtrosAplicados]);

  // Sort informes
  const informesOrdenados = useMemo(() => {
    if (!Array.isArray(informesFiltrados)) {
      console.error('informesFiltrados is not an array:', informesFiltrados);
      return [];
    }

    return [...informesFiltrados].sort((a, b) => {
      let valueA: any = a[sortField];
      let valueB: any = b[sortField];

      // Handle date sorting
      if (sortField === 'fechaServicio') {
        valueA = parseDate(valueA);
        valueB = parseDate(valueB);
      }

      // Handle numeric sorting
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      // Handle string sorting
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      // Handle date sorting
      if (valueA instanceof Date && valueB instanceof Date) {
        return sortDirection === 'asc' 
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }

      // Handle boolean sorting
      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        return sortDirection === 'asc' 
          ? (valueA === valueB ? 0 : valueA ? 1 : -1)
          : (valueA === valueB ? 0 : valueA ? -1 : 1);
      }

      return 0;
    });
  }, [informesFiltrados, sortField, sortDirection]);

  // Paginate informes
  const totalPages = Math.ceil(informesOrdenados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const informesPaginados = informesOrdenados.slice(startIndex, startIndex + itemsPerPage);

  // Event handlers
  const handleAplicarFiltros = () => {
    setFiltrosAplicados({ ...filtros });
    setCurrentPage(1);
  };

  const handleLimpiarFiltros = () => {
    const filtrosLimpios = { ...filtrosIniciales };
    setFiltros(filtrosLimpios);
    setFiltrosAplicados(filtrosLimpios);
    setCurrentPage(1);
    
    // Apply current month filter again after clearing
    setTimeout(() => {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const filtrosMes = {
        ...filtrosIniciales,
        fechaInicio: firstDayOfMonth.toISOString().split('T')[0],
        fechaFin: today.toISOString().split('T')[0],
        verSoloPendientes: true,
      };
      setFiltrosAplicados(filtrosMes);
    }, 100);
  };

  const handleSort = (campo: keyof InformeCumplimiento) => {
    if (sortField === campo) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(campo);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleRevisionTransportista = (informe: InformeCumplimiento) => {
    // In real implementation, this would call an API
    const informeIndex = mockInformesCumplimiento.findIndex(i => i.id === informe.id);
    if (informeIndex !== -1) {
      mockInformesCumplimiento[informeIndex].estadoRevision = 'Revisado por Transportista';
    }
    
    toast({
      title: "Revisión Transportista",
      description: `Informe ${informe.noInforme} marcado como revisado por transportista.`,
    });
  };

  const handleRevisionAdministracion = (informe: InformeCumplimiento) => {
    // In real implementation, this would call an API
    const informeIndex = mockInformesCumplimiento.findIndex(i => i.id === informe.id);
    if (informeIndex !== -1) {
      mockInformesCumplimiento[informeIndex].estadoRevision = 'Revisado por Administración';
    }
    
    toast({
      title: "Revisión Administración",
      description: `Informe ${informe.noInforme} marcado como revisado por administración.`,
    });
  };

  const handleRevisionCliente = (informe: InformeCumplimiento) => {
    // In real implementation, this would call an API
    const informeIndex = mockInformesCumplimiento.findIndex(i => i.id === informe.id);
    if (informeIndex !== -1) {
      mockInformesCumplimiento[informeIndex].estadoRevision = 'Completado';
    }
    
    toast({
      title: "Revisión Cliente",
      description: `Informe ${informe.noInforme} completado.`,
    });
  };


  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Informe de Cumplimiento</h1>
        </div>

        {/* Filtros */}
        <InformeCumplimientoFilters
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onAplicarFiltros={handleAplicarFiltros}
          onLimpiarFiltros={handleLimpiarFiltros}
          totalRegistros={informesOrdenados.length}
        />

        {/* Cards */}
        <InformeCumplimientoCards
          informes={informesPaginados}
          onRevisionTransportista={handleRevisionTransportista}
          onRevisionAdministracion={handleRevisionAdministracion}
          onRevisionCliente={handleRevisionCliente}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />

        {/* Paginación */}
        <InformeCumplimientoPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={informesOrdenados.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </Layout>
  );
}