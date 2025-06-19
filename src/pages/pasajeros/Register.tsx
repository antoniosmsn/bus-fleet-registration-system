
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PasajeroForm from '@/components/pasajeros/PasajeroForm';

const RegisterPasajero = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/pasajeros">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Pasajero</h1>
            <p className="text-gray-600">Complete la información del nuevo pasajero</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Pasajero</CardTitle>
          </CardHeader>
          <CardContent>
            <PasajeroForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPasajero;
