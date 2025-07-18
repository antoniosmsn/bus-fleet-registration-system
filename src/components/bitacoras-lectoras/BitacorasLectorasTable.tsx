import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { BitacoraLectora } from "@/data/mockBitacorasLectoras";
import { BitacorasLectorasFilterData } from "./BitacorasLectorasFilter";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BitacorasLectorasTableProps {
  data: BitacoraLectora[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  filterData: BitacorasLectorasFilterData;
}

export function BitacorasLectorasTable({
  data,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  filterData
}: BitacorasLectorasTableProps) {
  const formatDateTime = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const formatDatos = (datos: string): string => {
    if (filterData.mostrarContenidoCompleto) {
      return datos;
    }
    return datos.length > 100 ? datos.substring(0, 100) + '...' : datos;
  };

  const generateGoogleMapsLink = (lat: number, lng: number): string => {
    return `https://www.google.com/maps/place/${lat},${lng}`;
  };

  const renderCoordinateCell = (coordinate: number, otherCoordinate: number): React.ReactNode => {
    if (coordinate === 0 || coordinate === null || coordinate === undefined) {
      return <TableCell></TableCell>;
    }
    
    const mapsLink = generateGoogleMapsLink(coordinate, otherCoordinate);
    return (
      <TableCell>
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto text-primary hover:text-primary/80"
          onClick={() => window.open(mapsLink, '_blank')}
        >
          {coordinate}
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </TableCell>
    );
  };

  const renderPagination = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {startItem} - {endItem} de {totalItems} registros
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bitácoras de Lectoras</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Empresa de transporte</TableHead>
                <TableHead>Fecha y hora (evento)</TableHead>
                <TableHead>Fecha y hora de descarga</TableHead>
                <TableHead>Placa del autobús</TableHead>
                <TableHead>Id del autobús</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Datos</TableHead>
                <TableHead>Es Hardware</TableHead>
                <TableHead>Lugar</TableHead>
                <TableHead>Latitud</TableHead>
                <TableHead>Longitud</TableHead>
                <TableHead>Evento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((bitacora) => (
                <TableRow key={bitacora.id}>
                  <TableCell>{bitacora.usuario || '-'}</TableCell>
                  <TableCell>{bitacora.empresaTransporte || '-'}</TableCell>
                  <TableCell>{formatDateTime(bitacora.fechaHoraEvento)}</TableCell>
                  <TableCell>{formatDateTime(bitacora.fechaHoraDescarga)}</TableCell>
                  <TableCell>{bitacora.placaAutobus}</TableCell>
                  <TableCell>{bitacora.idAutobus || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{bitacora.modulo}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{bitacora.serial}</TableCell>
                  <TableCell className="max-w-xs truncate" title={bitacora.descripcion}>
                    {bitacora.descripcion}
                  </TableCell>
                  <TableCell className="max-w-md" title={bitacora.datos}>
                    <div className="whitespace-pre-wrap text-xs">
                      {formatDatos(bitacora.datos)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={bitacora.esHardware ? "default" : "outline"}>
                      {bitacora.esHardware ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>{bitacora.lugar}</TableCell>
                  {renderCoordinateCell(bitacora.latitud, bitacora.longitud)}
                  {renderCoordinateCell(bitacora.longitud, bitacora.latitud)}
                  <TableCell>
                    <Badge variant="outline">{bitacora.evento}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {renderPagination()}
      </CardContent>
    </Card>
  );
}