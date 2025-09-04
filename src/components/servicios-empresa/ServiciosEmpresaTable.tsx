import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, RefreshCw, Eye, EyeOff, Users } from "lucide-react";
import { ServicioEmpresaTransporte } from "@/types/servicio-empresa-transporte";
import { verificarPermisoExportacion } from "@/services/permisosService";
import React, { useState } from "react";
import { getDetallePasajerosForService } from "@/data/mockDetallePasajerosMovimientos";
import { verificarPermisoAcceso } from "@/services/permisosService";

interface ServiciosEmpresaTableProps {
  servicios: ServicioEmpresaTransporte[];
  isLoading?: boolean;
  onSolicitarCambioRuta: (servicio: ServicioEmpresaTransporte) => void;
  onSort?: (campo: keyof ServicioEmpresaTransporte) => void;
  sortField?: keyof ServicioEmpresaTransporte;
  sortDirection?: 'asc' | 'desc';
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ServiciosEmpresaTable({
  servicios,
  isLoading = false,
  onSolicitarCambioRuta,
  onSort,
  sortField,
  sortDirection
}: ServiciosEmpresaTableProps) {
  const [filasExpandidas, setFilasExpandidas] = useState<Set<string>>(new Set());
  const puedeVerExceso = verificarPermisoExportacion();
  const puedeVerDatosPersonales = verificarPermisoAcceso();

  const toggleFila = (id: string) => {
    const nuevasFilasExpandidas = new Set(filasExpandidas);
    if (nuevasFilasExpandidas.has(id)) {
      nuevasFilasExpandidas.delete(id);
    } else {
      nuevasFilasExpandidas.add(id);
    }
    setFilasExpandidas(nuevasFilasExpandidas);
  };

  const handleSort = (campo: keyof ServicioEmpresaTransporte) => {
    if (onSort) {
      onSort(campo);
    }
  };

  const getSortIcon = (campo: keyof ServicioEmpresaTransporte) => {
    if (sortField === campo) {
      return (
        <ArrowUpDown 
          className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} 
        />
      );
    }
    return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Cargando servicios...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (servicios.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron servicios</h3>
          <p className="text-muted-foreground text-center">
            No hay servicios que coincidan con los filtros aplicados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listado de Servicios por Empresa de Transporte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('tipoRuta')}
                >
                  <div className="flex items-center">
                    Tipo de Ruta
                    {getSortIcon('tipoRuta')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('transportista')}
                >
                  <div className="flex items-center">
                    Transportista
                    {getSortIcon('transportista')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('sector')}
                >
                  <div className="flex items-center">
                    Sector
                    {getSortIcon('sector')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('ramal')}
                >
                  <div className="flex items-center">
                    Ramal
                    {getSortIcon('ramal')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('fechaServicio')}
                >
                  <div className="flex items-center">
                    Fecha
                    {getSortIcon('fechaServicio')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('horaServicio')}
                >
                  <div className="flex items-center">
                    Hora
                    {getSortIcon('horaServicio')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('cliente')}
                >
                  <div className="flex items-center">
                    Cliente
                    {getSortIcon('cliente')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('placaAutobus')}
                >
                  <div className="flex items-center">
                    Placa
                    {getSortIcon('placaAutobus')}
                  </div>
                </TableHead>
                <TableHead>Sentido</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Llegada</TableHead>
                <TableHead className="text-right">Ocupación</TableHead>
                <TableHead className="text-right">% Ocupación</TableHead>
                <TableHead className="text-right">Ingresos</TableHead>
                {puedeVerExceso && (
                  <TableHead className="text-right">Exceso</TableHead>
                )}
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicios.map((servicio) => (
                <React.Fragment key={servicio.id}>
                  <TableRow>
                    <TableCell className="font-medium">{servicio.tipoRuta}</TableCell>
                    <TableCell>{servicio.transportista}</TableCell>
                    <TableCell>{servicio.sector}</TableCell>
                    <TableCell>{servicio.ramal}</TableCell>
                    <TableCell>{servicio.fechaServicio}</TableCell>
                    <TableCell>{servicio.horaServicio}</TableCell>
                    <TableCell className="max-w-32 truncate" title={servicio.cliente}>
                      {servicio.cliente}
                    </TableCell>
                    <TableCell className="font-mono">{servicio.placaAutobus}</TableCell>
                    <TableCell>
                      <Badge variant={servicio.sentido === 'Ingreso' ? 'default' : 'secondary'}>
                        {servicio.sentido}
                      </Badge>
                    </TableCell>
                    <TableCell>{servicio.horaSalida || 'N/A'}</TableCell>
                    <TableCell>{servicio.horaLlegada || 'N/A'}</TableCell>
                    <TableCell className="text-right">{servicio.ocupacion}</TableCell>
                    <TableCell className="text-right">
                      <div className={`font-medium ${servicio.porcentajeOcupacion > 100 ? 'text-destructive' : ''}`}>
                        {servicio.porcentajeOcupacion}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(servicio.ingresos)}
                    </TableCell>
                    {puedeVerExceso && (
                      <TableCell className="text-right">
                        {servicio.exceso > 0 ? (
                          <span className="font-medium text-destructive">{servicio.exceso}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSolicitarCambioRuta(servicio)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Cambio Ruta
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleFila(servicio.id)}
                        >
                          {filasExpandidas.has(servicio.id) ? (
                            <EyeOff className="h-4 w-4 mr-1" />
                          ) : (
                            <Eye className="h-4 w-4 mr-1" />
                          )}
                          Detalle
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded row for passenger details */}
                  {filasExpandidas.has(servicio.id) && (
                    <TableRow>
                      <TableCell colSpan={puedeVerExceso ? 15 : 14} className="bg-muted/30 p-0">
                        <div className="p-4">
                          <h4 className="font-semibold mb-3 text-sm">
                            Detalle de Movimientos de Pasajeros
                          </h4>
                           <div className="grid gap-3 max-h-96 overflow-y-auto">
                            {getDetallePasajerosForService(servicio.id, servicio).map((movimiento) => (
                              <div key={movimiento.id} className="p-4 bg-background rounded-md border">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-sm">
                                  {/* Personal Info */}
                                  {puedeVerDatosPersonales && (
                                    <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                                      <h5 className="font-semibold text-primary text-xs uppercase tracking-wide">Información Personal</h5>
                                      <div className="space-y-1">
                                        <div>
                                          <span className="text-muted-foreground text-xs">Nombre:</span>
                                          <div className="font-medium text-foreground">{movimiento.nombrePasajero}</div>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground text-xs">Cédula:</span>
                                          <div className="font-mono text-foreground">{movimiento.cedula}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Transaction Info */}
                                  <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                                    <h5 className="font-semibold text-primary text-xs uppercase tracking-wide">Transacción</h5>
                                    <div className="space-y-1">
                                      <div>
                                        <span className="text-muted-foreground text-xs">Tipo de Pago:</span>
                                        <div><Badge variant="outline">{movimiento.tipoPago}</Badge></div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Fecha:</span>
                                        <div className="text-foreground">{movimiento.fechaTransaccion}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Hora:</span>
                                        <div className="text-foreground">{movimiento.horaTransaccion}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Monto:</span>
                                        <div className="font-medium text-foreground">{formatCurrency(movimiento.monto)}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Subsidio:</span>
                                        <div className="text-foreground">{formatCurrency(movimiento.subsidio)}</div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Transport Info */}
                                  <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                                    <h5 className="font-semibold text-primary text-xs uppercase tracking-wide">Transporte</h5>
                                    <div className="space-y-1">
                                      <div>
                                        <span className="text-muted-foreground text-xs">Empresa Transporte:</span>
                                        <div className="text-foreground">{movimiento.empresaTransporte}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Placa Autobús:</span>
                                        <div className="font-mono text-foreground">{movimiento.placaAutobus}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Empresa Cliente:</span>
                                        <div className="text-foreground">{movimiento.empresaCliente}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Sentido:</span>
                                        <div>
                                          <Badge variant={movimiento.sentido === 'Ingreso' ? 'default' : 'secondary'}>
                                            {movimiento.sentido}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Route & Location Info */}
                                  <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                                    <h5 className="font-semibold text-primary text-xs uppercase tracking-wide">Ubicación</h5>
                                    <div className="space-y-1">
                                      <div>
                                        <span className="text-muted-foreground text-xs">Sector:</span>
                                        <div className="text-foreground">{movimiento.sector}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Ramal:</span>
                                        <div className="text-foreground">{movimiento.ramal}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Parada:</span>
                                        <div className="text-foreground">{movimiento.parada}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Coordenadas:</span>
                                        <div className="font-mono text-xs text-muted-foreground">
                                          {movimiento.latitud.toFixed(4)}, {movimiento.longitud.toFixed(4)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Employee Info */}
                                  <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                                    <h5 className="font-semibold text-primary text-xs uppercase tracking-wide">Empleado</h5>
                                    <div className="space-y-1">
                                      <div>
                                        <span className="text-muted-foreground text-xs">N° Empleado:</span>
                                        <div className="font-mono text-foreground">{movimiento.numeroEmpleado}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Tipo Planilla:</span>
                                        <div className="text-foreground">{movimiento.tipoPlanilla}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Viaje:</span>
                                        <div>
                                          <Badge variant={movimiento.viajeAdicional ? "default" : "secondary"}>
                                            {movimiento.viajeAdicional ? "Adicional" : "Regular"}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}