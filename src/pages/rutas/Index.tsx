
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const RutasIndex = () => {
  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Rutas</h1>
            <p className="text-gray-500">Gestione las rutas del sistema de transporte</p>
          </div>
          <Link to="/rutas/register">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Ruta
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-md shadow p-6">
          <div className="text-center py-10">
            <p className="text-muted-foreground">No hay rutas registradas. Haga clic en "Nueva Ruta" para comenzar.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RutasIndex;
