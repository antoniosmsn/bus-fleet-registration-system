import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import BitacoraCambiosRutasFilters from '@/components/bitacora-cambios-rutas/BitacoraCambiosRutasFilters';
import BitacoraCambiosRutasTable from '@/components/bitacora-cambios-rutas/BitacoraCambiosRutasTable';
import { BitacoraCambioRutaFilter } from '@/types/bitacora-cambio-ruta';

const BitacoraCambiosRutasPage = () => {
  const today = new Date().toISOString().split('T')[0];
  
  const [filtros, setFiltros] = useState<BitacoraCambioRutaFilter>({
    rutaOriginal: 'todos',
    rutaFinal: 'todos',
    usuario: '',
    fechaCambioInicio: today,
    fechaCambioFin: today,
    fechaServicioInicio: today,
    fechaServicioFin: today,
    numeroServicio: '',
    empresaTransporte: 'todos',
    autobus: 'todos',
    estado: 'todos'
  });

  const aplicarFiltros = (nuevosFiltros: BitacoraCambioRutaFilter) => {
    setFiltros(nuevosFiltros);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bitácoras Cambios de Rutas</h1>
            <p className="text-muted-foreground">
              Consulte el historial de modificaciones realizadas sobre los servicios y verifique los impactos asociados
            </p>
          </div>
        </div>

        <BitacoraCambiosRutasFilters 
          filtros={filtros}
          onFiltrosChange={aplicarFiltros}
        />

        <BitacoraCambiosRutasTable filtros={filtros} />
      </div>
    </Layout>
  );
};

export default BitacoraCambiosRutasPage;