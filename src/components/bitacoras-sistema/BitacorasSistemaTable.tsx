import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BitacoraSistema } from '@/types/bitacora-sistema';
import { formatDateWithTime } from '@/lib/dateUtils';

interface BitacorasSistemaTableProps {
  bitacoras: BitacoraSistema[];
}

const BitacorasSistemaTable: React.FC<BitacorasSistemaTableProps> = ({ bitacoras }) => {
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'Information':
        return 'bg-blue-100 text-blue-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Error':
        return 'bg-red-100 text-red-800';
      case 'Critical':
        return 'bg-red-600 text-white';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const truncateText = (text?: string, maxLength: number = 500) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold text-slate-700 border-r border-slate-200">Fecha y Hora</TableHead>
            <TableHead className="font-semibold text-slate-700 border-r border-slate-200">Aplicación</TableHead>
            <TableHead className="font-semibold text-slate-700 border-r border-slate-200">Nivel</TableHead>
            <TableHead className="font-semibold text-slate-700 border-r border-slate-200">Usuario</TableHead>
            <TableHead className="font-semibold text-slate-700 border-r border-slate-200">Mensaje</TableHead>
            <TableHead className="font-semibold text-slate-700 border-r border-slate-200">Código Error</TableHead>
            <TableHead className="font-semibold text-slate-700 border-r border-slate-200">Error API</TableHead>
            <TableHead className="font-semibold text-slate-700">Error Interno</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bitacoras.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-slate-500 py-8">
                No se encontraron registros que coincidan con los filtros aplicados.
              </TableCell>
            </TableRow>
          ) : (
            bitacoras.map((bitacora) => (
              <TableRow key={bitacora.id} className="hover:bg-slate-50">
                <TableCell className="border-r border-slate-100 font-mono text-sm">
                  {formatDateWithTime(bitacora.fechaHora)}
                </TableCell>
                <TableCell className="border-r border-slate-100 text-sm font-medium">
                  {bitacora.application}
                </TableCell>
                <TableCell className="border-r border-slate-100">
                  <Badge className={`${getLogLevelColor(bitacora.logLevel)} text-xs font-medium`}>
                    {bitacora.logLevel}
                  </Badge>
                </TableCell>
                <TableCell className="border-r border-slate-100 text-sm">
                  {bitacora.user || '-'}
                </TableCell>
                <TableCell className="border-r border-slate-100 text-sm max-w-md">
                  <div className="break-words">
                    {truncateText(bitacora.message, 500)}
                  </div>
                </TableCell>
                <TableCell className="border-r border-slate-100 text-sm font-mono">
                  {bitacora.errorCode || '-'}
                </TableCell>
                <TableCell className="border-r border-slate-100 text-sm max-w-xs">
                  <div className="break-words">
                    {truncateText(bitacora.apiErrorMessage, 200)}
                  </div>
                </TableCell>
                <TableCell className="text-sm max-w-xs">
                  <div className="break-words">
                    {truncateText(bitacora.internalErrorMessage, 200)}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BitacorasSistemaTable;