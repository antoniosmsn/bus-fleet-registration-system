
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiciosIndex = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Servicios de Transporte</h1>
            <p className="text-gray-600">
              Gestión de servicios de transporte registrados en el sistema
            </p>
          </div>
          <Link to="/servicios/register">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Servicio
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No hay servicios registrados</p>
              <p className="text-sm">Utilice el botón "Registrar Servicio" para comenzar</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ServiciosIndex;
