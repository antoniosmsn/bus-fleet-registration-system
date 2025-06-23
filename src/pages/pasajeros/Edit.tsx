
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PasajeroEditForm from '@/components/pasajeros/PasajeroEditForm';
import { Pasajero } from '@/types/pasajero';

const EditPasajero = () => {
  const { id } = useParams();
  const [pasajero, setPasajero] = useState<Pasajero | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  const mockPasajero: Pasajero = {
    id: parseInt(id || '1'),
    empresaCliente: 'Intel Corporation',
    cedula: '123456789',
    nombres: 'Juan Carlos',
    primerApellido: 'Rodríguez',
    segundoApellido: 'Pérez',
    correoElectronico: 'juan.rodriguez@email.com',
    telefono: '8888-8888',
    tipoPago: 'postpago',
    empresaSubcontratista: 'Transportes SA',
    tipoContrato: 'directo',
    planilla: 'mensual',
    limiteViajesSemana: 12,
    limiteDiario: 2,
    tipoSubsidio: 'porcentual',
    subsidioPorcentual: 50,
    subsidioMonto: 0,
    numeroEmpleadoInterno: 'EMP001',
    badgeInterno: 'BADGE001',
    tagResidencia: '9.7489,-83.7534',
    saldoPrepago: 0,
    saldoPostpago: 0,
    estado: 'activo',
    solicitudRuta: false,
    fechaCreacion: '2024-01-01',
    usuarioCreacion: 'admin',
    fechaModificacion: null,
    usuarioModificacion: null
  };

  useEffect(() => {
    // Simulate API call
    const fetchPasajero = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasajero(mockPasajero);
      setLoading(false);
    };

    fetchPasajero();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link to="/pasajeros">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Pasajero</h1>
              <p className="text-gray-600">Cargando información del pasajero...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!pasajero) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link to="/pasajeros">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pasajero no encontrado</h1>
              <p className="text-gray-600">El pasajero solicitado no existe</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/pasajeros">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Pasajero</h1>
            <p className="text-gray-600">
              Modificar información de {pasajero.nombres} {pasajero.primerApellido} {pasajero.segundoApellido}
            </p>
          </div>
        </div>

        <Card>
          <CardContent>
            <PasajeroEditForm pasajero={pasajero} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditPasajero;
