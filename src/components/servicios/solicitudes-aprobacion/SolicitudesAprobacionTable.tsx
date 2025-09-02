import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileCheck } from 'lucide-react';
import { SolicitudAprobacion } from '@/types/solicitud-aprobacion';
import { formatShortDate } from '@/lib/dateUtils';

interface SolicitudesAprobacionTableProps {
  solicitudes: SolicitudAprobacion[];
  onSolicitudAprobacion: (solicitud: SolicitudAprobacion) => void;
}

export function SolicitudesAprobacionTable({
  solicitudes,
  onSolicitudAprobacion
}: SolicitudesAprobacionTableProps) {
  if (solicitudes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No se encontraron solicitudes pendientes de aprobación.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Servicio</TableHead>
                <TableHead>Fecha Servicio</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>ID Autobús</TableHead>
                <TableHead>Empresa Transporte</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitudes.map((solicitud) => (
                <TableRow key={solicitud.id}>
                  <TableCell className="font-medium">
                    {solicitud.numeroServicio}
                  </TableCell>
                  <TableCell>
                    {formatShortDate(solicitud.fechaServicio)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {solicitud.placaAutobus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {solicitud.idAutobus}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {solicitud.empresaTransporte}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        solicitud.estado === 'pendiente' ? 'default' :
                        solicitud.estado === 'aprobada' ? 'default' : 'destructive'
                      }
                    >
                      {solicitud.estado === 'pendiente' ? 'Pendiente' :
                       solicitud.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => onSolicitudAprobacion(solicitud)}
                      className="h-8"
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Aprobar/Rechazar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}