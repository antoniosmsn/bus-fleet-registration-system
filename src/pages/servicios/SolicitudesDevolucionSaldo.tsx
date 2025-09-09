import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SolicitudesDevolucionSaldoFilters from '@/components/solicitudes-devolucion-saldo/SolicitudesDevolucionSaldoFilters';
import SolicitudesDevolucionSaldoTable from '@/components/solicitudes-devolucion-saldo/SolicitudesDevolucionSaldoTable';
import { FiltrosSolicitudDevolucion } from '@/types/solicitud-devolucion-saldo';
import { Toaster } from '@/components/ui/toaster';

export default function SolicitudesDevolucionSaldo() {
  const [filters, setFilters] = useState<FiltrosSolicitudDevolucion>({
    estadoDevolucion: 'todos',
    numeroDevolucion: '',
    cedulaPasajero: '',
    nombrePasajero: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const handleFilter = (newFilters: FiltrosSolicitudDevolucion) => {
    setFilters(newFilters);
  };

  const handleSolicitudUpdate = () => {
    // Forzar re-render de la tabla para simular actualización de datos
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Solicitudes de Devolución de Saldo</h1>
          <p className="text-muted-foreground mt-2">
            Gestione las solicitudes de devolución de saldo de los pasajeros
          </p>
        </div>
        
        <SolicitudesDevolucionSaldoFilters onFilter={handleFilter} />
        
        <SolicitudesDevolucionSaldoTable 
          key={refreshKey}
          filters={filters} 
          onSolicitudUpdate={handleSolicitudUpdate}
        />
      </div>
      <Toaster />
    </Layout>
  );
}