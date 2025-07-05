import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ServicioEditForm from '@/components/servicios/ServicioEditForm';

const EditServicio = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
            <p className="text-muted-foreground">ID de servicio no válido.</p>
            <Link to="/servicios">
              <Button className="mt-4">
                Volver a Servicios
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/servicios">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Servicio</h1>
            <p className="text-muted-foreground">Modificar los datos del servicio seleccionado</p>
          </div>
        </div>

        <ServicioEditForm servicioId={id} />
      </div>
    </Layout>
  );
};

export default EditServicio;