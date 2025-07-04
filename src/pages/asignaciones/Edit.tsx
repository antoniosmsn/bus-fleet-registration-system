
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AsignacionEditForm from '@/components/asignaciones/AsignacionEditForm';

const EditAsignacion = () => {
  const { id } = useParams();
  const asignacionId = parseInt(id || '0', 10);

  return (
    <Layout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Editar Asignación de Ruta</h1>
          <p className="text-gray-500">ID: {id}</p>
        </div>
        
        <AsignacionEditForm asignacionId={asignacionId} />
      </div>
    </Layout>
  );
};

export default EditAsignacion;
