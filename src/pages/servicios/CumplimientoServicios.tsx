import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import CumplimientoServiciosFilters from '@/components/cumplimiento-servicios/CumplimientoServiciosFilters';
import CumplimientoServiciosTable from '@/components/cumplimiento-servicios/CumplimientoServiciosTable';
import { FiltrosCumplimientoServicio } from '@/types/cumplimiento-servicio';

const CumplimientoServiciosPage = () => {
  const today = new Date().toISOString().split('T')[0];
  
  const [filtros, setFiltros] = useState<FiltrosCumplimientoServicio>({
    fechaInicio: today,
    fechaFin: today,
    autobus: [],
    numeroServicio: '',
    ramal: [],
    estadoServicio: [],
    cumplimientoServicio: [],
    empresaCliente: []
  });

  const aplicarFiltros = (nuevosFiltros: FiltrosCumplimientoServicio) => {
    setFiltros(nuevosFiltros);
  };

  return (
    <Layout>
      <div className="max-w-[95vw] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cumplimiento de Servicios</h1>
            <p className="text-muted-foreground">
              Contraste entre servicios planificados y servicios realizados
            </p>
          </div>
        </div>

        <CumplimientoServiciosFilters 
          filtros={filtros}
          onFiltrosChange={aplicarFiltros}
        />

        <CumplimientoServiciosTable filtros={filtros} />
      </div>
    </Layout>
  );
};

export default CumplimientoServiciosPage;