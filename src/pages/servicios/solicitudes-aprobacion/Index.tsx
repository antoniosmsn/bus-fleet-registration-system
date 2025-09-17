import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SolicitudesAprobacionFilters } from '@/components/servicios/solicitudes-aprobacion/SolicitudesAprobacionFilters';
import { SolicitudesAprobacionTable } from '@/components/servicios/solicitudes-aprobacion/SolicitudesAprobacionTable';
import { ModalAprobacionSolicitud } from '@/components/servicios/solicitudes-aprobacion/ModalAprobacionSolicitud';
import SolicitudesAprobacionPagination from '@/components/servicios/solicitudes-aprobacion/SolicitudesAprobacionPagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SolicitudAprobacion, FiltrosSolicitudAprobacion } from '@/types/solicitud-aprobacion';
import { getAllSolicitudes } from '@/data/mockSolicitudesAprobacion';
import { isDateInRange } from '@/lib/dateUtils';
import { registrarAcceso } from '@/services/bitacoraService';

export default function SolicitudesAprobacionIndex() {
  const [solicitudes] = useState<SolicitudAprobacion[]>(getAllSolicitudes());
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const [filtros, setFiltros] = useState<FiltrosSolicitudAprobacion>({
    numeroServicio: '',
    empresaTransporte: 'all',
    fechaInicio: getCurrentDate(),
    fechaFin: getCurrentDate(),
    horaInicio: '00:00',
    horaFin: '23:59',
    placaAutobus: '',
    idAutobus: '',
    estado: 'todos'
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosSolicitudAprobacion>({
    numeroServicio: '',
    empresaTransporte: 'all',
    fechaInicio: getCurrentDate(),
    fechaFin: getCurrentDate(),
    horaInicio: '00:00',
    horaFin: '23:59',
    placaAutobus: '',
    idAutobus: '',
    estado: 'todos'
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudAprobacion | null>(null);
  const [modalAprobacionAbierto, setModalAprobacionAbierto] = useState(false);

  useEffect(() => {
    registrarAcceso('SOLICITUDES_APROBACION_CAMBIO_RUTA');
  }, []);

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter(solicitud => {
      const cumpleNumeroServicio = !filtrosAplicados.numeroServicio || 
        solicitud.numeroServicio.toLowerCase().includes(filtrosAplicados.numeroServicio.toLowerCase());
      
      const cumpleEmpresa = !filtrosAplicados.empresaTransporte || 
        filtrosAplicados.empresaTransporte === 'all' ||
        solicitud.empresaTransporte.toLowerCase().includes(filtrosAplicados.empresaTransporte.toLowerCase());
      
      const cumpleFecha = isDateInRange(
        solicitud.fechaServicio,
        filtrosAplicados.fechaInicio || null,
        filtrosAplicados.fechaFin || null
      );
      
      const cumplePlaca = !filtrosAplicados.placaAutobus || 
        solicitud.placaAutobus.toLowerCase().includes(filtrosAplicados.placaAutobus.toLowerCase());
      
      const cumpleIdAutobus = !filtrosAplicados.idAutobus || 
        solicitud.idAutobus === filtrosAplicados.idAutobus;

      const cumpleEstado = !filtrosAplicados.estado || 
        filtrosAplicados.estado === 'todos' ||
        solicitud.estado === filtrosAplicados.estado;
      
      return cumpleNumeroServicio && cumpleEmpresa && cumpleFecha && cumplePlaca && cumpleIdAutobus && cumpleEstado;
    });
  }, [solicitudes, filtrosAplicados]);

  const solicitudesPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    return solicitudesFiltradas.slice(inicio, inicio + itemsPorPagina);
  }, [solicitudesFiltradas, paginaActual, itemsPorPagina]);

  const totalPaginas = Math.ceil(solicitudesFiltradas.length / itemsPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtrosAplicados, itemsPorPagina]);

  const aplicarFiltros = () => {
    setFiltrosAplicados(filtros);
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    const filtrosVacios: FiltrosSolicitudAprobacion = {
      numeroServicio: '',
      empresaTransporte: 'all',
      fechaInicio: getCurrentDate(),
      fechaFin: getCurrentDate(),
      horaInicio: '00:00',
      horaFin: '23:59',
      placaAutobus: '',
      idAutobus: '',
      estado: 'todos'
    };
    setFiltros(filtrosVacios);
    setFiltrosAplicados(filtrosVacios);
    setPaginaActual(1);
  };

  const handleSolicitudAprobacion = (solicitud: SolicitudAprobacion) => {
    setSolicitudSeleccionada(solicitud);
    setModalAprobacionAbierto(true);
  };

  const handleAprobacionComplete = () => {
    // En una implementación real, aquí se actualizarían los datos
    // Por ahora, solo cerramos el modal
    setModalAprobacionAbierto(false);
    setSolicitudSeleccionada(null);
  };

  return (
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Solicitudes de Aprobación - Cambios de Ruta</h1>
              <p className="text-muted-foreground">
                Gestione las solicitudes de cambio de ruta pendientes de aprobación
              </p>
            </div>
          </div>

        <SolicitudesAprobacionFilters
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onLimpiarFiltros={limpiarFiltros}
          onAplicarFiltros={aplicarFiltros}
        />

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {solicitudesFiltradas.length} solicitud{solicitudesFiltradas.length !== 1 ? 'es' : ''} encontrada{solicitudesFiltradas.length !== 1 ? 's' : ''}
          </p>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="itemsPorPagina" className="text-sm">Mostrar:</Label>
            <Select
              value={itemsPorPagina.toString()}
              onValueChange={(value) => setItemsPorPagina(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SolicitudesAprobacionTable
          solicitudes={solicitudesPaginadas}
          onSolicitudAprobacion={handleSolicitudAprobacion}
        />

        {totalPaginas > 1 && (
          <div className="flex justify-center">
            <SolicitudesAprobacionPagination
              currentPage={paginaActual}
              totalPages={totalPaginas}
              onPageChange={setPaginaActual}
            />
          </div>
        )}

        <ModalAprobacionSolicitud
          solicitud={solicitudSeleccionada}
          isOpen={modalAprobacionAbierto}
          onClose={() => {
            setModalAprobacionAbierto(false);
            setSolicitudSeleccionada(null);
          }}
          onAprobacionComplete={handleAprobacionComplete}
        />
        </div>
      </Layout>
  );
}