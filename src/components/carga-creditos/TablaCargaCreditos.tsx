import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CargueCredito, DetalleCargueCredito } from '@/types/carga-creditos';
import { Eye, X } from 'lucide-react';
import { getDetallesCargue } from '@/data/mockCargaCreditos';

interface TablaCargaCreditosProps {
  cargues: CargueCredito[];
}

interface DetalleSeleccionado {
  cargue: CargueCredito;
  detalles: DetalleCargueCredito[];
}

const TablaCargaCreditos: React.FC<TablaCargaCreditosProps> = ({ cargues }) => {
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<DetalleSeleccionado | null>(null);
  const [detallesPagination, setDetallesPagination] = useState(1);
  const [detallesItemsPerPage, setDetallesItemsPerPage] = useState(10);

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

  const getEstadoBadgeColor = (estado: string) => {
    return estado === 'Procesado' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getEstadoDetalleBadgeColor = (estado: string) => {
    return estado === 'exitoso' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const verDetalle = (cargue: CargueCredito) => {
    const detalles = getDetallesCargue(cargue.id);
    setDetalleSeleccionado({ cargue, detalles });
    setDetallesPagination(1);
  };

  const cerrarDetalle = () => {
    setDetalleSeleccionado(null);
  };

  const getDetallesPaginados = (): DetalleCargueCredito[] => {
    if (!detalleSeleccionado) return [];
    const startIndex = (detallesPagination - 1) * detallesItemsPerPage;
    const endIndex = startIndex + detallesItemsPerPage;
    return detalleSeleccionado.detalles.slice(startIndex, endIndex);
  };

  const getTotalPages = (): number => {
    if (!detalleSeleccionado) return 0;
    return Math.ceil(detalleSeleccionado.detalles.length / detallesItemsPerPage);
  };

  const changePage = (newPage: number) => {
    setDetallesPagination(newPage);
  };

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setDetallesItemsPerPage(newItemsPerPage);
    setDetallesPagination(1);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cargues procesados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <ScrollArea className="w-full">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40">Fecha de carga</TableHead>
                    <TableHead className="w-64">Nombre del archivo</TableHead>
                    <TableHead className="w-48">Nombre usuario</TableHead>
                    <TableHead className="w-32">Estado</TableHead>
                    <TableHead className="w-24 text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cargues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No hay cargues que coincidan con los criterios de búsqueda
                      </TableCell>
                    </TableRow>
                  ) : (
                    cargues.map((cargue) => (
                      <TableRow key={cargue.id}>
                        <TableCell className="font-medium">
                          {formatDateTime(cargue.fechaCargue)}
                        </TableCell>
                        <TableCell>{cargue.nombreArchivo}</TableCell>
                        <TableCell>{cargue.nombreUsuario}</TableCell>
                        <TableCell>
                          <Badge className={getEstadoBadgeColor(cargue.estado)}>
                            {cargue.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {cargue.estado !== 'Procesado con error' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => verDetalle(cargue)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Sección de detalle separada */}
      {detalleSeleccionado && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">
                Detalle de cargue - {detalleSeleccionado.cargue.nombreArchivo}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={cerrarDetalle}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Fecha: {formatDateTime(detalleSeleccionado.cargue.fechaCargue)} | 
              Usuario: {detalleSeleccionado.cargue.nombreUsuario} | 
              Total registros: {detalleSeleccionado.detalles.length}
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
      )}
    </div>
  );
};

export default TablaCargaCreditos;