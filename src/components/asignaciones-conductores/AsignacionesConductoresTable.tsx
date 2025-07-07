import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { AsignacionConductor } from '@/data/mockAsignacionesConductores';

interface AsignacionesConductoresTableProps {
  asignaciones: AsignacionConductor[];
  onEditAsignacion: (id: string) => void;
}

const AsignacionesConductoresTable = ({ asignaciones, onEditAsignacion }: AsignacionesConductoresTableProps) => {
  // Helper functions to format data
  const formatearFecha = (fechaISO: string) => {
    return new Date(fechaISO).toLocaleString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto);
  };

  const getTipoUnidadNombre = (tipo: string) => {
    const tipos: Record<string, string> = {
      'autobus': 'Autobús',
      'buseta': 'Buseta',
      'microbus': 'Microbús'
    };
    return tipos[tipo] || tipo;
  };

  const getTipoRutaNombre = (tipo: string) => {
    const tipos: Record<string, string> = {
      'publica': 'Pública',
      'privada': 'Privada',
      'especial': 'Especial',
      'parque': 'Parque'
    };
    return tipos[tipo] || tipo;
  };

  const formatearFechaOperacion = (fecha: string, horario: string) => {
    const fechaObj = new Date(fecha);
    const fechaFormat = fechaObj.toLocaleDateString('es-CR');
    return `${fechaFormat} ${horario}`;
  };

  if (asignaciones.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No se encontraron asignaciones con los filtros aplicados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa de Transporte</TableHead>
              <TableHead>Tipo de Unidad</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Ramal</TableHead>
              <TableHead>Tipo Ruta</TableHead>
              <TableHead>Tarifa Pasajero</TableHead>
              <TableHead>Tarifa Servicio</TableHead>
              <TableHead>Empresa Cliente</TableHead>
              <TableHead>Sentido</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>N° Servicio</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead>Código Conductor</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead>Fecha Modificación</TableHead>
              <TableHead>Usuario Creación</TableHead>
              <TableHead>Usuario Modificación</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {asignaciones.map((asignacion) => (
              <TableRow key={asignacion.id}>
                <TableCell className="max-w-[180px] truncate">
                  {asignacion.empresaTransporte}
                </TableCell>
                <TableCell>
                  {getTipoUnidadNombre(asignacion.tipoUnidad)}
                </TableCell>
                <TableCell>
                  {asignacion.turno}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {asignacion.ramal}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getTipoRutaNombre(asignacion.tipoRuta)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatearMoneda(asignacion.tarifaPasajero)}
                </TableCell>
                <TableCell className="text-right">
                  {formatearMoneda(asignacion.tarifaServicio)}
                </TableCell>
                <TableCell className="max-w-[180px] truncate">
                  {asignacion.tipoRuta === 'parque' ? '-' : asignacion.empresaCliente}
                </TableCell>
                <TableCell>
                  <Badge variant={asignacion.sentido === 'ingreso' ? 'default' : 'outline'}>
                    {asignacion.sentido === 'ingreso' ? 'Ingreso' : 'Salida'}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">
                  {formatearFechaOperacion(asignacion.fechaOperacion, asignacion.horario)}
                </TableCell>
                <TableCell className="font-medium">
                  {asignacion.numeroServicio}
                </TableCell>
                <TableCell>
                  {asignacion.conductorNombre && asignacion.conductorApellidos ? 
                    `${asignacion.conductorNombre} ${asignacion.conductorApellidos}` : 
                    <span className="text-red-600 font-medium">Sin asignar</span>
                  }
                </TableCell>
                <TableCell>
                  {asignacion.codigoConductor || 
                    <span className="text-muted-foreground">-</span>
                  }
                </TableCell>
                <TableCell className="text-sm">
                  {formatearFecha(asignacion.fechaCreacion)}
                </TableCell>
                <TableCell className="text-sm">
                  {asignacion.fechaModificacion ? 
                    formatearFecha(asignacion.fechaModificacion) : '-'
                  }
                </TableCell>
                <TableCell className="max-w-[150px] truncate text-sm">
                  {asignacion.usuarioCreacion}
                </TableCell>
                <TableCell className="max-w-[150px] truncate text-sm">
                  {asignacion.usuarioModificacion || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AsignacionesConductoresTable;