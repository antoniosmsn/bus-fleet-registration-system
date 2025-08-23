import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { BitacoraCambioRutaFilter } from '@/types/bitacora-cambio-ruta';
import { mockBitacoraCambiosRutas, mockPasajerosAfectados } from '@/data/mockBitacoraCambiosRutas';
import { formatShortDate } from '@/lib/dateUtils';

interface BitacoraCambiosRutasTableProps {
  filtros: BitacoraCambioRutaFilter;
}

const BitacoraCambiosRutasTable = ({ filtros }: BitacoraCambiosRutasTableProps) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina] = useState(10);
  const [filasExpandidas, setFilasExpandidas] = useState<Set<string>>(new Set());
  const [ordenamiento, setOrdenamiento] = useState<{
    campo: string;
    direccion: 'asc' | 'desc';
  }>({ campo: 'fechaCambio', direccion: 'desc' });

  // Filter and sort data
  const datosFiltrados = useMemo(() => {
    let datos = mockBitacoraCambiosRutas.filter(bitacora => {
      // Filter by ruta original
      if (filtros.rutaOriginal.length > 0 && !filtros.rutaOriginal.includes(bitacora.rutaOriginal.id)) {
        return false;
      }
      
      // Filter by ruta final
      if (filtros.rutaFinal.length > 0 && !filtros.rutaFinal.includes(bitacora.rutaFinal.id)) {
        return false;
      }
      
      // Filter by usuario
      if (filtros.usuario) {
        const usuario = filtros.usuario.toLowerCase();
        const matchNombre = bitacora.usuario.nombreCompleto.toLowerCase().includes(usuario);
        const matchUsername = bitacora.usuario.username.toLowerCase().includes(usuario);
        if (!matchNombre && !matchUsername) {
          return false;
        }
      }
      
      // Filter by fecha cambio range
      if (filtros.fechaCambioInicio && bitacora.fechaCambio < filtros.fechaCambioInicio) {
        return false;
      }
      if (filtros.fechaCambioFin && bitacora.fechaCambio > filtros.fechaCambioFin) {
        return false;
      }
      
      // Filter by fecha servicio range
      if (filtros.fechaServicioInicio && bitacora.fechaServicio < filtros.fechaServicioInicio) {
        return false;
      }
      if (filtros.fechaServicioFin && bitacora.fechaServicio > filtros.fechaServicioFin) {
        return false;
      }
      
      // Filter by numero servicio
      if (filtros.numeroServicio) {
        const numeroServicio = filtros.numeroServicio.toLowerCase();
        const matchOriginal = bitacora.numeroServicioOriginal.toLowerCase().includes(numeroServicio);
        const matchFinal = bitacora.numeroServicioFinal.toLowerCase().includes(numeroServicio);
        if (!matchOriginal && !matchFinal) {
          return false;
        }
      }
      
      // Filter by empresa transporte
      if (filtros.empresaTransporte.length > 0 && !filtros.empresaTransporte.includes(bitacora.empresaTransporte.id)) {
        return false;
      }
      
      // Filter by autobus
      if (filtros.autobus.length > 0 && !filtros.autobus.includes(bitacora.autobus.id)) {
        return false;
      }
      
      // Filter by estado
      if (filtros.estado.length > 0 && !filtros.estado.includes(bitacora.estado)) {
        return false;
      }
      
      return true;
    });

    // Sort data
    datos.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (ordenamiento.campo) {
        case 'fechaCambio':
          aValue = new Date(a.fechaCambio);
          bValue = new Date(b.fechaCambio);
          break;
        case 'fechaServicio':
          aValue = new Date(a.fechaServicio);
          bValue = new Date(b.fechaServicio);
          break;
        case 'usuario':
          aValue = a.usuario.nombreCompleto;
          bValue = b.usuario.nombreCompleto;
          break;
        case 'estado':
          aValue = a.estado;
          bValue = b.estado;
          break;
        case 'cantidadPasajeros':
          aValue = a.cantidadPasajerosAfectados;
          bValue = b.cantidadPasajerosAfectados;
          break;
        default:
          aValue = a.fechaCambio;
          bValue = b.fechaCambio;
      }
      
      if (aValue < bValue) return ordenamiento.direccion === 'asc' ? -1 : 1;
      if (aValue > bValue) return ordenamiento.direccion === 'asc' ? 1 : -1;
      return 0;
    });

    return datos;
  }, [filtros, ordenamiento]);

  // Pagination
  const totalPaginas = Math.ceil(datosFiltrados.length / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const datosVisiblesToCurrentPage = datosFiltrados.slice(indiceInicio, indiceFin);

  const toggleFila = (id: string) => {
    const nuevasFilasExpandidas = new Set(filasExpandidas);
    if (nuevasFilasExpandidas.has(id)) {
      nuevasFilasExpandidas.delete(id);
    } else {
      nuevasFilasExpandidas.add(id);
    }
    setFilasExpandidas(nuevasFilasExpandidas);
  };

  const cambiarOrdenamiento = (campo: string) => {
    setOrdenamiento(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(amount);
  };

  const getEstadoBadge = (estado: string) => {
    return estado === 'Aceptada' ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        Aceptada
      </Badge>
    ) : (
      <Badge variant="destructive">
        Rechazada
      </Badge>
    );
  };

  const HeaderSortable = ({ campo, children }: { campo: string; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => cambiarOrdenamiento(campo)}
    >
      <div className="flex items-center gap-1">
        {children}
        {ordenamiento.campo === campo && (
          ordenamiento.direccion === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Bitácora de Cambios de Rutas</span>
          <Badge variant="outline">
            {datosFiltrados.length} registro{datosFiltrados.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ruta Original</TableHead>
                <TableHead>Ruta Final</TableHead>
                <TableHead>Servicio Original</TableHead>
                <TableHead>Servicio Final</TableHead>
                <HeaderSortable campo="usuario">Usuario</HeaderSortable>
                <HeaderSortable campo="fechaCambio">Fecha Cambio</HeaderSortable>
                <HeaderSortable campo="fechaServicio">Fecha Servicio</HeaderSortable>
                <HeaderSortable campo="cantidadPasajeros">Pasajeros</HeaderSortable>
                <TableHead>Monto Original</TableHead>
                <TableHead>Monto Final</TableHead>
                <HeaderSortable campo="estado">Estado</HeaderSortable>
                <TableHead>Motivo Rechazo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datosVisiblesToCurrentPage.map((bitacora) => (
                <React.Fragment key={bitacora.id}>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell className="font-medium">{bitacora.rutaOriginal.nombre}</TableCell>
                    <TableCell className="font-medium">{bitacora.rutaFinal.nombre}</TableCell>
                    <TableCell>{bitacora.numeroServicioOriginal}</TableCell>
                    <TableCell>{bitacora.numeroServicioFinal}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{bitacora.usuario.nombreCompleto}</span>
                        <span className="text-sm text-muted-foreground">@{bitacora.usuario.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatShortDate(bitacora.fechaCambio)}</TableCell>
                    <TableCell>{formatShortDate(bitacora.fechaServicio)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline">
                          {bitacora.cantidadPasajerosAfectados}
                        </Badge>
                        {bitacora.cantidadPasajerosAfectados > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFila(bitacora.id)}
                            className="h-8 w-8 p-0"
                          >
                            {filasExpandidas.has(bitacora.id) ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(bitacora.montoOriginal)}</TableCell>
                    <TableCell>{formatCurrency(bitacora.montoFinal)}</TableCell>
                    <TableCell>{getEstadoBadge(bitacora.estado)}</TableCell>
                    <TableCell className="max-w-[200px]">
                      {bitacora.motivoRechazo && (
                        <span className="text-sm text-muted-foreground truncate block">
                          {bitacora.motivoRechazo}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded row for passenger details */}
                  {filasExpandidas.has(bitacora.id) && bitacora.cantidadPasajerosAfectados > 0 && (
                    <TableRow>
                      <TableCell colSpan={12} className="bg-muted/30 p-0">
                        <div className="p-4">
                          <h4 className="font-semibold mb-3 text-sm">
                            Pasajeros Afectados ({bitacora.cantidadPasajerosAfectados})
                          </h4>
                          <div className="grid gap-3">
                            {mockPasajerosAfectados[bitacora.id]?.map((pasajero) => (
                              <div key={pasajero.id} className="grid grid-cols-5 gap-4 p-3 bg-background rounded-md border text-sm">
                                <div>
                                  <div className="font-medium">{pasajero.nombre}</div>
                                  <div className="text-muted-foreground">Cédula: {pasajero.cedula}</div>
                                  <div className="text-muted-foreground">Pago: {pasajero.tipoPago}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Fecha: {formatShortDate(pasajero.fechaServicio)}</div>
                                  <div className="text-muted-foreground">Hora: {pasajero.horaServicio}</div>
                                </div>
                                <div>
                                  <div className="font-medium">{pasajero.empresaTransporte}</div>
                                  <div className="text-muted-foreground">{pasajero.empresaCliente}</div>
                                </div>
                                <div>
                                  <div className="font-medium">{pasajero.autobus}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-muted-foreground">Original: {formatCurrency(pasajero.montoOriginal)}</div>
                                  <div className="font-medium">Final: {formatCurrency(pasajero.montoFinal)}</div>
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

        {/* Pagination */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {indiceInicio + 1} a {Math.min(indiceFin, datosFiltrados.length)} de {datosFiltrados.length} registros
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
              >
                Anterior
              </Button>
              <div className="text-sm">
                Página {paginaActual} de {totalPaginas}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
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

export default BitacoraCambiosRutasTable;