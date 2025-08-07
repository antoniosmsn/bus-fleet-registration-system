import React, { useState, useMemo, useEffect } from 'react';
import Layout from "@/components/layout/Layout";
import FiltrosCapacidadCumplida from "@/components/autobuses-capacidad/FiltrosCapacidadCumplida";
import TablaCapacidadCumplida from "@/components/autobuses-capacidad/TablaCapacidadCumplida";
import ExportCapacidadCumplida from "@/components/autobuses-capacidad/ExportCapacidadCumplida";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAutobusesCapacidadCumplida } from "@/data/mockAutobusesCapacidadCumplida";
import { FiltrosCapacidadCumplida as TipoFiltros, AutobusCapacidadCumplida } from "@/types/autobus-capacidad-cumplida";
import { verificarPermisoAcceso } from '@/services/permisosService';
import { registrarAcceso } from '@/services/bitacoraService';
import { Users, TrendingUp, AlertTriangle } from "lucide-react";

const CapacidadCumplida: React.FC = () => {
  const [filtros, setFiltros] = useState<TipoFiltros>({ estadoAtencion: 'todos' });
  const [autobuses, setAutobuses] = useState<AutobusCapacidadCumplida[]>(mockAutobusesCapacidadCumplida);
  const [tienePermisos, setTienePermisos] = useState<boolean>(false);

  useEffect(() => {
    const permisos = verificarPermisoAcceso();
    setTienePermisos(permisos);
    
    if (permisos) {
      registrarAcceso('CAPACIDAD_CUMPLIDA');
    }
  }, []);

  const autobusesFiltrados = useMemo(() => {
    return autobuses.filter(autobus => {
      // Filtrar solo unidades activas
      if (!autobus.activo) return false;

      // Filtro por empresa de transporte
      if (filtros.empresaTransporte && filtros.empresaTransporte !== 'all' &&
          autobus.empresaTransporte !== filtros.empresaTransporte) {
        return false;
      }

      // Filtro por ID del autobús (coincidencia exacta)
      if (filtros.idAutobus && autobus.idAutobus !== filtros.idAutobus) {
        return false;
      }

      // Filtro por placa (coincidencia parcial)
      if (filtros.placa && 
          !autobus.placa.toLowerCase().includes(filtros.placa.toLowerCase())) {
        return false;
      }

      // Filtro por ruta
      if (filtros.ruta && filtros.ruta !== 'all' && autobus.rutaAsignada !== filtros.ruta) {
        return false;
      }

      // Filtro por conductor (coincidencia parcial)
      if (filtros.conductor && 
          !autobus.conductorAsignado.toLowerCase().includes(filtros.conductor.toLowerCase())) {
        return false;
      }

      // Filtro por código del conductor (coincidencia exacta)
      if (filtros.codigoConductor && autobus.codigoConductorAsignado !== filtros.codigoConductor) {
        return false;
      }

      // Filtro por estado de atención
      if (filtros.estadoAtencion && filtros.estadoAtencion !== 'todos') {
        const atendido = filtros.estadoAtencion === 'si';
        if (autobus.atendido !== atendido) {
          return false;
        }
      }

      // Filtro por fecha
      if (filtros.fechaInicio || filtros.fechaFin) {
        const fechaCumplimiento = new Date(autobus.fechaHoraCumplimiento);
        
        if (filtros.fechaInicio) {
          const fechaInicio = new Date(filtros.fechaInicio);
          if (fechaCumplimiento < fechaInicio) return false;
        }
        
        if (filtros.fechaFin) {
          const fechaFin = new Date(filtros.fechaFin);
          fechaFin.setHours(23, 59, 59, 999);
          if (fechaCumplimiento > fechaFin) return false;
        }
      }

      // Filtro por hora
      if (filtros.horaInicio || filtros.horaFin) {
        const fechaCumplimiento = new Date(autobus.fechaHoraCumplimiento);
        const horaActual = fechaCumplimiento.getHours().toString().padStart(2, '0') + ':' + 
                          fechaCumplimiento.getMinutes().toString().padStart(2, '0');
        
        if (filtros.horaInicio && horaActual < filtros.horaInicio) {
          return false;
        }
        
        if (filtros.horaFin && horaActual > filtros.horaFin) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Ordenar por empresa de transporte, fecha/hora y ID del autobús
      if (a.empresaTransporte !== b.empresaTransporte) {
        return a.empresaTransporte.localeCompare(b.empresaTransporte);
      }
      if (a.fechaHoraCumplimiento !== b.fechaHoraCumplimiento) {
        return new Date(a.fechaHoraCumplimiento).getTime() - new Date(b.fechaHoraCumplimiento).getTime();
      }
      return a.idAutobus.localeCompare(b.idAutobus);
    });
  }, [autobuses, filtros]);

  const handleFiltrosChange = (nuevosFiltros: TipoFiltros) => {
    setFiltros(nuevosFiltros);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({ estadoAtencion: 'todos' });
  };

  const handleUpdateAutobus = (autobusActualizado: AutobusCapacidadCumplida) => {
    setAutobuses(prev => 
      prev.map(autobus => 
        autobus.id === autobusActualizado.id ? autobusActualizado : autobus
      )
    );
  };

  if (!tienePermisos) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center space-y-4 p-8">
              <AlertTriangle className="h-16 w-16 text-yellow-500" />
              <h2 className="text-xl font-semibold text-center">Sin permisos de acceso</h2>
              <p className="text-muted-foreground text-center">
                No tiene permisos para acceder al listado de autobuses con capacidad cumplida.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const totalCapacidad = autobusesFiltrados.reduce((sum, autobus) => sum + autobus.capacidad, 0);
  const alertasNoAtendidas = autobusesFiltrados.filter(autobus => !autobus.atendido).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Autobuses con Capacidad Cumplida</h1>
          </div>
          <ExportCapacidadCumplida autobuses={autobusesFiltrados} />
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Autobuses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{autobusesFiltrados.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas No Atendidas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{alertasNoAtendidas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacidad Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCapacidad}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <FiltrosCapacidadCumplida
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          onLimpiarFiltros={handleLimpiarFiltros}
        />

        {/* Tabla */}
        <TablaCapacidadCumplida 
          autobuses={autobusesFiltrados} 
          onUpdateAutobus={handleUpdateAutobus}
        />
      </div>
    </Layout>
  );
};

export default CapacidadCumplida;