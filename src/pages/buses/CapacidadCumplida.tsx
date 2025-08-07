import React, { useState, useMemo } from 'react';
import Layout from "@/components/layout/Layout";
import FiltrosCapacidadCumplida from "@/components/autobuses-capacidad/FiltrosCapacidadCumplida";
import TablaCapacidadCumplida from "@/components/autobuses-capacidad/TablaCapacidadCumplida";
import ExportCapacidadCumplida from "@/components/autobuses-capacidad/ExportCapacidadCumplida";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAutobusesCapacidadCumplida } from "@/data/mockAutobusesCapacidadCumplida";
import { FiltrosCapacidadCumplida as TipoFiltros } from "@/types/autobus-capacidad-cumplida";
import { Users, TrendingUp } from "lucide-react";

const CapacidadCumplida: React.FC = () => {
  const [filtros, setFiltros] = useState<TipoFiltros>({});

  const autobusesFiltrados = useMemo(() => {
    return mockAutobusesCapacidadCumplida.filter(autobus => {
      // Filtro por empresa de transporte
      if (filtros.empresaTransporte && 
          !autobus.empresaTransporte.toLowerCase().includes(filtros.empresaTransporte.toLowerCase())) {
        return false;
      }

      // Filtro por ID del autobús
      if (filtros.idAutobus && 
          !autobus.idAutobus.toLowerCase().includes(filtros.idAutobus.toLowerCase())) {
        return false;
      }

      // Filtro por placa
      if (filtros.placa && 
          !autobus.placa.toLowerCase().includes(filtros.placa.toLowerCase())) {
        return false;
      }

      // Filtro por ruta
      if (filtros.ruta && 
          !autobus.rutaAsignada.toLowerCase().includes(filtros.ruta.toLowerCase())) {
        return false;
      }

      // Filtro por conductor
      if (filtros.conductor && 
          !autobus.conductorAsignado.toLowerCase().includes(filtros.conductor.toLowerCase())) {
        return false;
      }

      // Filtro por código del conductor
      if (filtros.codigoConductor && 
          !autobus.codigoConductorAsignado.toLowerCase().includes(filtros.codigoConductor.toLowerCase())) {
        return false;
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
          fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día
          if (fechaCumplimiento > fechaFin) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Ordenar por empresa de transporte, fecha/hora y ID del autobús
      if (a.empresaTransporte !== b.empresaTransporte) {
        return a.empresaTransporte.localeCompare(b.empresaTransporte);
      }
      if (a.fechaHoraCumplimiento !== b.fechaHoraCumplimiento) {
        return new Date(b.fechaHoraCumplimiento).getTime() - new Date(a.fechaHoraCumplimiento).getTime();
      }
      return a.idAutobus.localeCompare(b.idAutobus);
    });
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: TipoFiltros) => {
    setFiltros(nuevosFiltros);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({});
  };

  const totalCapacidad = autobusesFiltrados.reduce((sum, autobus) => sum + autobus.capacidad, 0);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        </div>

        {/* Filtros */}
        <FiltrosCapacidadCumplida
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          onLimpiarFiltros={handleLimpiarFiltros}
        />

        {/* Tabla */}
        <TablaCapacidadCumplida autobuses={autobusesFiltrados} />
      </div>
    </Layout>
  );
};

export default CapacidadCumplida;