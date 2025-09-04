import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ServiciosEmpresaFilters from "@/components/servicios-empresa/ServiciosEmpresaFilters";
import ServiciosEmpresaTable from "@/components/servicios-empresa/ServiciosEmpresaTable";
import ServiciosEmpresaPagination from "@/components/servicios-empresa/ServiciosEmpresaPagination";
import SolicitudCambioRutaModal from "@/components/servicios-empresa/SolicitudCambioRutaModal";
import DetallePasajerosModal from "@/components/servicios-empresa/DetallePasajerosModal";
import { FiltrosServicioEmpresa, ServicioEmpresaTransporte, SentidoServicio } from "@/types/servicio-empresa-transporte";
import { mockServiciosEmpresaTransporte } from "@/data/mockServiciosEmpresaTransporte";
import { useToast } from "@/hooks/use-toast";

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Initial filter values - show all data initially, then apply current day
const filtrosIniciales: FiltrosServicioEmpresa = {
  empresaCliente: [],
  empresaTransporte: [],
  fechaInicio: "",
  fechaFin: "",
  horaInicio: "",
  horaFin: "",
  tipoRuta: [],
  sector: [],
  ramal: [],
  sentido: [],
};

export default function ListadoServiciosEmpresa() {
  const [filtros, setFiltros] = useState<FiltrosServicioEmpresa>(filtrosIniciales);
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosServicioEmpresa>(filtrosIniciales);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortField, setSortField] = useState<keyof ServicioEmpresaTransporte>('fechaServicio');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [cambioRutaModalOpen, setCambioRutaModalOpen] = useState(false);
  const [detallePasajerosModalOpen, setDetallePasajerosModalOpen] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioEmpresaTransporte | null>(null);
  
  const { toast } = useToast();

  // Apply 1 month range filter on initial load
  useEffect(() => {
    const fechaHoy = new Date();
    const fechaHace1Mes = new Date();
    fechaHace1Mes.setMonth(fechaHace1Mes.getMonth() - 1);
    
    const filtrosMes = {
      ...filtrosIniciales,
      fechaInicio: fechaHace1Mes.toISOString().split('T')[0],
      fechaFin: fechaHoy.toISOString().split('T')[0],
      horaInicio: "00:00",
      horaFin: "23:59",
    };
    setFiltros(filtrosMes);
    setFiltrosAplicados(filtrosMes);
  }, []);

  // Convert DD/MM/YYYY to YYYY-MM-DD for comparison
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Filter services based on applied filters
  const serviciosFiltrados = useMemo(() => {
    try {
      // Ensure we have valid data
      if (!Array.isArray(mockServiciosEmpresaTransporte)) {
        console.error('mockServiciosEmpresaTransporte is not an array');
        return [];
      }

      const filtered = mockServiciosEmpresaTransporte.filter(servicio => {
        // Empresa cliente filter
        if (filtrosAplicados.empresaCliente?.length > 0) {
          if (!filtrosAplicados.empresaCliente.includes(servicio.cliente)) {
            return false;
          }
        }

        // Empresa transporte filter
        if (filtrosAplicados.empresaTransporte?.length > 0) {
          if (!filtrosAplicados.empresaTransporte.includes(servicio.transportista)) {
            return false;
          }
        }

        // Date range filter
        if (filtrosAplicados.fechaInicio || filtrosAplicados.fechaFin) {
          const servicioDate = parseDate(servicio.fechaServicio);
          
          if (filtrosAplicados.fechaInicio) {
            const fechaInicio = new Date(filtrosAplicados.fechaInicio);
            fechaInicio.setHours(0, 0, 0, 0); // Start of day
            if (servicioDate < fechaInicio) return false;
          }
          
          if (filtrosAplicados.fechaFin) {
            const fechaFin = new Date(filtrosAplicados.fechaFin);
            fechaFin.setHours(23, 59, 59, 999); // End of day
            if (servicioDate > fechaFin) return false;
          }
        }

        // Time range filter
        if (filtrosAplicados.horaInicio || filtrosAplicados.horaFin) {
          const servicioTime = servicio.horaServicio;
          
          if (filtrosAplicados.horaInicio && servicioTime < filtrosAplicados.horaInicio) return false;
          if (filtrosAplicados.horaFin && servicioTime > filtrosAplicados.horaFin) return false;
        }

        // Tipo ruta filter
        if (filtrosAplicados.tipoRuta?.length > 0) {
          if (!filtrosAplicados.tipoRuta.includes(servicio.tipoRuta)) {
            return false;
          }
        }

        // Sector filter
        if (filtrosAplicados.sector?.length > 0) {
          if (!filtrosAplicados.sector.includes(servicio.sector)) {
            return false;
          }
        }

        // Ramal filter
        if (filtrosAplicados.ramal?.length > 0) {
          if (!filtrosAplicados.ramal.includes(servicio.ramal)) {
            return false;
          }
        }

        // Sentido filter
        if (filtrosAplicados.sentido?.length > 0) {
          if (!filtrosAplicados.sentido.includes(servicio.sentido)) {
            return false;
          }
        }

        return true;
      });
      
      return Array.isArray(filtered) ? filtered : [];
    } catch (error) {
      console.error('Error filtering services:', error);
      return [];
    }
  }, [filtrosAplicados]);

  // Sort services
  const serviciosOrdenados = useMemo(() => {
    if (!Array.isArray(serviciosFiltrados)) {
      console.error('serviciosFiltrados is not an array:', serviciosFiltrados);
      return [];
    }

    return [...serviciosFiltrados].sort((a, b) => {
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

      return 0;
    });
  }, [serviciosFiltrados, sortField, sortDirection]);

  // Paginate services
  const totalPages = Math.ceil(serviciosOrdenados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const serviciosPaginados = serviciosOrdenados.slice(startIndex, startIndex + itemsPerPage);

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
    
    // Apply 1 month range filter again after clearing
    setTimeout(() => {
      const fechaHoy = new Date();
      const fechaHace1Mes = new Date();
      fechaHace1Mes.setMonth(fechaHace1Mes.getMonth() - 1);
      
      const filtrosMes = {
        ...filtrosIniciales,
        fechaInicio: fechaHace1Mes.toISOString().split('T')[0],
        fechaFin: fechaHoy.toISOString().split('T')[0],
        horaInicio: "00:00",
        horaFin: "23:59",
      };
      setFiltrosAplicados(filtrosMes);
    }, 100);
  };

  const handleSort = (campo: keyof ServicioEmpresaTransporte) => {
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

  const handleSolicitarCambioRuta = (servicio: ServicioEmpresaTransporte) => {
    setServicioSeleccionado(servicio);
    setCambioRutaModalOpen(true);
  };

  const handleVerDetallePasajeros = (servicio: ServicioEmpresaTransporte) => {
    console.log('Abriendo modal detalle para servicio:', servicio.id);
    setServicioSeleccionado(servicio);
    setDetallePasajerosModalOpen(true);
  };

  const handleConfirmarSolicitud = (solicitud: any) => {
    // In real implementation, this would call an API
    console.log('Solicitud de cambio de ruta:', solicitud);
    
    // Update the service status in the mock data
    const servicioIndex = mockServiciosEmpresaTransporte.findIndex(
      s => s.id === solicitud.servicioId
    );
    if (servicioIndex !== -1) {
      mockServiciosEmpresaTransporte[servicioIndex].estadoSolicitudCambio = 'Pendiente';
    }
  };

  const exportarPDF = () => {
    toast({
      title: "Exportación PDF",
      description: `Se ha exportado el listado de ${serviciosOrdenados.length} servicios a PDF.`,
    });
  };

  const exportarExcel = () => {
    toast({
      title: "Exportación Excel",
      description: `Se ha exportado el listado de ${serviciosOrdenados.length} servicios a Excel.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Servicios por Empresa de Transporte</h1>
          <p className="text-muted-foreground mt-1">
            Listado y filtrado de servicios asignados por empresa de transporte con gestión de cambios de ruta
          </p>
        </div>
        {/* Filtros */}
        <ServiciosEmpresaFilters
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onAplicarFiltros={handleAplicarFiltros}
          onLimpiarFiltros={handleLimpiarFiltros}
          onExportarPDF={exportarPDF}
          onExportarExcel={exportarExcel}
          totalRegistros={serviciosOrdenados.length}
        />

        {/* Tabla */}
        <ServiciosEmpresaTable
          servicios={serviciosPaginados}
          onSolicitarCambioRuta={handleSolicitarCambioRuta}
          onVerDetallePasajeros={handleVerDetallePasajeros}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />

        {/* Paginación */}
        <ServiciosEmpresaPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={serviciosOrdenados.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />

        {/* Modals */}
        <SolicitudCambioRutaModal
          open={cambioRutaModalOpen}
          onOpenChange={setCambioRutaModalOpen}
          servicio={servicioSeleccionado}
          onConfirmarSolicitud={handleConfirmarSolicitud}
        />

        <DetallePasajerosModal
          open={detallePasajerosModalOpen}
          onOpenChange={setDetallePasajerosModalOpen}
          servicio={servicioSeleccionado}
        />
      </div>
    </Layout>
  );
}