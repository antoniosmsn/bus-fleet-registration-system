import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AutobusCapacidadCumplida } from "@/types/autobus-capacidad-cumplida";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { Bus, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { verificarPermisoAtencion, obtenerUsuarioActual } from '@/services/permisosService';
import { registrarAtencionAlerta } from '@/services/bitacoraService';
import { useToast } from '@/hooks/use-toast';

interface TablaCapacidadCumplidaProps {
  autobuses: AutobusCapacidadCumplida[];
  onUpdateAutobus?: (autobus: AutobusCapacidadCumplida) => void;
}

const TablaCapacidadCumplida: React.FC<TablaCapacidadCumplidaProps> = ({ 
  autobuses, 
  onUpdateAutobus 
}) => {
  const { toast } = useToast();
  const puedeAtender = verificarPermisoAtencion();
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const { autobusesVisibles, totalPaginas } = useMemo(() => {
    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    return {
      autobusesVisibles: autobuses.slice(inicio, fin),
      totalPaginas: Math.ceil(autobuses.length / elementosPorPagina)
    };
  }, [autobuses, paginaActual]);

  const formatearFechaHora = (fechaHora: string) => {
    try {
      return format(new Date(fechaHora), "dd/MM/yyyy HH:mm", { locale: es });
    } catch {
      return fechaHora;
    }
  };

  const handleAtenderAlerta = async (autobus: AutobusCapacidadCumplida) => {
    if (!puedeAtender) {
      toast({
        title: "Sin permisos",
        description: "No tiene permisos para atender alertas",
        variant: "destructive"
      });
      return;
    }

    const usuarioActual = obtenerUsuarioActual();
    const ahora = new Date().toISOString();
    
    const autobusActualizado = {
      ...autobus,
      atendido: true,
      atendidoPor: usuarioActual,
      fechaHoraAtencion: ahora
    };

    registrarAtencionAlerta(autobus.id, usuarioActual);
    onUpdateAutobus?.(autobusActualizado);
    
    toast({
      title: "Alerta atendida",
      description: `La alerta del autobús ${autobus.idAutobus} ha sido marcada como atendida`
    });
  };

  const irAPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const irAPaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  if (autobuses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Bus className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No se encontraron autobuses con capacidad cumplida que coincidan con los filtros aplicados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa de Transporte</TableHead>
                <TableHead>ID Autobús</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead className="text-center">Capacidad</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Ruta Asignada</TableHead>
                <TableHead>Conductor</TableHead>
                <TableHead>Código del Conductor</TableHead>
                <TableHead>Atendido Por</TableHead>
                <TableHead>Fecha Hora Atención</TableHead>
                <TableHead>Atendido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {autobusesVisibles.map((autobus) => (
                <TableRow key={autobus.id}>
                  <TableCell className="font-medium">
                    {autobus.empresaTransporte}
                  </TableCell>
                  <TableCell>{autobus.idAutobus}</TableCell>
                  <TableCell>{autobus.placa}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      <Users className="h-3 w-3" />
                      {autobus.capacidad}
                    </span>
                  </TableCell>
                  <TableCell>{formatearFechaHora(autobus.fechaHoraCumplimiento)}</TableCell>
                <TableCell>{autobus.rutaAsignada}</TableCell>
                <TableCell>{autobus.conductorAsignado}</TableCell>
                <TableCell>{autobus.codigoConductorAsignado}</TableCell>
                <TableCell>{autobus.atendidoPor || '-'}</TableCell>
                <TableCell>
                  {autobus.fechaHoraAtencion ? formatearFechaHora(autobus.fechaHoraAtencion) : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={autobus.atendido}
                      onCheckedChange={() => handleAtenderAlerta(autobus)}
                      disabled={autobus.atendido || !puedeAtender}
                    />
                    <span className={autobus.atendido ? "text-green-600" : "text-red-600"}>
                      {autobus.atendido ? "Sí" : "No"}
                    </span>
                  </div>
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Paginador */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between px-2 mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {((paginaActual - 1) * elementosPorPagina) + 1} a{' '}
              {Math.min(paginaActual * elementosPorPagina, autobuses.length)} de{' '}
              {autobuses.length} registros
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={irAPaginaAnterior}
                disabled={paginaActual <= 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">
                  Página {paginaActual} de {totalPaginas}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={irAPaginaSiguiente}
                disabled={paginaActual >= totalPaginas}
                className="flex items-center gap-1"
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

export default TablaCapacidadCumplida;