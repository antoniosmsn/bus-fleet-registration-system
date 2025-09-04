import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, FileDown, Search, MapPin, CreditCard, User } from "lucide-react";
import { ServicioEmpresaTransporte, DetallePasajeroMovimiento } from "@/types/servicio-empresa-transporte";
import { getDetallePasajerosForService } from "@/data/mockDetallePasajerosMovimientos";
import { verificarPermisoAcceso } from "@/services/permisosService";
import { useToast } from "@/hooks/use-toast";

interface DetallePasajerosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servicio: ServicioEmpresaTransporte | null;
}

const ITEMS_PER_PAGE = 10;

export default function DetallePasajerosModal({
  open,
  onOpenChange,
  servicio
}: DetallePasajerosModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipoPago, setFilterTipoPago] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const puedeVerDatosPersonales = verificarPermisoAcceso(); // Simulate permission check

  const movimientos = useMemo(() => {
    if (!servicio) return [];
    return getDetallePasajerosForService(servicio.id, servicio);
  }, [servicio]);

  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter(movimiento => {
      const matchesSearch = searchTerm === "" || 
        (puedeVerDatosPersonales && (
          movimiento.nombrePasajero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movimiento.cedula.includes(searchTerm)
        )) ||
        movimiento.numeroEmpleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movimiento.parada.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipoPago = filterTipoPago === "todos" || movimiento.tipoPago === filterTipoPago;

      return matchesSearch && matchesTipoPago;
    });
  }, [movimientos, searchTerm, filterTipoPago, puedeVerDatosPersonales]);

  const totalPages = Math.ceil(movimientosFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const movimientosPaginados = movimientosFiltrados.slice(startIndex, endIndex);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportarDetalle = (formato: 'PDF' | 'Excel') => {
    // Simulate export
    toast({
      title: `Exportación ${formato}`,
      description: `El detalle de movimientos de pasajeros ha sido exportado en formato ${formato}.`,
    });
  };

  const tiposPago = [...new Set(movimientos.map(m => m.tipoPago))];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!servicio) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Detalle de Movimientos de Pasajeros
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Información del Servicio */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Información del Servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Transportista:</span>
                  <p className="font-medium">{servicio.transportista}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Placa:</span>
                  <p className="font-mono font-medium">{servicio.placaAutobus}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ramal:</span>
                  <p className="font-medium">{servicio.ramal}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fecha:</span>
                  <p className="font-medium">{servicio.fechaServicio}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sentido:</span>
                  <Badge variant={servicio.sentido === 'Ingreso' ? 'default' : 'secondary'}>
                    {servicio.sentido}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Movimientos:</span>
                  <p className="font-medium">{movimientos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filtros y Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <div className="relative flex-1 min-w-64">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={puedeVerDatosPersonales ? "Buscar por nombre, cédula, empleado o parada..." : "Buscar por empleado o parada..."}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={filterTipoPago} onValueChange={(value) => {
                setFilterTipoPago(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por tipo de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {tiposPago.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportarDetalle('PDF')}>
                <FileDown className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportarDetalle('Excel')}>
                <FileDown className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>

          {/* Tabla de Movimientos */}
          <div className="flex-1 overflow-hidden">
            <Card className="h-full flex flex-col">
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="overflow-auto h-full">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        {puedeVerDatosPersonales && (
                          <>
                            <TableHead>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                Pasajero
                              </div>
                            </TableHead>
                            <TableHead>Cédula</TableHead>
                          </>
                        )}
                        <TableHead>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4" />
                            Tipo Pago
                          </div>
                        </TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead className="text-right">Subsidio</TableHead>
                        <TableHead>Viaje Adicional</TableHead>
                        <TableHead>N° Empleado</TableHead>
                        <TableHead>Tipo Planilla</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Parada
                          </div>
                        </TableHead>
                        <TableHead>Coordenadas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movimientosPaginados.length === 0 ? (
                        <TableRow>
                          <TableCell 
                            colSpan={puedeVerDatosPersonales ? 11 : 9} 
                            className="text-center py-8 text-muted-foreground"
                          >
                            No se encontraron movimientos que coincidan con los filtros.
                          </TableCell>
                        </TableRow>
                      ) : (
                        movimientosPaginados.map((movimiento) => (
                          <TableRow key={movimiento.id}>
                            {puedeVerDatosPersonales && (
                              <>
                                <TableCell className="font-medium">
                                  {movimiento.nombrePasajero}
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                  {movimiento.cedula}
                                </TableCell>
                              </>
                            )}
                            <TableCell>
                              <Badge variant="outline">
                                {movimiento.tipoPago}
                              </Badge>
                            </TableCell>
                            <TableCell>{movimiento.fechaTransaccion}</TableCell>
                            <TableCell className="font-mono">{movimiento.horaTransaccion}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(movimiento.monto)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(movimiento.subsidio)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={movimiento.viajeAdicional ? "default" : "secondary"}>
                                {movimiento.viajeAdicional ? "Sí" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {movimiento.numeroEmpleado}
                            </TableCell>
                            <TableCell>{movimiento.tipoPlanilla}</TableCell>
                            <TableCell>{movimiento.parada}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {movimiento.latitud.toFixed(4)}, {movimiento.longitud.toFixed(4)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, movimientosFiltrados.length)} de {movimientosFiltrados.length} movimientos
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}