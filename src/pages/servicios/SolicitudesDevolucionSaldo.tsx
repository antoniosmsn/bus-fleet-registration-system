import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SolicitudesDevolucionSaldoFilters from '@/components/solicitudes-devolucion-saldo/SolicitudesDevolucionSaldoFilters';
import SolicitudesDevolucionSaldoTable from '@/components/solicitudes-devolucion-saldo/SolicitudesDevolucionSaldoTable';
import { FiltrosSolicitudDevolucion } from '@/types/solicitud-devolucion-saldo';

export default function SolicitudesDevolucionSaldo() {
  const [filters, setFilters] = useState<FiltrosSolicitudDevolucion>({
    estadoDevolucion: 'todos',
    numeroDevolucion: '',
    cedulaPasajero: '',
    nombrePasajero: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const handleFilter = (newFilters: FiltrosSolicitudDevolucion) => {
    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Solicitudes de Devolución de Saldo</h1>
        </div>
        
        <SolicitudesDevolucionSaldoFilters onFilter={handleFilter} />
        
        <SolicitudesDevolucionSaldoTable filters={filters} />
      </div>
    </Layout>
  );
}