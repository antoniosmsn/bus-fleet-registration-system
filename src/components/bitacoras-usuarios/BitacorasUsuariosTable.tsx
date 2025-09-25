import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BitacoraUsuario } from '@/types/bitacora-usuario';
import { formatDateWithTime } from '@/lib/dateUtils';

interface BitacorasUsuariosTableProps {
  bitacoras: BitacoraUsuario[];
  currentPage: number;
  itemsPerPage: number;
}

const BitacorasUsuariosTable: React.FC<BitacorasUsuariosTableProps> = ({
  bitacoras,
  currentPage,
  itemsPerPage
}) => {
  const getResultadoBadgeVariant = (resultado: string) => {
    switch (resultado) {
      case 'Exitoso':
        return 'default';
      case 'Error':
        return 'destructive';
      case 'Advertencia':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTipoAccionColor = (tipoAccion: string) => {
    switch (tipoAccion) {
      case 'Registro':
        return 'text-green-600';
      case 'Edición':
        return 'text-blue-600';
      case 'Inicio Sesión':
        return 'text-purple-600';
      case 'Consulta':
        return 'text-gray-600';
      case 'Aprobación':
        return 'text-green-700';
      case 'Rechazo':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, bitacoras.length);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Fecha y Hora</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Nombre Completo</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Zona Franca</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead className="w-[120px]">Tipo de Acción</TableHead>
            <TableHead className="w-[100px]">Resultado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bitacoras.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No se encontraron registros con los filtros aplicados
              </TableCell>
            </TableRow>
          ) : (
            bitacoras.slice(startIndex, endIndex).map((bitacora) => (
              <TableRow key={bitacora.id}>
                <TableCell className="font-medium text-sm">
                  {formatDateWithTime(bitacora.fechaHora)}
                </TableCell>
                <TableCell className="text-sm">
                  {bitacora.usuario}
                </TableCell>
                <TableCell className="text-sm">
                  {bitacora.nombreCompleto}
                </TableCell>
                <TableCell className="text-sm">
                  {bitacora.perfil}
                </TableCell>
                <TableCell className="text-sm">
                  {bitacora.zonaFranca}
                </TableCell>
                <TableCell className="text-sm max-w-[200px] truncate" title={bitacora.accion}>
                  {bitacora.accion}
                </TableCell>
                <TableCell>
                  <span className={`text-sm font-medium ${getTipoAccionColor(bitacora.tipoAccion)}`}>
                    {bitacora.tipoAccion}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getResultadoBadgeVariant(bitacora.resultado)} className="text-xs">
                    {bitacora.resultado}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {bitacoras.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/50">
          <div className="text-sm text-muted-foreground">
            {startIndex + 1} - {endIndex} de {bitacoras.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default BitacorasUsuariosTable;