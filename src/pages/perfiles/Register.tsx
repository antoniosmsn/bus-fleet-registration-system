
import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { PerfilForm } from "@/components/perfiles/PerfilForm";
import type { Profile } from '@/types/profile';

const RegisterPerfil = () => {
  const location = useLocation();
  const perfilToEdit = location.state?.perfil as Profile | undefined;
  const isEditing = !!perfilToEdit;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Editar Perfil' : 'Registrar Nuevo Perfil'}
          </h1>
          <p className="text-gray-600">
            {isEditing 
              ? 'Actualice los datos del perfil'
              : 'Complete el formulario para crear un nuevo perfil'
            }
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
          <PerfilForm initialData={perfilToEdit} />
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPerfil;
