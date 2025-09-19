import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, EyeOff, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { BitacoraCambioRutaFilter, BitacoraCambioRuta } from '@/types/bitacora-cambio-ruta';
import { SolicitudAprobacion } from '@/types/solicitud-aprobacion';
import { mockBitacoraCambiosRutas, mockPasajerosAfectados } from '@/data/mockBitacoraCambiosRutas';
import { formatShortDate } from '@/lib/dateUtils';
import { ModalAprobacionSolicitudBitacora } from '@/components/bitacora-cambios-rutas/ModalAprobacionSolicitudBitacora';

interface BitacoraCambiosRutasTableProps {
  filtros: BitacoraCambioRutaFilter;
}

const BitacoraCambiosRutasTable = ({ filtros }: BitacoraCambiosRutasTableProps) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [filasExpandidas, setFilasExpandidas] = useState<Set<string>>(new Set());
  const [modalAbierto, setModalAbierto] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudAprobacion | null>(null);
  const [ordenamiento, setOrdenamiento] = useState<{
    campo: string;
    direccion: 'asc' | 'desc';
  }>({ campo: 'fechaCambio', direccion: 'desc' });

  // Filter and sort data
  const datosFiltrados = useMemo(() => {
    let datos = mockBitacoraCambiosRutas.filter(bitacora => {
      // Filter by ruta original
      if (filtros.rutaOriginal !== 'todos' && bitacora.rutaOriginal.id !== filtros.rutaOriginal) {
        return false;
      }
      
      // Filter by ruta final
      if (filtros.rutaFinal !== 'todos' && bitacora.rutaFinal.id !== filtros.rutaFinal) {
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
      
      // Filter by fecha cambio range with time
      if (filtros.fechaCambioInicio && filtros.horaCambioInicio) {
        const fechaInicioCompleta = `${filtros.fechaCambioInicio}T${filtros.horaCambioInicio}:00`;
        const fechaCambioCompleta = `${bitacora.fechaCambio}T00:00:00`;
        if (fechaCambioCompleta < fechaInicioCompleta) {
          return false;
        }
      }
      if (filtros.fechaCambioFin && filtros.horaCambioFin) {
        const fechaFinCompleta = `${filtros.fechaCambioFin}T${filtros.horaCambioFin}:59`;
        const fechaCambioCompleta = `${bitacora.fechaCambio}T23:59:59`;
        if (fechaCambioCompleta > fechaFinCompleta) {
          return false;
        }
      }
      
      // Filter by fecha servicio range with time (only if checkbox is checked)
      if (filtros.usarFechaServicio) {
        if (filtros.fechaServicioInicio && filtros.horaServicioInicio) {
          const fechaInicioCompleta = `${filtros.fechaServicioInicio}T${filtros.horaServicioInicio}:00`;
          const fechaServicioCompleta = `${bitacora.fechaServicio}T00:00:00`;
          if (fechaServicioCompleta < fechaInicioCompleta) {
            return false;
          }
        }
        if (filtros.fechaServicioFin && filtros.horaServicioFin) {
          const fechaFinCompleta = `${filtros.fechaServicioFin}T${filtros.horaServicioFin}:59`;
          const fechaServicioCompleta = `${bitacora.fechaServicio}T23:59:59`;
          if (fechaServicioCompleta > fechaFinCompleta) {
            return false;
          }
        }
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
      if (filtros.empresaTransporte !== 'todos' && bitacora.empresaTransporte.id !== filtros.empresaTransporte) {
        return false;
      }
      
      // Filter by autobus (text search)
      if (filtros.autobus && filtros.autobus.trim()) {
        const autobusText = filtros.autobus.toLowerCase();
        const matchNumero = bitacora.autobus.numero.toLowerCase().includes(autobusText);
        const matchPlaca = bitacora.autobus.placa.toLowerCase().includes(autobusText);
        if (!matchNumero && !matchPlaca) {
          return false;
        }
      }
      
      // Filter by estado
      if (filtros.estado !== 'todos' && bitacora.estado !== filtros.estado) {
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
    if (estado === 'Aceptada') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          Aceptada
        </Badge>
      );
    } else if (estado === 'Rechazada') {
      return (
        <Badge variant="destructive">
          Rechazada
        </Badge>
      );
    } else if (estado === 'Pendiente') {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pendiente
        </Badge>
      );
    }
    return null;
  };

  const convertirBitacoraASolicitud = (bitacora: BitacoraCambioRuta): SolicitudAprobacion => {
    return {
      id: bitacora.id,
      servicioId: bitacora.id,
      numeroServicio: bitacora.numeroServicioOriginal,
      fechaServicio: bitacora.fechaServicio,
      placaAutobus: bitacora.autobus.placa,
      idAutobus: bitacora.autobus.id,
      empresaTransporte: bitacora.empresaTransporte.nombre,
      rutaOriginal: {
        id: bitacora.rutaOriginal.id,
        nombre: bitacora.rutaOriginal.nombre,
        sentido: 'ingreso' as const
      },
      rutaNueva: {
        id: bitacora.rutaFinal.id,
        nombre: bitacora.rutaFinal.nombre,
        sentido: 'salida' as const
      },
      motivo: bitacora.motivoRechazo || '',
      estado: bitacora.estado === 'Aceptada' ? 'aprobada' : 'rechazada',
      fechaSolicitud: bitacora.fechaCambio,
      usuario: {
        id: bitacora.usuario.id,
        nombre: bitacora.usuario.nombreCompleto,
        username: bitacora.usuario.username
      },
      pasajerosAfectados: bitacora.cantidadPasajerosAfectados,
      montoOriginal: bitacora.montoOriginal,
      montoFinal: bitacora.montoFinal
    };
  };

  const handleAbrirModal = (bitacora: BitacoraCambioRuta) => {
    const solicitud = convertirBitacoraASolicitud(bitacora);
    setSolicitudSeleccionada(solicitud);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setSolicitudSeleccionada(null);
  };

  const handleAprobacionCompleta = () => {
    handleCerrarModal();
    // Aquí podrías actualizar la lista si fuera necesario
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
                <HeaderSortable campo="usuario">Usuario que solicita cambio</HeaderSortable>
                <TableHead>Usuario que Acepta/Rechaza</TableHead>
                <HeaderSortable campo="fechaCambio">Fecha Cambio</HeaderSortable>
                <HeaderSortable campo="fechaServicio">Fecha Servicio</HeaderSortable>
                <HeaderSortable campo="cantidadPasajeros">Pasajeros afectados</HeaderSortable>
                <TableHead>Monto Original</TableHead>
                <TableHead>Monto Final</TableHead>
                <HeaderSortable campo="estado">Estado</HeaderSortable>
                <TableHead>Motivo Rechazo</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datosVisiblesToCurrentPage.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="text-center py-8 text-muted-foreground">
                    No existen resultados.
                  </TableCell>
                </TableRow>
              ) : (
                datosVisiblesToCurrentPage.map((bitacora) => (
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
                    <TableCell>
                      {bitacora.usuarioAprobador ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{bitacora.usuarioAprobador.nombreCompleto}</span>
                          <span className="text-sm text-muted-foreground">@{bitacora.usuarioAprobador.username}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatShortDate(bitacora.fechaCambio)}</TableCell>
                    <TableCell>{formatShortDate(bitacora.fechaServicio)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline">
                          {bitacora.cantidadPasajerosAfectados}
                        </Badge>
                        {bitacora.cantidadPasajerosAfectados > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
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
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver pasajeros afectados</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                    <TableCell className="text-center">
                      {bitacora.estado === 'Pendiente' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAbrirModal(bitacora)}
                        >
                          Aprobar/Rechazar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded row for passenger details */}
                  {filasExpandidas.has(bitacora.id) && bitacora.cantidadPasajerosAfectados > 0 && (
                    <TableRow>
                      <TableCell colSpan={14} className="bg-muted/30 p-0">
                        <div className="p-4">
                          <h4 className="font-semibold mb-3 text-sm">
                            Detalle de Pasajeros Afectados ({bitacora.cantidadPasajerosAfectados})
                          </h4>
                          <div className="grid gap-3">
                            {mockPasajerosAfectados[bitacora.id]?.map((pasajero) => (
                              <div key={pasajero.id} className="p-4 bg-background rounded-md border">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                  {/* Column 1: Basic Info */}
                                  <div className="space-y-1">
                                    <div className="font-medium text-foreground">{pasajero.nombre}</div>
                                    <div className="text-muted-foreground">
                                      <span className="font-medium">Cédula:</span> {pasajero.cedula}
                                    </div>
                                    <div className="text-muted-foreground">
                                      <span className="font-medium">Tipo de Pago:</span> {pasajero.tipoPago}
                                    </div>
                                  </div>
                                  
                                  {/* Column 2: Service Info */}
                                  <div className="space-y-1">
                                    <div className="text-muted-foreground">
                                      <span className="font-medium">Fecha del Servicio:</span>
                                    </div>
                                    <div className="text-foreground">{formatShortDate(pasajero.fechaServicio)}</div>
                                    <div className="text-muted-foreground">
                                      <span className="font-medium">Hora:</span> {pasajero.horaServicio}
                                    </div>
                                  </div>
                                  
                                  {/* Column 3: Companies */}
                                  <div className="space-y-1">
                                    <div className="text-muted-foreground">
                                      <span className="font-medium">Empresa Transporte:</span>
                                    </div>
                                    <div className="text-foreground">{pasajero.empresaTransporte}</div>
                                    <div className="text-muted-foreground">
                                      <span className="font-medium">Empresa Cliente:</span>
                                    </div>
                                    <div className="text-foreground">{pasajero.empresaCliente}</div>
                                  </div>
                                  
                                  {/* Column 4: Bus */}
                                  <div className="space-y-1">
                                    <div className="text-muted-foreground">
                                      <span className="font-medium">Autobús:</span>
                                    </div>
                                    <div className="text-foreground font-medium">{pasajero.autobus}</div>
                                  </div>
                                  
                                  {/* Column 5: Amounts */}
                                  <div className="space-y-1">
                                    <div className="text-muted-foreground">
                                      <span className="font-medium">Monto Original:</span>
                                    </div>
                                    <div className="text-foreground">{formatCurrency(pasajero.montoOriginal)}</div>
                                    <div className="text-muted-foreground">
                                      <span className="font-medium">Monto Final:</span>
                                    </div>
                                    <div className="text-foreground font-medium">{formatCurrency(pasajero.montoFinal)}</div>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {datosFiltrados.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Mostrar</span>
              <Select
                value={registrosPorPagina.toString()}
                onValueChange={(value) => {
                  setRegistrosPorPagina(Number(value));
                  setPaginaActual(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                de {datosFiltrados.length} registros
              </span>
            </div>

            {totalPaginas > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                  disabled={paginaActual === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                <span className="text-sm">
                  Página {paginaActual} de {totalPaginas}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Modal de Aprobación */}
        {solicitudSeleccionada && (
          <ModalAprobacionSolicitudBitacora
            solicitud={solicitudSeleccionada}
            isOpen={modalAbierto}
            onClose={handleCerrarModal}
            onAprobacionComplete={handleAprobacionCompleta}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BitacoraCambiosRutasTable;