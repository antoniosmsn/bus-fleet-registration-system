import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AsignacionConductorForm from '@/components/asignaciones-conductores/AsignacionConductorForm';
const AsignarConductor = () => {
  return <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/asignaciones-conductores">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Asignar Conductores a Servicios</h1>
            
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <AsignacionConductorForm />
          </CardContent>
        </Card>
      </div>
    </Layout>;
};
export default AsignarConductor;