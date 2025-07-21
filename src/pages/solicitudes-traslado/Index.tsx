import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { SolicitudesTrasladoFilter } from '../../components/solicitudes-traslado/SolicitudesTrasladoFilter';
import { SolicitudesTrasladoTable } from '../../components/solicitudes-traslado/SolicitudesTrasladoTable';
import { SolicitudTrasladoFilter } from '../../types/solicitud-traslado';

export default function SolicitudesTrasladoIndex() {
  const [filters, setFilters] = useState<SolicitudTrasladoFilter>({});

  const handleFilter = (newFilters: SolicitudTrasladoFilter) => {
    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historial de Solicitudes de Traslado</h1>
          <p className="text-muted-foreground">
            Consulta y gestiona el historial completo de solicitudes de traslado entre empresas.
          </p>
        </div>

        <SolicitudesTrasladoFilter onFilter={handleFilter} />
        <SolicitudesTrasladoTable filters={filters} />
      </div>
    </Layout>
  );
}