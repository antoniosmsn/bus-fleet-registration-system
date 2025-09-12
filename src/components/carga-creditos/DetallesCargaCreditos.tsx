import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CargueCredito, DetalleCargueCredito } from '@/types/carga-creditos';
import { X } from 'lucide-react';
import { getDetallesCargue } from '@/data/mockCargaCreditos';

interface DetallesCargaCreditosProps {
  cargue: CargueCredito;
  onCerrar: () => void;
}

const DetallesCargaCreditos: React.FC<DetallesCargaCreditosProps> = ({ cargue, onCerrar }) => {
  const [detallesPagination, setDetallesPagination] = useState(1);
  const [detallesItemsPerPage, setDetallesItemsPerPage] = useState(10);
  const detalles = getDetallesCargue(cargue.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC'
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDetallesPaginados = (): DetalleCargueCredito[] => {
    const startIndex = (detallesPagination - 1) * detallesItemsPerPage;
    const endIndex = startIndex + detallesItemsPerPage;
    return detalles.slice(startIndex, endIndex);
  };

  const getTotalPages = (): number => {
    return Math.ceil(detalles.length / detallesItemsPerPage);
  };

  const changePage = (newPage: number) => {
    setDetallesPagination(newPage);
  };

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setDetallesItemsPerPage(newItemsPerPage);
    setDetallesPagination(1);
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">
            Detalle de cargue - {cargue.nombreArchivo}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCerrar}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Fecha: {formatDateTime(cargue.fechaCargue)} | 
          Usuario: {cargue.nombreUsuario} | 
          Total registros: {detalles.length}
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Fecha de carga</TableHead>
                <TableHead className="w-[120px] text-right">Monto</TableHead>
                <TableHead className="w-[200px]">Pasajero</TableHead>
                <TableHead className="w-[150px]">Cédula</TableHead>
                <TableHead className="w-[200px]">Empresa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getDetallesPaginados().map((detalle) => (
                <TableRow key={detalle.id}>
                  <TableCell className="text-sm">
                    {formatDateTime(detalle.fechaCargue)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(detalle.monto)}
                  </TableCell>
                  <TableCell>{detalle.nombrePasajero}</TableCell>
                  <TableCell>{detalle.cedula}</TableCell>
                  <TableCell className="text-sm">{detalle.empresa}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginación para detalles */}
        {getTotalPages() > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Registros por página:</span>
              <Select 
                value={detallesItemsPerPage.toString()} 
                onValueChange={(value) => changeItemsPerPage(Number(value))}
              >
                <SelectTrigger className="h-8 w-16">
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
            
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(detallesPagination - 1)}
                disabled={detallesPagination === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {detallesPagination} de {getTotalPages()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(detallesPagination + 1)}
                disabled={detallesPagination === getTotalPages()}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetallesCargaCreditos;