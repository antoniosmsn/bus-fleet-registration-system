
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiciosFilter from '@/components/servicios/ServiciosFilter';
import ServiciosTable from '@/components/servicios/ServiciosTable';

const ServiciosIndex = () => {
  const [filtros, setFiltros] = useState({
    empresaCliente: '',
    transportista: '',
    tipoUnidad: '',
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
    horarioInicio: '00:00',
    horarioFin: '23:59',
    ramal: '',
    tipoRuta: '',
    sentido: '',
    turno: '',
    estado: ''
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const serviciosPorPagina = 10;

  // Mock data - replace with actual API call
  const servicios = [
    {
      id: 1,
      empresaTransporte: 'Transportes San José S.A.',
      tipoUnidad: 'Bus',
      turno: 'Mañana',
      ramal: 'San José - Cartago',
      tipoRuta: 'Pública',
      tarifaPasajero: 570,
      tarifaServicio: 11400,
      empresaCliente: '-',
      sentido: 'Ingreso',
      horario: '06:00',
      numeroServicio: 'SV-001',
      estado: 'Activo',
      fechaCreacion: '2025-06-26',
      fechaModificacion: '2025-06-26',
      usuarioCreacion: 'admin@sistema.com',
      usuarioModificacion: 'admin@sistema.com'
    },
    {
      id: 2,
      empresaTransporte: 'Autobuses del Valle',
      tipoUnidad: 'Buseta',
      turno: 'Tarde',
      ramal: 'Zona Franca Intel',
      tipoRuta: 'Privada',
      tarifaPasajero: 850,
      tarifaServicio: 17000,
      empresaCliente: 'Intel Corporation',
      sentido: 'Salida',
      horario: '17:30',
      numeroServicio: 'SV-002',
      estado: 'Activo',
      fechaCreacion: '2025-06-25',
      fechaModificacion: '2025-06-26',
      usuarioCreacion: 'operator@sistema.com',
      usuarioModificacion: 'admin@sistema.com'
    }
  ];

  const aplicarFiltros = (nuevosFiltros: any) => {
    setFiltros(nuevosFiltros);
    setPaginaActual(1);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Servicios de Transporte</h1>
            <p className="text-gray-600">
              Gestión y visualización de servicios de transporte registrados
            </p>
          </div>
          <Link to="/servicios/register">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Servicio
            </Button>
          </Link>
        </div>

        <ServiciosFilter 
          filtros={filtros}
          onFiltrosChange={aplicarFiltros}
        />

        <Card>
          <CardHeader>
            <CardTitle>Lista de Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiciosTable filters={filtros} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ServiciosIndex;
