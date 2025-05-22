
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import RutaRegistrationForm from '@/components/rutas/RutaRegistrationForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const RegisterRuta = () => {
  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Registrar Nueva Ruta</h1>
            <p className="text-gray-500">Complete el formulario para registrar una nueva ruta en el sistema</p>
          </div>
          <Link to="/rutas">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a Rutas
            </Button>
          </Link>
        </div>
        
        <RutaRegistrationForm />
      </div>
    </Layout>
  );
};

export default RegisterRuta;
