import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { SolicitudDevolucionSaldo, FiltrosSolicitudDevolucion } from '@/types/solicitud-devolucion-saldo';
import { mockSolicitudesDevolucionSaldo } from '@/data/mockSolicitudesDevolucionSaldo';

interface SolicitudesDevolucionSaldoTableProps {
  filters?: FiltrosSolicitudDevolucion;
}

export default function SolicitudesDevolucionSaldoTable({ filters }: SolicitudesDevolucionSaldoTableProps) {
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
      case 'aprobada':
        return 'default';
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
        return 'pendiente aprobación';
      case 'aprobada':
        return 'aprobada';
      case 'rechazada':
        return 'rechazada';
      case 'procesada':
        return 'procesada';
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

  const handleSolicitudPago = (solicitud: SolicitudDevolucionSaldo) => {
    console.log('Procesando solicitud de pago para:', solicitud.numeroDevolucion);
    // Aquí se implementaría la lógica para procesar la solicitud de pago
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Devolución</TableHead>
              <TableHead>Cédula pasajero</TableHead>
              <TableHead>Nombre pasajero</TableHead>
              <TableHead>Fecha de solicitud</TableHead>
              <TableHead>Fecha de devolución</TableHead>
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
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
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
                  <TableCell>{solicitud.fechaDevolucion || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={getEstadoBadgeVariant(solicitud.estado)}>
                      {getEstadoText(solicitud.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatMonto(solicitud.monto)}</TableCell>
                  <TableCell className="max-w-xs truncate" title={solicitud.motivoDevolucion}>
                    {solicitud.motivoDevolucion}
                  </TableCell>
                  <TableCell>
                    {solicitud.aprobadores.length > 0 ? solicitud.aprobadores.join(', ') : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSolicitudPago(solicitud)}
                      className="gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Solicitud de pago
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}