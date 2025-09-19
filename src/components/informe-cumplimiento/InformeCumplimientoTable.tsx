import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { InformeCumplimiento } from '@/types/informe-cumplimiento';
import ModalConfirmacionRevision from './ModalConfirmacionRevision';

interface InformeCumplimientoTableProps {
  informes: InformeCumplimiento[];
  onRevisionTransportista: (informe: InformeCumplimiento) => void;
  onRevisionAdministracion: (informe: InformeCumplimiento) => void;
  onRevisionCliente: (informe: InformeCumplimiento) => void;
  onSort: (campo: keyof InformeCumplimiento) => void;
  sortField: keyof InformeCumplimiento;
  sortDirection: 'asc' | 'desc';
}

export default function InformeCumplimientoTable({
  informes,
  onRevisionTransportista,
  onRevisionAdministracion,
  onRevisionCliente,
  onSort,
  sortField,
  sortDirection
}: InformeCumplimientoTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [informeSeleccionado, setInformeSeleccionado] = useState<InformeCumplimiento | null>(null);
  const [tipoRevision, setTipoRevision] = useState<'transportista' | 'administracion' | 'cliente'>('transportista');

  const getSortIcon = (campo: keyof InformeCumplimiento) => {
    if (sortField === campo) {
      return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    }
    return null;
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

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors min-w-[120px]"
                onClick={() => onSort('noInforme')}
              >
                <div className="flex items-center gap-2">
                  No Informe
                  {getSortIcon('noInforme')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors text-center min-w-[100px]"
                onClick={() => onSort('noSemana')}
              >
                <div className="flex items-center justify-center gap-2">
                  No Semana
                  {getSortIcon('noSemana')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors min-w-[120px]"
                onClick={() => onSort('fechaServicio')}
              >
                <div className="flex items-center gap-2">
                  Fecha servicio
                  {getSortIcon('fechaServicio')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors min-w-[120px]"
                onClick={() => onSort('idServicio')}
              >
                <div className="flex items-center gap-2">
                  Número Servicio
                  {getSortIcon('idServicio')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors min-w-[150px]"
                onClick={() => onSort('transportista')}
              >
                <div className="flex items-center gap-2">
                  Transportista
                  {getSortIcon('transportista')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors min-w-[150px]"
                onClick={() => onSort('empresaCliente')}
              >
                <div className="flex items-center gap-2">
                  Empresa cliente
                  {getSortIcon('empresaCliente')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors min-w-[120px]"
                onClick={() => onSort('tipoRuta')}
              >
                <div className="flex items-center gap-2">
                  Tipo ruta
                  {getSortIcon('tipoRuta')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors min-w-[100px]"
                onClick={() => onSort('turno')}
              >
                <div className="flex items-center gap-2">
                  Turno
                  {getSortIcon('turno')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors min-w-[120px]"
                onClick={() => onSort('ramal')}
              >
                <div className="flex items-center gap-2">
                  Ramal
                  {getSortIcon('ramal')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors min-w-[120px]"
                onClick={() => onSort('tipoUnidad')}
              >
                <div className="flex items-center gap-2">
                  Tipo unidad
                  {getSortIcon('tipoUnidad')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors min-w-[100px]"
                onClick={() => onSort('placa')}
              >
                <div className="flex items-center gap-2">
                  Placa
                  {getSortIcon('placa')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors text-center min-w-[100px]"
                onClick={() => onSort('sentido')}
              >
                <div className="flex items-center justify-center gap-2">
                  Sentido
                  {getSortIcon('sentido')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors text-center min-w-[100px]"
                onClick={() => onSort('ocupacion')}
              >
                <div className="flex items-center justify-center gap-2">
                  Ocupación
                  {getSortIcon('ocupacion')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors text-center min-w-[120px]"
                onClick={() => onSort('porcentajeOcupacion')}
              >
                <div className="flex items-center justify-center gap-2">
                  % ocupación
                  {getSortIcon('porcentajeOcupacion')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors text-center min-w-[120px]"
                onClick={() => onSort('horaInicio')}
              >
                <div className="flex items-center justify-center gap-2">
                  Hora inicio
                  {getSortIcon('horaInicio')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors text-center min-w-[130px]"
                onClick={() => onSort('horaFinalizacion')}
              >
                <div className="flex items-center justify-center gap-2">
                  Hora finalización
                  {getSortIcon('horaFinalizacion')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors text-right min-w-[130px]"
                onClick={() => onSort('tarifaPasajero')}
              >
                <div className="flex items-center justify-end gap-2">
                  Tarifa pasajero
                  {getSortIcon('tarifaPasajero')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors text-right min-w-[130px]"
                onClick={() => onSort('tarifaServicio')}
              >
                <div className="flex items-center justify-end gap-2">
                  Tarifa servicio
                  {getSortIcon('tarifaServicio')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors text-right min-w-[180px]"
                onClick={() => onSort('tarifaServicioTransportista')}
              >
                <div className="flex items-center justify-end gap-2">
                  Tarifa servicio transportista
                  {getSortIcon('tarifaServicioTransportista')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors text-center min-w-[120px]"
                onClick={() => onSort('programado')}
              >
                <div className="flex items-center justify-center gap-2">
                  Programado
                  {getSortIcon('programado')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/70 transition-colors text-center min-w-[150px]"
                onClick={() => onSort('estadoRevision')}
              >
                <div className="flex items-center justify-center gap-2">
                  Estado
                  {getSortIcon('estadoRevision')}
                </div>
              </TableHead>
              <TableHead className="text-center min-w-[300px]">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {informes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={22} className="text-center py-8 text-muted-foreground">
                  No se encontraron informes con los filtros aplicados
                </TableCell>
              </TableRow>
            ) : (
              informes.map((informe) => (
                <TableRow key={informe.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-sm">{informe.noInforme}</TableCell>
                  <TableCell className="text-center">{informe.noSemana}</TableCell>
                  <TableCell>{informe.fechaServicio} {informe.horaInicio}</TableCell>
                  <TableCell className="font-mono">{informe.idServicio}</TableCell>
                  <TableCell>{informe.transportista}</TableCell>
                  <TableCell>{informe.empresaCliente}</TableCell>
                  <TableCell>{informe.tipoRuta}</TableCell>
                  <TableCell>{informe.turno}</TableCell>
                  <TableCell>{informe.ramal}</TableCell>
                  <TableCell>{informe.tipoUnidad}</TableCell>
                  <TableCell className="font-mono">{informe.placa}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={informe.sentido === 'Ingreso' ? 'default' : 'secondary'}>
                      {informe.sentido}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{informe.ocupacion}</TableCell>
                  <TableCell className="text-center">{informe.porcentajeOcupacion}%</TableCell>
                  <TableCell className="text-center font-mono">{informe.horaInicio}</TableCell>
                  <TableCell className="text-center font-mono">{informe.horaFinalizacion}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(informe.tarifaPasajero)}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(informe.tarifaServicio)}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(informe.tarifaServicioTransportista)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={informe.programado ? 'default' : 'secondary'}>
                      {informe.programado ? 'Sí' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getEstadoBadge(informe.estadoRevision)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!canReviewTransportista(informe.estadoRevision)}
                        onClick={() => handleRevisionClick(informe, 'transportista')}
                        className="text-xs whitespace-nowrap"
                      >
                        Rev. Transportista
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!canReviewAdministracion(informe.estadoRevision)}
                        onClick={() => handleRevisionClick(informe, 'administracion')}
                        className="text-xs whitespace-nowrap"
                      >
                        Rev. Administración
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!canReviewCliente(informe.estadoRevision)}
                        onClick={() => handleRevisionClick(informe, 'cliente')}
                        className="text-xs whitespace-nowrap"
                      >
                        Rev. Cliente
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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