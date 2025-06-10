
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const EditAsignacion = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Editar Asignación de Ruta</h1>
          <p className="text-gray-500">Edite la asignación de ruta ID: {id}</p>
        </div>
        
        <div className="bg-white rounded-md shadow p-6">
          <p className="text-center text-muted-foreground">
            Formulario de edición de asignación en desarrollo...
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default EditAsignacion;
