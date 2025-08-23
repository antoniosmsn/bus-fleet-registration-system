import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ArrowUpDown, Route } from 'lucide-react';
import { CumplimientoServicioData, FiltrosCumplimientoServicio, EstadoServicio, CumplimientoServicio } from '@/types/cumplimiento-servicio';
import { mockCumplimientoServicios } from '@/data/mockCumplimientoServicios';
import { formatShortDate } from '@/lib/dateUtils';

interface CumplimientoServiciosTableProps {
  filtros: FiltrosCumplimientoServicio;
}

const CumplimientoServiciosTable: React.FC<CumplimientoServiciosTableProps> = ({ filtros }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [serviciosPorPagina, setServiciosPorPagina] = useState(10);
  const [ordenamiento, setOrdenamiento] = useState<{campo: string, direccion: 'asc' | 'desc'}>({
    campo: 'numeroServicio',
    direccion: 'asc'
  });

  // Filter services based on filters
  const serviciosFiltrados = useMemo(() => {
    return mockCumplimientoServicios.filter(servicio => {
      // Date range filter
      const fechaServicio = new Date(servicio.inicioProgramado).toISOString().split('T')[0];
      if (filtros.fechaInicio && fechaServicio < filtros.fechaInicio) return false;
      if (filtros.fechaFin && fechaServicio > filtros.fechaFin) return false;

      // Number filter
      if (filtros.numeroServicio && !servicio.numeroServicio.toLowerCase().includes(filtros.numeroServicio.toLowerCase())) {
        return false;
      }

      // Multi-select filters
      if (filtros.autobus.length > 0 && !filtros.autobus.includes(servicio.autobus)) return false;
      if (filtros.ramal.length > 0 && !filtros.ramal.includes(servicio.ramal)) return false;
      if (filtros.estadoServicio.length > 0 && !filtros.estadoServicio.includes(servicio.estadoServicio)) return false;
      if (filtros.cumplimientoServicio.length > 0 && !filtros.cumplimientoServicio.includes(servicio.cumplimientoServicio)) return false;
      if (filtros.empresaCliente.length > 0) {
        if (!servicio.empresaCliente || !filtros.empresaCliente.includes(servicio.empresaCliente)) return false;
      }

      return true;
    });
  }, [filtros]);

  // Sort services
  const serviciosOrdenados = useMemo(() => {
    return [...serviciosFiltrados].sort((a, b) => {
      const aValue = a[ordenamiento.campo as keyof CumplimientoServicioData];
      const bValue = b[ordenamiento.campo as keyof CumplimientoServicioData];
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return ordenamiento.direccion === 'desc' ? -comparison : comparison;
    });
  }, [serviciosFiltrados, ordenamiento]);

  // Pagination
  const totalPaginas = Math.ceil(serviciosOrdenados.length / serviciosPorPagina);
  const indiceInicio = (paginaActual - 1) * serviciosPorPagina;
  const serviciosPaginados = serviciosOrdenados.slice(indiceInicio, indiceInicio + serviciosPorPagina);

  const cambiarOrdenamiento = (campo: string) => {
    setOrdenamiento(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getEstadoBadge = (estado: EstadoServicio) => {
    const variants: Record<EstadoServicio, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'Sin iniciar': 'outline',
      'Iniciado': 'secondary',
      'Iniciado-descarga incompleta': 'destructive',
      'Cierre manual-descarga completa': 'default',
      'Cierre manual-descarga incompleta': 'destructive',
      'Cierre automático-descarga incompleta': 'destructive',
      'Cierre automático-descarga completa': 'default'
    };

    return (
      <Badge variant={variants[estado]} className="text-xs">
        {estado}
      </Badge>
    );
  };

  const getCumplimientoBadge = (cumplimiento: CumplimientoServicio) => {
    return (
      <Badge 
        variant={cumplimiento === 'Cumplido' ? 'default' : 'destructive'} 
        className="text-xs"
      >
        {cumplimiento}
      </Badge>
    );
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSolicitarCambioRuta = (servicioId: string) => {
    // This would navigate to the change route page
    console.log('Solicitar cambio de ruta para servicio:', servicioId);
    // TODO: Implement navigation to /servicios/cambio-ruta/{servicioId}
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cumplimiento de Servicios</CardTitle>
          <div className="text-sm text-muted-foreground">
            {serviciosOrdenados.length} servicios encontrados
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => cambiarOrdenamiento('numeroServicio')}
                >
                  <div className="flex items-center gap-2">
                    N° Servicio
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => cambiarOrdenamiento('autobus')}
                >
                  <div className="flex items-center gap-2">
                    Autobús
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Ramal</TableHead>
                <TableHead>Empresa Transporte</TableHead>
                <TableHead>Empresa Cliente</TableHead>
                <TableHead>Inicio Programado</TableHead>
                <TableHead>Cierre Programado</TableHead>
                <TableHead>Inicio Realizado</TableHead>
                <TableHead>Cierre Realizado</TableHead>
                <TableHead>Última Descarga</TableHead>
                <TableHead className="text-right">Pasajeros</TableHead>
                <TableHead className="text-right">Transmitidos</TableHead>
                <TableHead className="text-right">Faltante</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Cumplimiento</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviciosPaginados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={16} className="text-center py-8 text-muted-foreground">
                    No se encontraron servicios con los filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                serviciosPaginados.map((servicio) => (
                  <TableRow key={servicio.id}>
                    <TableCell className="font-medium">{servicio.numeroServicio}</TableCell>
                    <TableCell>{servicio.autobus}</TableCell>
                    <TableCell>{servicio.ramal}</TableCell>
                    <TableCell>{servicio.empresaTransporte}</TableCell>
                    <TableCell>{servicio.empresaCliente || 'N/A'}</TableCell>
                    <TableCell>{formatDateTime(servicio.inicioProgramado)}</TableCell>
                    <TableCell>{formatDateTime(servicio.cierreProgramado)}</TableCell>
                    <TableCell>{formatDateTime(servicio.inicioRealizado)}</TableCell>
                    <TableCell>{formatDateTime(servicio.cierreRealizado)}</TableCell>
                    <TableCell>{formatDateTime(servicio.ultimaFechaDescarga)}</TableCell>
                    <TableCell className="text-right">{servicio.cantidadPasajeros}</TableCell>
                    <TableCell className="text-right">{servicio.pasajerosTransmitidos}</TableCell>
                    <TableCell className="text-right">{servicio.cantidadFaltanteDescarga}</TableCell>
                    <TableCell>{getEstadoBadge(servicio.estadoServicio)}</TableCell>
                    <TableCell>{getCumplimientoBadge(servicio.cumplimientoServicio)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!servicio.puedesolicitarCambioRuta}
                        onClick={() => handleSolicitarCambioRuta(servicio.id)}
                        className="h-8"
                      >
                        <Route className="h-3 w-3 mr-1" />
                        Cambio Ruta
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {serviciosOrdenados.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Mostrar</span>
              <Select
                value={serviciosPorPagina.toString()}
                onValueChange={(value) => {
                  setServiciosPorPagina(Number(value));
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
                de {serviciosOrdenados.length} registros
              </span>
            </div>

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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CumplimientoServiciosTable;