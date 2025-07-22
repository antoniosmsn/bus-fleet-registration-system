import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SolicitudTraslado } from '../../types/solicitud-traslado';
import { mockSolicitudesTraslado } from '../../data/mockSolicitudesTraslado';

interface SolicitudesTrasladoTableProps {
  filters?: any;
}

export function SolicitudesTrasladoTable({ filters }: SolicitudesTrasladoTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Aplicar filtros
  const filteredData = mockSolicitudesTraslado.filter((solicitud) => {
    if (!filters) return true;

    const matchesNombres = !filters.nombres || 
      solicitud.nombres.toLowerCase().includes(filters.nombres.toLowerCase());
    
    const matchesApellidos = !filters.apellidos || 
      solicitud.apellidos.toLowerCase().includes(filters.apellidos.toLowerCase());
    
    const matchesCedula = !filters.cedula || 
      solicitud.cedula.includes(filters.cedula);
    
    const matchesCorreo = !filters.correo || 
      solicitud.correo.toLowerCase().includes(filters.correo.toLowerCase());
    
    const matchesEmpresaOrigen = !filters.empresaOrigen || filters.empresaOrigen === 'todas' ||
      solicitud.empresaOrigen.toLowerCase().includes(filters.empresaOrigen.toLowerCase());
    
    const matchesEmpresaDestino = !filters.empresaDestino || filters.empresaDestino === 'todas' ||
      solicitud.empresaDestino.toLowerCase().includes(filters.empresaDestino.toLowerCase());
    
    const matchesEstado = !filters.estado || filters.estado === 'todos' || 
      solicitud.estado === filters.estado;

    // Filtro por fecha de creación
    let matchesFecha = true;
    if (filters.fechaCreacionInicio && filters.fechaCreacionFin) {
      const fechaSolicitud = new Date(solicitud.fechaCreacion);
      const fechaInicio = new Date(filters.fechaCreacionInicio);
      const fechaFin = new Date(filters.fechaCreacionFin);
      matchesFecha = fechaSolicitud >= fechaInicio && fechaSolicitud <= fechaFin;
    }

    return matchesNombres && matchesApellidos && matchesCedula && matchesCorreo && 
           matchesEmpresaOrigen && matchesEmpresaDestino && matchesEstado && matchesFecha;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'aceptado':
        return 'default';
      case 'activo':
        return 'secondary';
      case 'inactivo':
        return 'outline';
      case 'cancelado':
        return 'destructive';
      case 'rechazado':
        return 'destructive';
      case 'en-solicitud-traslado':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
  };

  const handleAprobar = (id: number) => {
    // TODO: Implementar lógica de aprobación
    console.log('Aprobar solicitud:', id);
  };

  const handleCancelar = (id: number) => {
    // TODO: Implementar lógica de cancelación
    console.log('Cancelar solicitud:', id);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cédula</TableHead>
                <TableHead>Nombres</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Empresa Origen</TableHead>
                <TableHead>Empresa Destino</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Usuario Creador</TableHead>
                <TableHead>Fecha Modificación</TableHead>
                <TableHead>Usuario Modificador</TableHead>
                <TableHead>Comentarios</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((solicitud) => (
                  <TableRow key={solicitud.id}>
                    <TableCell className="font-medium">{solicitud.cedula}</TableCell>
                    <TableCell>{solicitud.nombres}</TableCell>
                    <TableCell>{solicitud.apellidos}</TableCell>
                    <TableCell>{solicitud.correo}</TableCell>
                    <TableCell>{solicitud.empresaOrigen}</TableCell>
                    <TableCell>{solicitud.empresaDestino}</TableCell>
                    <TableCell>{formatDate(solicitud.fechaCreacion)}</TableCell>
                    <TableCell>{solicitud.usuarioCreador}</TableCell>
                    <TableCell>
                      {solicitud.fechaModificacion ? formatDate(solicitud.fechaModificacion) : '-'}
                    </TableCell>
                    <TableCell>{solicitud.usuarioModificador || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={solicitud.comentarios}>
                      {solicitud.comentarios || '-'}
                    </TableCell>
                    <TableCell>
                      {solicitud.estado === 'aceptado' ? (
                        <span className="text-green-600 font-medium">Aprobado</span>
                      ) : solicitud.estado === 'cancelado' || solicitud.estado === 'rechazado' ? (
                        <span className="text-red-600 font-medium">Cancelada</span>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAprobar(solicitud.id)}
                            className="flex items-center gap-1 text-xs px-2 py-1 h-7"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelar(solicitud.id)}
                            className="flex items-center gap-1 text-xs px-2 py-1 h-7"
                          >
                            <XCircle className="h-3 w-3" />
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                    No se encontraron solicitudes con los filtros aplicados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}