
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Servicio {
  id: number;
  empresaTransporte: string;
  tipoUnidad: string;
  turno: string;
  ramal: string;
  tipoRuta: string;
  tarifaPasajero: number;
  tarifaServicio: number;
  empresaCliente: string;
  sentido: string;
  horario: string;
  numeroServicio: string;
  estado: string;
  fechaCreacion: string;
  fechaModificacion: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
}

interface ServiciosTableProps {
  servicios: Servicio[];
  paginaActual: number;
  serviciosPorPagina: number;
  onPaginaChange: (pagina: number) => void;
}

const ServiciosTable: React.FC<ServiciosTableProps> = ({
  servicios,
  paginaActual,
  serviciosPorPagina,
  onPaginaChange
}) => {
  // Mock user permissions - replace with actual user context
  const esAdminZonaFranca = true;
  const esAdminCliente = false;
  const esAdminTransporte = false;

  const indiceInicio = (paginaActual - 1) * serviciosPorPagina;
  const indiceFin = indiceInicio + serviciosPorPagina;
  const serviciosPaginados = servicios.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(servicios.length / serviciosPorPagina);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CR');
  };

  if (servicios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No se encontraron servicios con los filtros aplicados</p>
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
              <TableHead>Tipo de Ruta</TableHead>
              <TableHead>Tarifa Pasajero</TableHead>
              {esAdminZonaFranca && <TableHead>Tarifa Servicio</TableHead>}
              <TableHead>Empresa Cliente</TableHead>
              <TableHead>Sentido</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>Número de Servicio</TableHead>
              <TableHead>Estado</TableHead>
              {esAdminZonaFranca && <TableHead>Fecha Creación</TableHead>}
              {esAdminZonaFranca && <TableHead>Fecha Modificación</TableHead>}
              {esAdminZonaFranca && <TableHead>Usuario Creación</TableHead>}
              {esAdminZonaFranca && <TableHead>Usuario Modificación</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviciosPaginados.map((servicio) => (
              <TableRow key={servicio.id}>
                <TableCell className="font-medium">
                  {servicio.empresaTransporte}
                </TableCell>
                <TableCell>{servicio.tipoUnidad}</TableCell>
                <TableCell>{servicio.turno}</TableCell>
                <TableCell>{servicio.ramal}</TableCell>
                <TableCell>
                  <Badge variant={servicio.tipoRuta === 'Pública' ? 'default' : 'secondary'}>
                    {servicio.tipoRuta}
                  </Badge>
                </TableCell>
                <TableCell>{formatearMoneda(servicio.tarifaPasajero)}</TableCell>
                {esAdminZonaFranca && (
                  <TableCell>{formatearMoneda(servicio.tarifaServicio)}</TableCell>
                )}
                <TableCell>{servicio.empresaCliente}</TableCell>
                <TableCell>
                  <Badge variant={servicio.sentido === 'Ingreso' ? 'default' : 'outline'}>
                    {servicio.sentido}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">{servicio.horario}</TableCell>
                <TableCell className="font-mono">{servicio.numeroServicio}</TableCell>
                <TableCell>
                  <Badge variant={servicio.estado === 'Activo' ? 'default' : 'destructive'}>
                    {servicio.estado}
                  </Badge>
                </TableCell>
                {esAdminZonaFranca && (
                  <TableCell>{formatearFecha(servicio.fechaCreacion)}</TableCell>
                )}
                {esAdminZonaFranca && (
                  <TableCell>{formatearFecha(servicio.fechaModificacion)}</TableCell>
                )}
                {esAdminZonaFranca && (
                  <TableCell className="text-sm">{servicio.usuarioCreacion}</TableCell>
                )}
                {esAdminZonaFranca && (
                  <TableCell className="text-sm">{servicio.usuarioModificacion}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPaginas > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPaginaChange(Math.max(1, paginaActual - 1))}
                className={paginaActual === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
              <PaginationItem key={pagina}>
                <PaginationLink
                  onClick={() => onPaginaChange(pagina)}
                  isActive={pagina === paginaActual}
                  className="cursor-pointer"
                >
                  {pagina}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPaginaChange(Math.min(totalPaginas, paginaActual + 1))}
                className={paginaActual === totalPaginas ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ServiciosTable;
