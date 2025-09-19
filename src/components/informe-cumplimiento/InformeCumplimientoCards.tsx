import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronUp, ChevronDown, Eye, EyeOff, CheckCircle, AlertCircle, FileText, Building, Route, Clock, DollarSign, Settings } from 'lucide-react';
import { InformeCumplimiento } from '@/types/informe-cumplimiento';
import { getDetallePasajerosForService } from '@/data/mockDetallePasajerosMovimientos';
import { verificarPermisoAcceso } from '@/services/permisosService';
import ModalConfirmacionRevision from './ModalConfirmacionRevision';
import CambioRutaModal from '@/components/cumplimiento-servicios/CambioRutaModal';
import { CumplimientoServicioData } from '@/types/cumplimiento-servicio';

interface InformeCumplimientoCardsProps {
  informes: InformeCumplimiento[];
  onRevisionTransportista: (informe: InformeCumplimiento) => void;
  onRevisionAdministracion: (informe: InformeCumplimiento) => void;
  onRevisionCliente: (informe: InformeCumplimiento) => void;
  onSort: (campo: keyof InformeCumplimiento) => void;
  sortField: keyof InformeCumplimiento;
  sortDirection: 'asc' | 'desc';
}

export default function InformeCumplimientoCards({
  informes,
  onRevisionTransportista,
  onRevisionAdministracion,
  onRevisionCliente,
  onSort,
  sortField,
  sortDirection
}: InformeCumplimientoCardsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [informeSeleccionado, setInformeSeleccionado] = useState<InformeCumplimiento | null>(null);
  const [tipoRevision, setTipoRevision] = useState<'transportista' | 'administracion' | 'cliente'>('transportista');
  const [cardsExpandidas, setCardsExpandidas] = useState<Set<string>>(new Set());
  const [modalCambioRutaAbierto, setModalCambioRutaAbierto] = useState(false);
  const [servicioParaCambioRuta, setServicioParaCambioRuta] = useState<CumplimientoServicioData | null>(null);
  const puedeVerDatosPersonales = verificarPermisoAcceso();

  const toggleCard = (id: string) => {
    const nuevasCardsExpandidas = new Set(cardsExpandidas);
    if (nuevasCardsExpandidas.has(id)) {
      nuevasCardsExpandidas.delete(id);
    } else {
      nuevasCardsExpandidas.add(id);
    }
    setCardsExpandidas(nuevasCardsExpandidas);
  };

  const getSortIcon = () => {
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'Revisado por Transportista':
        return <Badge variant="outline" className="text-blue-600"><Eye className="w-3 h-3 mr-1" />Rev. Transportista</Badge>;
      case 'Revisado por Administración':
        return <Badge variant="outline" className="text-orange-600"><Eye className="w-3 h-3 mr-1" />Rev. Administración</Badge>;
      case 'Completado':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Completado</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getInconsistenciaBadge = (informe: InformeCumplimiento) => {
    // Ejemplos de inconsistencias:
    // POSITIVO: Servicio cumplido, sin faltantes, horarios correctos, no hubo cambio de ruta
    // NEGATIVO: Faltantes > 0 ó horarios no cumplidos ó servicio no cumplido ó hubo cambio de ruta
    // NEUTRO: Estados intermedios o servicios en proceso
    
    let inconsistencia: 'neutral' | 'negativo' | 'positivo' = 'neutral';
    
    const hasFaltantes = informe.faltante > 0;
    const cumpleHorarios = informe.inicioRealizado && informe.cierreRealizado;
    const cumplimientoCompleto = informe.cumplimiento === 'Cumplido';
    const huboCambioRuta = informe.cambioRuta;
    
    // NEGATIVO: Cualquier problema detectado
    if (hasFaltantes || !cumpleHorarios || !cumplimientoCompleto || huboCambioRuta) {
      inconsistencia = 'negativo';
    } 
    // POSITIVO: Todo perfecto
    else if (cumplimientoCompleto && !hasFaltantes && cumpleHorarios && !huboCambioRuta) {
      inconsistencia = 'positivo';
    }
    // NEUTRO: Estados intermedios (ej: servicios pendientes)
    
    switch (inconsistencia) {
      case 'positivo':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Positivo
        </Badge>;
      case 'negativo':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Negativo
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200">
          <Settings className="w-3 h-3 mr-1" />
          Neutro
        </Badge>;
    }
  };

  const canReviewTransportista = (estado: string) => estado === 'Pendiente';
  const canReviewAdministracion = (estado: string) => estado === 'Revisado por Transportista';
  const canReviewCliente = (estado: string) => estado === 'Revisado por Administración';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleRevisionClick = (informe: InformeCumplimiento, tipo: 'transportista' | 'administracion' | 'cliente') => {
    setInformeSeleccionado(informe);
    setTipoRevision(tipo);
    setModalOpen(true);
  };

  const handleConfirmarRevision = () => {
    if (!informeSeleccionado) return;
    
    switch (tipoRevision) {
      case 'transportista':
        onRevisionTransportista(informeSeleccionado);
        break;
      case 'administracion':
        onRevisionAdministracion(informeSeleccionado);
        break;
      case 'cliente':
        onRevisionCliente(informeSeleccionado);
        break;
    }
    
    setInformeSeleccionado(null);
  };

  const handleSolicitarCambioRuta = (informe: InformeCumplimiento) => {
    // Convert InformeCumplimiento to CumplimientoServicioData format for modal
    const servicioData: CumplimientoServicioData = {
      id: informe.id,
      numeroServicio: informe.idServicio,
      autobus: informe.placa,
      ramal: informe.ramal,
      empresaTransporte: informe.transportista,
      empresaCliente: informe.empresaCliente,
      inicioProgramado: new Date().toISOString(),
      cierreProgramado: new Date().toISOString(),
      inicioRealizado: informe.inicioRealizado || null,
      cierreRealizado: informe.cierreRealizado || null,
      ultimaFechaDescarga: informe.ultimaDescarga || null,
      cantidadPasajeros: informe.pasajeros,
      pasajerosTransmitidos: informe.transmitidos,
      cantidadFaltanteDescarga: informe.faltante,
      estadoServicio: 'Cierre manual-descarga completa',
      cumplimientoServicio: informe.cumplimiento === 'Cumplido' ? 'Cumplido' : 'No cumplido',
      puedesolicitarCambioRuta: true
    };
    setServicioParaCambioRuta(servicioData);
    setModalCambioRutaAbierto(true);
  };

  const handleCloseCambioRutaModal = () => {
    setModalCambioRutaAbierto(false);
    setServicioParaCambioRuta(null);
  };

  const sortOptions = [
    { value: 'noInforme', label: 'No Informe' },
    { value: 'noSemana', label: 'No Semana' },
    { value: 'fechaServicio', label: 'Fecha Servicio' },
    { value: 'idServicio', label: 'ID Servicio' },
    { value: 'transportista', label: 'Transportista' },
    { value: 'empresaCliente', label: 'Empresa Cliente' },
    { value: 'tipoRuta', label: 'Tipo Ruta' },
    { value: 'turno', label: 'Turno' },
    { value: 'ramal', label: 'Ramal' },
    { value: 'tipoUnidad', label: 'Tipo Unidad' },
    { value: 'placa', label: 'Placa' },
    { value: 'sentido', label: 'Sentido' },
    { value: 'ocupacion', label: 'Ocupación' },
    { value: 'porcentajeOcupacion', label: '% Ocupación' },
    { value: 'horaInicio', label: 'Inicio Programado' },
    { value: 'horaFinalizacion', label: 'Cierre Programado' },
    { value: 'inicioRealizado', label: 'Inicio Realizado' },
    { value: 'cierreRealizado', label: 'Cierre Realizado' },
    { value: 'ultimaDescarga', label: 'Última Descarga' },
    { value: 'pasajeros', label: 'Pasajeros' },
    { value: 'transmitidos', label: 'Transmitidos' },
    { value: 'faltante', label: 'Faltante' },
    { value: 'estado', label: 'Estado' },
    { value: 'cumplimiento', label: 'Cumplimiento' },
    { value: 'tarifaPasajero', label: 'Tarifa Pasajero' },
    { value: 'tarifaServicio', label: 'Tarifa Servicio' },
    { value: 'tarifaServicioTransportista', label: 'Tarifa Servicio Transportista' },
    { value: 'programado', label: 'Programado' },
    { value: 'estadoRevision', label: 'Estado Revisión' }
  ];

  if (informes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No se encontraron informes con los filtros aplicados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Lista de filas */}
      <div className="space-y-3">
        {informes.map((informe) => (
          <Card key={informe.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* Grid layout para mejor organización */}
              <div className="grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-4">
                {/* Fila 1 */}
                <div>
                  <span className="text-muted-foreground text-sm block">Fecha servicio</span>
                  <p className="font-medium">{informe.fechaServicio}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">ID Servicio</span>
                  <p className="font-mono font-medium">{informe.idServicio}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Transportista</span>
                  <p className="font-medium">{informe.transportista}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Empresa cliente</span>
                  <p className="font-medium">{informe.empresaCliente}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Tipo ruta</span>
                  <span className="font-medium">{informe.tipoRuta}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Turno</span>
                  <span className="font-medium">{informe.turno}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Ramal</span>
                  <span className="font-medium">{informe.ramal}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Tipo unidad</span>
                  <span className="font-medium">{informe.tipoUnidad}</span>
                </div>

                {/* Fila 2 */}
                <div>
                  <span className="text-muted-foreground text-sm block">Placa</span>
                  <span className="font-mono font-medium">{informe.placa}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Sentido</span>
                  <Badge variant={informe.sentido === 'Ingreso' ? 'default' : 'secondary'} className="text-xs">
                    {informe.sentido}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Ocupación</span>
                  <span className="font-medium">{informe.ocupacion}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">% ocupación</span>
                  <span className="font-medium">{informe.porcentajeOcupacion}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Tarifa pasajero</span>
                  <span className="font-mono font-medium">{formatCurrency(informe.tarifaPasajero)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Tarifa servicio</span>
                  <span className="font-mono font-medium">{formatCurrency(informe.tarifaServicio)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Tarifa servicio transportista</span>
                  <span className="font-mono font-medium">{formatCurrency(informe.tarifaServicioTransportista)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Programado</span>
                  <Badge variant={informe.programado ? 'default' : 'secondary'} className="text-xs">
                    {informe.programado ? 'Sí' : 'No'}
                  </Badge>
                </div>

                {/* Fila 3 */}
                <div>
                  <span className="text-muted-foreground text-sm block">Inicio Programado</span>
                  <span className="font-mono font-medium">{informe.horaInicio}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Cierre Programado</span>
                  <span className="font-mono font-medium">{informe.horaFinalizacion}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Inicio Realizado</span>
                  <span className="font-mono font-medium">{informe.inicioRealizado || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Cierre Realizado</span>
                  <span className="font-mono font-medium">{informe.cierreRealizado || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Última Descarga</span>
                  <span className="font-mono font-medium">{informe.ultimaDescarga || '-'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Pasajeros</span>
                  <span className="font-medium">{informe.pasajeros}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Transmitidos</span>
                  <span className="font-medium">{informe.transmitidos}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block">Faltante</span>
                  <span className="font-medium">{informe.faltante}</span>
                </div>
              </div>

              {/* Fila de estado y acciones */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-muted-foreground text-sm">Estado:</span>
                    <Badge variant={informe.estado === 'Cierre automático-descarga completa' ? 'default' : 'secondary'} className="text-xs ml-1">
                      {informe.estado}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Cumplimiento:</span>
                    <Badge variant={informe.cumplimiento === 'Cumplido' ? 'default' : 'destructive'} className="text-xs ml-1">
                      {informe.cumplimiento}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Estado Revisión:</span>
                    {getEstadoBadge(informe.estadoRevision)}
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Cambio de Ruta:</span>
                    <Badge variant={informe.cambioRuta ? 'destructive' : 'default'} className="text-xs ml-1">
                      {informe.cambioRuta ? 'Sí' : 'No'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Inconsistencia:</span>
                    {getInconsistenciaBadge(informe)}
                  </div>
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleCard(informe.id)}
                    className="text-xs px-2 py-1 h-7"
                  >
                    {cardsExpandidas.has(informe.id) ? (
                      <EyeOff className="h-3 w-3 mr-1" />
                    ) : (
                      <Eye className="h-3 w-3 mr-1" />
                    )}
                    Detalle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canReviewTransportista(informe.estadoRevision)}
                    onClick={() => handleRevisionClick(informe, 'transportista')}
                    className="text-xs px-2 py-1 h-7"
                  >
                    Rev. Transp.
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canReviewAdministracion(informe.estadoRevision)}
                    onClick={() => handleRevisionClick(informe, 'administracion')}
                    className="text-xs px-2 py-1 h-7"
                  >
                    Rev. Admin.
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canReviewCliente(informe.estadoRevision)}
                    onClick={() => handleRevisionClick(informe, 'cliente')}
                    className="text-xs px-2 py-1 h-7"
                  >
                    Rev. Cliente
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSolicitarCambioRuta(informe)}
                    className="text-xs px-2 py-1 h-7"
                  >
                    <Route className="h-3 w-3 mr-1" />
                    Cambio Ruta
                  </Button>
                </div>
              </div>

              {/* Expanded section for passenger details */}
              {cardsExpandidas.has(informe.id) && (
                <div className="mt-4 pt-4 border-t bg-muted/30 -mx-4 -mb-4 rounded-b-lg">
                  <div className="px-4 pb-4">
                    <h4 className="font-semibold mb-3 text-sm">
                      Detalle de Movimientos de Pasajeros
                    </h4>
                    <div className="grid gap-3 max-h-96 overflow-y-auto">
                      {getDetallePasajerosForService(informe.idServicio, {
                        transportista: informe.transportista,
                        placaAutobus: informe.placa,
                        sector: '', // Not available in compliance report
                        ramal: informe.ramal,
                        cliente: informe.empresaCliente,
                        sentido: informe.sentido
                      }).map((movimiento) => (
                        <div key={movimiento.id} className="p-4 bg-background rounded-md border">
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                            {/* Column 1: Personal Info */}
                            {puedeVerDatosPersonales && (
                              <div className="space-y-1">
                                <div className="font-medium text-foreground">{movimiento.nombrePasajero}</div>
                                <div className="text-muted-foreground">
                                  <span className="font-medium">Cédula:</span> {movimiento.cedula}
                                </div>
                                <div className="text-muted-foreground">
                                  <span className="font-medium">Tipo de Pago:</span> {movimiento.tipoPago}
                                </div>
                              </div>
                            )}
                            
                            {/* Column 2: Transaction Info */}
                            <div className="space-y-1">
                              <div className="text-muted-foreground">
                                <span className="font-medium">Fecha Transacción:</span>
                              </div>
                              <div className="text-foreground">{movimiento.fechaTransaccion}</div>
                              <div className="text-muted-foreground">
                                <span className="font-medium">Hora:</span> {movimiento.horaTransaccion}
                              </div>
                              <div className="text-muted-foreground">
                                <span className="font-medium">Monto:</span> {formatCurrency(movimiento.monto)}
                              </div>
                            </div>
                            
                            {/* Column 3: Transport Info */}
                            <div className="space-y-1">
                              <div className="text-muted-foreground">
                                <span className="font-medium">Empresa Transporte:</span>
                              </div>
                              <div className="text-foreground">{movimiento.empresaTransporte}</div>
                              <div className="text-muted-foreground">
                                <span className="font-medium">Placa Autobús:</span>
                              </div>
                              <div className="text-foreground font-mono">{movimiento.placaAutobus}</div>
                              <div className="text-muted-foreground">
                                <span className="font-medium">Sentido:</span>
                              </div>
                              <div>
                                <Badge variant={movimiento.sentido === 'Ingreso' ? 'default' : 'secondary'}>
                                  {movimiento.sentido}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Column 4: Route Info */}
                            <div className="space-y-1">
                              <div className="text-muted-foreground">
                                <span className="font-medium">Ramal:</span>
                              </div>
                              <div className="text-foreground">{movimiento.ramal}</div>
                            </div>
                            
                            {/* Column 5: Location & Client */}
                            <div className="space-y-1">
                              <div className="text-muted-foreground">
                                <span className="font-medium">Empresa Cliente:</span>
                              </div>
                              <div className="text-foreground">{movimiento.empresaCliente}</div>
                              <div className="text-muted-foreground">
                                <span className="font-medium">Parada:</span>
                              </div>
                              <div className="text-foreground">{movimiento.parada}</div>
                              <div className="text-muted-foreground text-xs">
                                Lat/Lng: {movimiento.latitud.toFixed(4)}, {movimiento.longitud.toFixed(4)}
                              </div>
                            </div>
                            
                            {/* Column 6: Employee & Additional Info */}
                            <div className="space-y-1">
                              <div className="text-muted-foreground">
                                <span className="font-medium">N° Empleado:</span>
                              </div>
                              <div className="text-foreground font-mono text-xs">{movimiento.numeroEmpleado}</div>
                              <div className="text-muted-foreground">
                                <span className="font-medium">Tipo Planilla:</span>
                              </div>
                              <div className="text-foreground">{movimiento.tipoPlanilla}</div>
                              <div className="text-muted-foreground">
                                <span className="font-medium">Subsidio:</span> {formatCurrency(movimiento.subsidio)}
                              </div>
                              <div className="text-muted-foreground">
                                <span className="font-medium">Viaje Adicional:</span>
                              </div>
                              <div className="text-foreground">
                                {movimiento.viajeAdicional ? "Sí" : "No"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <ModalConfirmacionRevision
        open={modalOpen}
        onOpenChange={setModalOpen}
        informe={informeSeleccionado}
        tipoRevision={tipoRevision}
        onConfirmar={handleConfirmarRevision}
      />

      <CambioRutaModal 
        servicio={servicioParaCambioRuta}
        isOpen={modalCambioRutaAbierto}
        onClose={handleCloseCambioRutaModal}
      />
    </div>
  );
}