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
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { getDetallesCargue } from '@/data/mockCargaCreditos';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TablaCargaCreditosProps {
  cargues: CargueCredito[];
}

const TablaCargaCreditos: React.FC<TablaCargaCreditosProps> = ({ cargues }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [detallesPagination, setDetallesPagination] = useState<{ [key: string]: number }>({});
  const [detallesItemsPerPage, setDetallesItemsPerPage] = useState<{ [key: string]: number }>({});

  const itemsPerPage = 10;

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

  const toggleRowExpansion = (cargueId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(cargueId)) {
      newExpanded.delete(cargueId);
    } else {
      newExpanded.add(cargueId);
      // Inicializar paginación si no existe
      if (!(cargueId in detallesPagination)) {
        setDetallesPagination(prev => ({ ...prev, [cargueId]: 1 }));
      }
      // Inicializar items per page si no existe
      if (!(cargueId in detallesItemsPerPage)) {
        setDetallesItemsPerPage(prev => ({ ...prev, [cargueId]: 10 }));
      }
    }
    setExpandedRows(newExpanded);
  };

  const getDetallesPaginados = (cargueId: string): DetalleCargueCredito[] => {
    const detalles = getDetallesCargue(cargueId);
    const currentPage = detallesPagination[cargueId] || 1;
    const currentItemsPerPage = detallesItemsPerPage[cargueId] || 10;
    const startIndex = (currentPage - 1) * currentItemsPerPage;
    const endIndex = startIndex + currentItemsPerPage;
    return detalles.slice(startIndex, endIndex);
  };

  const getTotalPages = (cargueId: string): number => {
    const detalles = getDetallesCargue(cargueId);
    const currentItemsPerPage = detallesItemsPerPage[cargueId] || 10;
    return Math.ceil(detalles.length / currentItemsPerPage);
  };

  const changePage = (cargueId: string, newPage: number) => {
    setDetallesPagination(prev => ({
      ...prev,
      [cargueId]: newPage
    }));
  };

  const changeItemsPerPage = (cargueId: string, newItemsPerPage: number) => {
    setDetallesItemsPerPage(prev => ({
      ...prev,
      [cargueId]: newItemsPerPage
    }));
    // Reset to first page when changing items per page
    setDetallesPagination(prev => ({
      ...prev,
      [cargueId]: 1
    }));
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
                      <React.Fragment key={cargue.id}>
                        <TableRow>
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
                            <Collapsible
                              open={expandedRows.has(cargue.id)}
                              onOpenChange={() => toggleRowExpansion(cargue.id)}
                            >
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Ver
                                  {expandedRows.has(cargue.id) ? (
                                    <ChevronUp className="h-4 w-4 ml-1" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </Collapsible>
                          </TableCell>
                        </TableRow>
                        
                        {/* Fila expandible con detalles */}
                        <Collapsible
                          open={expandedRows.has(cargue.id)}
                          onOpenChange={() => toggleRowExpansion(cargue.id)}
                        >
                          <CollapsibleContent asChild>
                            <TableRow>
                              <TableCell colSpan={5} className="p-0">
                                <Card className="m-4 border-l-4 border-l-blue-500">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Detalle de cargue</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="overflow-x-auto">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Fecha de carga</TableHead>
                                            <TableHead className="text-right">Monto</TableHead>
                                            <TableHead>Pasajero</TableHead>
                                            <TableHead>Cédula</TableHead>
                                            <TableHead>Empresa</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {getDetallesPaginados(cargue.id).map((detalle) => (
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
                                    {getTotalPages(cargue.id) > 1 && (
                                      <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm text-muted-foreground">Registros por página:</span>
                                          <Select 
                                            value={(detallesItemsPerPage[cargue.id] || 10).toString()} 
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
                                  </CardContent>
                                </Card>
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </Collapsible>
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TablaCargaCreditos;