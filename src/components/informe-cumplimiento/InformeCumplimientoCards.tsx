import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronUp, ChevronDown, Eye, CheckCircle, AlertCircle, FileText, Building, Route, Clock, DollarSign, Settings } from 'lucide-react';
import { InformeCumplimiento } from '@/types/informe-cumplimiento';
import ModalConfirmacionRevision from './ModalConfirmacionRevision';

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
    { value: 'horaInicio', label: 'Hora Inicio' },
    { value: 'horaFinalizacion', label: 'Hora Finalización' },
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
      {/* Controles de ordenamiento */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg bg-muted/20">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Ordenar por:</span>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={sortField}
            onValueChange={(value) => onSort(value as keyof InformeCumplimiento)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSort(sortField)}
            className="px-2"
          >
            {getSortIcon()}
          </Button>
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {informes.map((informe) => (
          <Card key={informe.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Header del informe */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{informe.noInforme}</h3>
                  <p className="text-sm text-muted-foreground">Semana {informe.noSemana} - {informe.fechaServicio}</p>
                </div>
                <div className="text-right">
                  {getEstadoBadge(informe.estadoRevision)}
                </div>
              </div>

              {/* Información organizada en grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Servicio:</span>
                  <span className="font-mono font-medium">{informe.idServicio}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transportista:</span>
                  <span className="font-medium truncate ml-2">{informe.transportista}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Empresa Cliente:</span>
                  <span className="font-medium truncate ml-2">{informe.empresaCliente}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo Ruta:</span>
                  <span className="font-medium">{informe.tipoRuta}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Turno:</span>
                  <span className="font-medium">{informe.turno}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ramal:</span>
                  <span className="font-medium">{informe.ramal}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo Unidad:</span>
                  <span className="font-medium">{informe.tipoUnidad}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placa:</span>
                  <span className="font-mono font-medium">{informe.placa}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sentido:</span>
                  <Badge variant={informe.sentido === 'Ingreso' ? 'default' : 'secondary'} className="text-xs">
                    {informe.sentido}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Programado:</span>
                  <Badge variant={informe.programado ? 'default' : 'secondary'} className="text-xs">
                    {informe.programado ? 'Sí' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ocupación:</span>
                  <span className="font-medium">{informe.ocupacion} ({informe.porcentajeOcupacion}%)</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horarios:</span>
                  <span className="font-mono font-medium">{informe.horaInicio} - {informe.horaFinalizacion}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa Pasajero:</span>
                  <span className="font-mono font-medium">{formatCurrency(informe.tarifaPasajero)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa Servicio:</span>
                  <span className="font-mono font-medium">{formatCurrency(informe.tarifaServicio)}</span>
                </div>
                
                <div className="flex justify-between md:col-span-2">
                  <span className="text-muted-foreground">Tarifa Transportista:</span>
                  <span className="font-mono font-medium">{formatCurrency(informe.tarifaServicioTransportista)}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="border-t pt-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canReviewTransportista(informe.estadoRevision)}
                    onClick={() => handleRevisionClick(informe, 'transportista')}
                    className="flex-1 text-xs"
                  >
                    Revisión Transportista
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canReviewAdministracion(informe.estadoRevision)}
                    onClick={() => handleRevisionClick(informe, 'administracion')}
                    className="flex-1 text-xs"
                  >
                    Revisión Administración
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canReviewCliente(informe.estadoRevision)}
                    onClick={() => handleRevisionClick(informe, 'cliente')}
                    className="flex-1 text-xs"
                  >
                    Revisión Cliente
                  </Button>
                </div>
              </div>
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
    </div>
  );
}