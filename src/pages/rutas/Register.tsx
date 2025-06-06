
import React from 'react';
import Layout from '@/components/layout/Layout';
import RutaRegistrationForm from '@/components/rutas/RutaRegistrationForm';

const RegisterRuta = () => {
  return (
    <Layout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Registrar Nueva Ruta</h1>
        </div>
        
        <RutaRegistrationForm />
      </div>
    </Layout>
  );
};

export default RegisterRuta;
