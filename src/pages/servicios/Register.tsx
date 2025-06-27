
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicioRegistrationForm from '@/components/servicios/ServicioRegistrationForm';

const RegisterServicio = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/servicios">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registro de Servicios</h1>
            <p className="text-gray-600">
              Registrar múltiples servicios de transporte para un transportista
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <ServicioRegistrationForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterServicio;
