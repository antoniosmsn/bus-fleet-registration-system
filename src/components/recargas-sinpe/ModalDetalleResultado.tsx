import { useState, useMemo } from 'react';
import { X, Download, CreditCard, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HistorialArchivoSinpe, DetalleConciliacionSinpe, FiltrosDetalle } from '@/types/recarga-sinpe';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface Props {
  archivo: HistorialArchivoSinpe;
  detalles: DetalleConciliacionSinpe[];
  isOpen: boolean;
  onClose: () => void;
  onCargarCreditos: (detallesConciliados: DetalleConciliacionSinpe[]) => void;
}

const ITEMS_PER_PAGE = 10;

export default function ModalDetalleResultado({ archivo, detalles, isOpen, onClose, onCargarCreditos }: Props) {
  const [filtros, setFiltros] = useState<FiltrosDetalle>({ conciliado: 'Todos' });
  const [paginaActual, setPaginaActual] = useState(1);

  // Filtrar detalles
  const detallesFiltrados = useMemo(() => {
    return detalles.filter(detalle => {
      const coincideCedula = !filtros.cedula || 
        detalle.cedula.includes(filtros.cedula) || 
        detalle.cedula.startsWith(filtros.cedula);
      
      const coincideNombre = !filtros.nombre || 
        detalle.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
      
      const coincideConciliado = filtros.conciliado === 'Todos' ||
        (filtros.conciliado === 'Sí' && detalle.conciliado) ||
        (filtros.conciliado === 'No' && !detalle.conciliado);

      return coincideCedula && coincideNombre && coincideConciliado;
    }).sort((a, b) => {
      if (a.nombre !== b.nombre) {
        return a.nombre.localeCompare(b.nombre);
      }
      return a.cedula.localeCompare(b.cedula);
    });
  }, [detalles, filtros]);

  // Paginación
  const totalPaginas = Math.ceil(detallesFiltrados.length / ITEMS_PER_PAGE);
  const indiceInicio = (paginaActual - 1) * ITEMS_PER_PAGE;
  const detallesPaginados = detallesFiltrados.slice(indiceInicio, indiceInicio + ITEMS_PER_PAGE);

  // Cálculos de totales
  const totales = useMemo(() => {
    const conciliados = detallesFiltrados.filter(d => d.conciliado);
    const noConciliados = detallesFiltrados.filter(d => !d.conciliado);
    const montoConciliado = conciliados.reduce((sum, d) => sum + d.monto, 0);

    return {
      conciliados: conciliados.length,
      noConciliados: noConciliados.length,
      montoConciliado
    };
  }, [detallesFiltrados]);

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC'
    }).format(monto);
  };

  const handleCargarCreditos = () => {
    const detallesConciliados = detalles.filter(d => d.conciliado && !d.estadoCargue);
    onCargarCreditos(detallesConciliados);
  };

  const hayDetallesConciliadosSinCargar = detalles.some(d => d.conciliado && !d.estadoCargue);

  const limpiarFiltros = () => {
    setFiltros({ conciliado: 'Todos' });
    setPaginaActual(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalle del Resultado - {archivo.nombreArchivo}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Información del archivo */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Información del Archivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Usuario:</Label>
                  <div className="font-medium">{archivo.usuario}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Fecha:</Label>
                  <div className="font-medium">{archivo.fecha.toLocaleDateString('es-CR')}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total registros:</Label>
                  <div className="font-medium">{archivo.totalRegistros}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado:</Label>
                  <Badge variant={archivo.estadoConciliacion === 'Éxito' ? 'default' : 'secondary'}>
                    {archivo.estadoConciliacion}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filtros */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Cédula</Label>
                  <Input
                    placeholder="Buscar por cédula..."
                    value={filtros.cedula || ''}
                    onChange={(e) => setFiltros({ ...filtros, cedula: e.target.value || undefined })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    placeholder="Buscar por nombre..."
                    value={filtros.nombre || ''}
                    onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value || undefined })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Conciliado</Label>
                  <Select value={filtros.conciliado} onValueChange={(value: any) => setFiltros({ ...filtros, conciliado: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Sí">Sí</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 flex items-end">
                  <Button variant="outline" onClick={limpiarFiltros} size="sm">
                    Limpiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">{totales.conciliados}</div>
                    <div className="text-sm text-muted-foreground">Conciliados</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold text-red-600">{totales.noConciliados}</div>
                    <div className="text-sm text-muted-foreground">No conciliados</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{formatearMonto(totales.montoConciliado)}</div>
                    <div className="text-sm text-muted-foreground">Monto conciliado</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            <Button 
              onClick={handleCargarCreditos}
              disabled={!hayDetallesConciliadosSinCargar}
              className="gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Cargar créditos de pasajeros
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>

          {/* Tabla de detalles */}
          <div className="flex-1 overflow-hidden">
            <div className="border rounded-lg overflow-auto h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Línea</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Conciliado</TableHead>
                    <TableHead>Estado de Cargue</TableHead>
                    <TableHead>Referencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detallesPaginados.map((detalle) => (
                    <TableRow key={detalle.id}>
                      <TableCell>{detalle.linea}</TableCell>
                      <TableCell className="font-mono">{detalle.cedula}</TableCell>
                      <TableCell className="font-medium">{detalle.nombre}</TableCell>
                      <TableCell className="font-medium">{formatearMonto(detalle.monto)}</TableCell>
                      <TableCell>
                        {detalle.conciliado ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Sí
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {detalle.estadoCargue ? (
                          <Badge variant={detalle.estadoCargue === 'Cargado' ? 'default' : 'secondary'}>
                            {detalle.estadoCargue}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{detalle.referencia}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                    className={paginaActual === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                  <PaginationItem key={pagina}>
                    <PaginationLink
                      onClick={() => setPaginaActual(pagina)}
                      isActive={paginaActual === pagina}
                    >
                      {pagina}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                    className={paginaActual === totalPaginas ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}