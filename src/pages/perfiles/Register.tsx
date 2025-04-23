
import React from 'react';
import Layout from "@/components/layout/Layout";
import { PerfilForm } from "@/components/perfiles/PerfilForm";

const RegisterPerfil = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Registrar Nuevo Perfil</h1>
          <p className="text-gray-600">Complete el formulario para crear un nuevo perfil</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
          <PerfilForm />
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPerfil;
