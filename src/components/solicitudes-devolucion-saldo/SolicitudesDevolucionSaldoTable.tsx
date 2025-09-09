import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, Shield, X } from 'lucide-react';
import { SolicitudDevolucionSaldo, FiltrosSolicitudDevolucion } from '@/types/solicitud-devolucion-saldo';
import { mockSolicitudesDevolucionSaldo } from '@/data/mockSolicitudesDevolucionSaldo';
import { verificarPermisoAprobador, verificarPermisoAutorizador, verificarPermisoVisualizacionSolicitud } from '@/services/permisosService';
import ModalVisualizarSolicitud from './ModalVisualizarSolicitud';
import ModalConfirmacionAprobacion from './ModalConfirmacionAprobacion';
import ModalConfirmacionRechazo from './ModalConfirmacionRechazo';

interface SolicitudesDevolucionSaldoTableProps {
  filters?: FiltrosSolicitudDevolucion;
  onSolicitudUpdate?: () => void;
}

export default function SolicitudesDevolucionSaldoTable({ filters, onSolicitudUpdate }: SolicitudesDevolucionSaldoTableProps) {
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudDevolucionSaldo | null>(null);
  const [showVisualizarModal, setShowVisualizarModal] = useState(false);
  const [showAprobacionModal, setShowAprobacionModal] = useState(false);
  const [showRechazoModal, setShowRechazoModal] = useState(false);
  const [tipoAccion, setTipoAccion] = useState<'aprobar' | 'autorizar'>('aprobar');

  const puedeAprobar = verificarPermisoAprobador();
  const puedeAutorizar = verificarPermisoAutorizador();
  const puedeVisualizar = verificarPermisoVisualizacionSolicitud();

  // Filtrar los datos según los filtros aplicados
  const filteredData = mockSolicitudesDevolucionSaldo.filter((solicitud) => {
    if (!filters) return true;

    const matchesEstado = !filters.estadoDevolucion || filters.estadoDevolucion === 'todos' || solicitud.estado === filters.estadoDevolucion;
    const matchesNumero = !filters.numeroDevolucion || 
      solicitud.numeroDevolucion.toLowerCase().includes(filters.numeroDevolucion.toLowerCase());
    const matchesCedula = !filters.cedulaPasajero || 
      solicitud.cedulaPasajero.toLowerCase().includes(filters.cedulaPasajero.toLowerCase());
    const matchesNombre = !filters.nombrePasajero || 
      solicitud.nombrePasajero.toLowerCase().includes(filters.nombrePasajero.toLowerCase());

    return matchesEstado && matchesNumero && matchesCedula && matchesNombre;
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'pendiente_aprobacion':
        return 'secondary';
      case 'aprobada_pendiente_autorizacion':
        return 'default';
      case 'completamente_aprobada':
        return 'outline';
      case 'rechazada':
        return 'destructive';
      case 'procesada':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'pendiente_aprobacion':
        return 'Pendiente Aprobación';
      case 'aprobada_pendiente_autorizacion':
        return 'Pendiente Autorización';
      case 'completamente_aprobada':
        return 'Completamente Aprobada';
      case 'rechazada':
        return 'Rechazada';
      case 'procesada':
        return 'Procesada';
      default:
        return estado;
    }
  };

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(monto);
  };

  const handleVisualizar = (solicitud: SolicitudDevolucionSaldo) => {
    setSelectedSolicitud(solicitud);
    setShowVisualizarModal(true);
  };

  const handleAprobar = (solicitud: SolicitudDevolucionSaldo) => {
    setSelectedSolicitud(solicitud);
    setTipoAccion('aprobar');
    setShowAprobacionModal(true);
  };

  const handleAutorizar = (solicitud: SolicitudDevolucionSaldo) => {
    setSelectedSolicitud(solicitud);
    setTipoAccion('autorizar');
    setShowAprobacionModal(true);
  };

  const handleRechazar = (solicitud: SolicitudDevolucionSaldo) => {
    setSelectedSolicitud(solicitud);
    setShowRechazoModal(true);
  };

  const puedeAprobarSolicitud = (solicitud: SolicitudDevolucionSaldo) => {
    return puedeAprobar && solicitud.estado === 'pendiente_aprobacion';
  };

  const puedeAutorizarSolicitud = (solicitud: SolicitudDevolucionSaldo) => {
    return puedeAutorizar && solicitud.estado === 'aprobada_pendiente_autorizacion';
  };

  const puedeRechazarSolicitud = (solicitud: SolicitudDevolucionSaldo) => {
    return (puedeAprobar || puedeAutorizar) && 
           (solicitud.estado === 'pendiente_aprobacion' || solicitud.estado === 'aprobada_pendiente_autorizacion');
  };

  const getAprobadores = (solicitud: SolicitudDevolucionSaldo) => {
    const aprobadores = [];
    if (solicitud.aprobadoPor) aprobadores.push(`Aprobado: ${solicitud.aprobadoPor}`);
    if (solicitud.autorizadoPor) aprobadores.push(`Autorizado: ${solicitud.autorizadoPor}`);
    if (solicitud.rechazadoPor) aprobadores.push(`Rechazado: ${solicitud.rechazadoPor}`);
    return aprobadores.length > 0 ? aprobadores.join(', ') : '-';
  };

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Devolución</TableHead>
                <TableHead>Cédula pasajero</TableHead>
                <TableHead>Nombre pasajero</TableHead>
                <TableHead>Fecha de solicitud</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Motivo de devolución</TableHead>
                <TableHead>Aprobadores</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No se encontraron solicitudes de devolución
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((solicitud) => (
                  <TableRow key={solicitud.id}>
                    <TableCell>{solicitud.numeroDevolucion}</TableCell>
                    <TableCell>{solicitud.cedulaPasajero}</TableCell>
                    <TableCell>{solicitud.nombrePasajero}</TableCell>
                    <TableCell>{solicitud.fechaSolicitud}</TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadgeVariant(solicitud.estado)}>
                        {getEstadoText(solicitud.estado)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatMonto(solicitud.monto)}</TableCell>
                    <TableCell className="max-w-xs truncate" title={solicitud.motivoDevolucion}>
                      {solicitud.motivoDevolucion}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={getAprobadores(solicitud)}>
                      {getAprobadores(solicitud)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {puedeVisualizar && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVisualizar(solicitud)}
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Visualizar
                          </Button>
                        )}
                        {puedeAprobarSolicitud(solicitud) && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAprobar(solicitud)}
                            className="gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Aprobar
                          </Button>
                        )}
                        {puedeAutorizarSolicitud(solicitud) && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAutorizar(solicitud)}
                            className="gap-1"
                          >
                            <Shield className="h-4 w-4" />
                            Autorizar
                          </Button>
                        )}
                        {puedeRechazarSolicitud(solicitud) && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRechazar(solicitud)}
                            className="gap-1"
                          >
                            <X className="h-4 w-4" />
                            Rechazar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSolicitud && (
        <>
          <ModalVisualizarSolicitud
            open={showVisualizarModal}
            onOpenChange={setShowVisualizarModal}
            solicitud={selectedSolicitud}
          />
          <ModalConfirmacionAprobacion
            open={showAprobacionModal}
            onOpenChange={setShowAprobacionModal}
            solicitud={selectedSolicitud}
            tipoAccion={tipoAccion}
            onConfirm={() => {
              setShowAprobacionModal(false);
              onSolicitudUpdate?.();
            }}
          />
          <ModalConfirmacionRechazo
            open={showRechazoModal}
            onOpenChange={setShowRechazoModal}
            solicitud={selectedSolicitud}
            onConfirm={() => {
              setShowRechazoModal(false);
              onSolicitudUpdate?.();
            }}
          />
        </>
      )}
    </>
  );
}