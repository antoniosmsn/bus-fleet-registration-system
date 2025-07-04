
import React from 'react';
import Layout from '@/components/layout/Layout';
import AsignacionRegistrationForm from '@/components/asignaciones/AsignacionRegistrationForm';

const RegisterAsignacion = () => {
  return (
    <Layout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Registrar Nueva Asignación de Ruta</h1>
          <p className="text-gray-500">Registre una nueva asignación de ruta en el sistema</p>
        </div>
        
        <AsignacionRegistrationForm />
      </div>
    </Layout>
  );
};

export default RegisterAsignacion;
