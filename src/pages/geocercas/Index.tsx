
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const GeocercasIndex = () => {
  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Geocercas</h1>
            <p className="text-gray-500">Administre las geocercas asociadas a zonas francas</p>
          </div>
          <Link to="/geocercas/crear">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Geocerca
            </Button>
          </Link>
        </div>

        {/* Placeholder for geocercas list/table */}
        <div className="bg-white rounded-md shadow p-6">
          <div className="text-center p-8 text-gray-500">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold">No hay geocercas registradas</h3>
            <p className="mt-1">Comience creando una nueva geocerca para esta zona franca.</p>
            <div className="mt-6">
              <Link to="/geocercas/crear">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Geocerca
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GeocercasIndex;
