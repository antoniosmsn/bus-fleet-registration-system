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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CargueCredito, DetalleCargueCredito } from '@/types/carga-creditos';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { getDetallesCargue } from '@/data/mockCargaCreditos';

interface TablaCargaCreditosProps {
  cargues: CargueCredito[];
  onVerDetalle: (cargue: CargueCredito) => void;
}

const TablaCargaCreditos: React.FC<TablaCargaCreditosProps> = ({ cargues, onVerDetalle }) => {
  const [expandedCargueId, setExpandedCargueId] = useState<string | null>(null);
  const [detallesPagination, setDetallesPagination] = useState<{ [key: string]: number }>({});
  const [detallesItemsPerPage, setDetallesItemsPerPage] = useState<{ [key: string]: number }>({});
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

  const toggleExpand = (cargueId: string) => {
    if (expandedCargueId === cargueId) {
      setExpandedCargueId(null);
    } else {
      setExpandedCargueId(cargueId);
      if (!detallesPagination[cargueId]) {
        setDetallesPagination({ ...detallesPagination, [cargueId]: 1 });
      }
      if (!detallesItemsPerPage[cargueId]) {
        setDetallesItemsPerPage({ ...detallesItemsPerPage, [cargueId]: 10 });
      }
    }
  };

  const getDetallesPaginados = (cargueId: string): DetalleCargueCredito[] => {
    const detalles = getDetallesCargue(cargueId);
    const currentPage = detallesPagination[cargueId] || 1;
    const itemsPerPage = detallesItemsPerPage[cargueId] || 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return detalles.slice(startIndex, endIndex);
  };

  const getTotalPages = (cargueId: string): number => {
    const detalles = getDetallesCargue(cargueId);
    const itemsPerPage = detallesItemsPerPage[cargueId] || 10;
    return Math.ceil(detalles.length / itemsPerPage);
  };

  const changePage = (cargueId: string, newPage: number) => {
    setDetallesPagination({ ...detallesPagination, [cargueId]: newPage });
  };

  const changeItemsPerPage = (cargueId: string, newItemsPerPage: number) => {
    setDetallesItemsPerPage({ ...detallesItemsPerPage, [cargueId]: newItemsPerPage });
    setDetallesPagination({ ...detallesPagination, [cargueId]: 1 });
  };

  const getDetallesConError = (cargueId: string): DetalleCargueCredito[] => {
    const detalles = getDetallesCargue(cargueId);
    return detalles.filter(d => d.estado === 'error');
  };

  return (
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
                    <React.Fragment key={cargue.id}>
                      <TableRow className="hover:bg-muted/50">
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleExpand(cargue.id)}
                          >
                            {expandedCargueId === cargue.id ? (
                              <ChevronUp className="h-4 w-4 mr-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 mr-1" />
                            )}
                            {cargue.estado === 'Procesado con error' ? 'Ver errores' : 'Ver detalle'}
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {/* Fila expandible con detalles */}
                      {expandedCargueId === cargue.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/30 p-0">
                            <div className="p-4 space-y-4">
                              {/* Información del cargue */}
                              <div className="text-sm text-muted-foreground">
                                Fecha: {formatDateTime(cargue.fechaCargue)} | 
                                Usuario: {cargue.nombreUsuario} | 
                                Total registros: {getDetallesCargue(cargue.id).length}
                                {cargue.estado === 'Procesado con error' && (
                                  <span className="ml-2 text-destructive font-medium">
                                    | Errores: {getDetallesConError(cargue.id).length}
                                  </span>
                                )}
                              </div>

                              {/* Alerta para registros con error */}
                              {cargue.estado === 'Procesado con error' && (
                                <Alert variant="destructive">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    Este cargue contiene {getDetallesConError(cargue.id).length} registro(s) con errores. 
                                    Revise los detalles a continuación.
                                  </AlertDescription>
                                </Alert>
                              )}

                              {/* Tabla de detalles */}
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[180px]">Fecha de carga</TableHead>
                                    <TableHead className="w-[120px] text-right">Monto</TableHead>
                                    <TableHead className="w-[200px]">Pasajero</TableHead>
                                    <TableHead className="w-[150px]">Cédula</TableHead>
                                    <TableHead className="w-[200px]">Empresa</TableHead>
                                    {cargue.estado === 'Procesado con error' && (
                                      <>
                                        <TableHead className="w-[100px]">Estado</TableHead>
                                        <TableHead className="w-[250px]">Error</TableHead>
                                      </>
                                    )}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {cargue.estado === 'Procesado con error' 
                                    ? getDetallesConError(cargue.id).map((detalle) => (
                                        <TableRow key={detalle.id} className="bg-destructive/5">
                                          <TableCell className="text-sm">
                                            {formatDateTime(detalle.fechaCargue)}
                                          </TableCell>
                                          <TableCell className="text-right font-medium">
                                            {formatCurrency(detalle.monto)}
                                          </TableCell>
                                          <TableCell>{detalle.nombrePasajero}</TableCell>
                                          <TableCell>{detalle.cedula}</TableCell>
                                          <TableCell className="text-sm">{detalle.empresa}</TableCell>
                                          <TableCell>
                                            <Badge variant="destructive" className="text-xs">
                                              Error
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="text-sm text-destructive">
                                            {detalle.mensajeError || 'Error desconocido'}
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    : getDetallesPaginados(cargue.id).map((detalle) => (
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
                                      ))
                                  }
                                </TableBody>
                              </Table>

                              {/* Paginación para detalles (solo para registros exitosos) */}
                              {cargue.estado !== 'Procesado con error' && getTotalPages(cargue.id) > 1 && (
                                <div className="flex justify-between items-center mt-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Registros por página:</span>
                                    <Select 
                                      value={detallesItemsPerPage[cargue.id]?.toString() || '10'} 
                                      onValueChange={(value) => changeItemsPerPage(cargue.id, Number(value))}
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
                                      onClick={() => changePage(cargue.id, (detallesPagination[cargue.id] || 1) - 1)}
                                      disabled={(detallesPagination[cargue.id] || 1) === 1}
                                    >
                                      Anterior
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                      Página {detallesPagination[cargue.id] || 1} de {getTotalPages(cargue.id)}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => changePage(cargue.id, (detallesPagination[cargue.id] || 1) + 1)}
                                      disabled={(detallesPagination[cargue.id] || 1) === getTotalPages(cargue.id)}
                                    >
                                      Siguiente
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default TablaCargaCreditos;