import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import PasajerosFilter from '@/components/pasajeros/PasajerosFilter';
import PasajerosTable from '@/components/pasajeros/PasajerosTable';
import PasajerosExport from '@/components/pasajeros/PasajerosExport';
import { Pasajero, PasajeroFilter } from '@/types/pasajero';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data para demostración
const mockPasajeros: Pasajero[] = [
  {
    id: 1,
    empresaCliente: "Cooperación Manufacturing Costa Rica Srl",
    cedula: "201190016",
    nombres: "Arían",
    primerApellido: "Ledezma",
    segundoApellido: "Fernández",
    correoElectronico: "aledronslfernandez@cooperacion.com",
    telefono: "8888-8888",
    tipoPago: "postpago",
    empresaSubcontratista: "Subcontratista ABC",
    tipoContrato: "directo",
    planilla: "mensual",
    limiteViajesSemana: 12,
    limiteDiario: 2,
    tipoSubsidio: "porcentual",
    subsidioPorcentual: 75,
    subsidioMonto: 0,
    numeroEmpleadoInterno: "950",
    badgeInterno: "950",
    tagResidencia: "Heredia, Centro",
    saldoPrepago: 0,
    saldoPostpago: 0,
    estado: "activo",
    solicitudRuta: false,
    fechaCreacion: "2024-01-10T08:30:00Z",
    usuarioCreacion: "admin@empresa.com",
    fechaModificacion: null,
    usuarioModificacion: null
  },
  {
    id: 2,
    empresaCliente: "Abbott Medical Srl B44",
    cedula: "206469948",
    nombres: "Ashly Dylana",
    primerApellido: "Pineda",
    segundoApellido: "Espinoza",
    correoElectronico: "pinedaespinozadylana@gmail.com",
    telefono: "7777-7777",
    tipoPago: "postpago",
    empresaSubcontratista: "Transportes Unidos",
    tipoContrato: "indirecto",
    planilla: "quincenal",
    limiteViajesSemana: 14,
    limiteDiario: "sin_limite",
    tipoSubsidio: "porcentual",
    subsidioPorcentual: 100,
    subsidioMonto: 0,
    numeroEmpleadoInterno: "12567289",
    badgeInterno: "12567289",
    tagResidencia: "San José, Centro",
    saldoPrepago: 0,
    saldoPostpago: 0,
    estado: "dado_de_baja",
    solicitudRuta: true,
    fechaCreacion: "2024-02-15T10:20:00Z",
    usuarioCreacion: "admin@empresa.com",
    fechaModificacion: "2024-03-10T14:30:00Z",
    usuarioModificacion: "supervisor@empresa.com"
  },
  {
    id: 3,
    empresaCliente: "Abbott Medical Srl B31",
    cedula: "402220966",
    nombres: "Jaxon",
    primerApellido: "Moreira",
    segundoApellido: "Arias",
    correoElectronico: "jaxonjesus.moreirajarias@abbott.com",
    telefono: "6666-6666",
    tipoPago: "postpago",
    empresaSubcontratista: "Express Lines",
    tipoContrato: "directo",
    planilla: "semanal",
    limiteViajesSemana: 10,
    limiteDiario: 2,
    tipoSubsidio: "porcentual",
    subsidioPorcentual: 100,
    subsidioMonto: 0,
    numeroEmpleadoInterno: "12264662",
    badgeInterno: "SAN BOSCO",
    tagResidencia: "Cartago, Central",
    saldoPrepago: 0,
    saldoPostpago: 0,
    estado: "activo",
    solicitudRuta: false,
    fechaCreacion: "2024-03-20T09:15:00Z",
    usuarioCreacion: "admin@empresa.com",
    fechaModificacion: null,
    usuarioModificacion: null
  }
];

const PasajerosIndex = () => {
  const [filtros, setFiltros] = useState<PasajeroFilter>({});
  const [pasajeros, setPasajeros] = useState<Pasajero[]>(mockPasajeros);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Changed from 2 to 5

  const pasajerosFiltrados = useMemo(() => {
    return pasajeros.filter(pasajero => {
      // Filtro por empresa cliente
      if (filtros.empresaCliente && !pasajero.empresaCliente.toLowerCase().includes(filtros.empresaCliente.toLowerCase())) {
        return false;
      }

      // Filtro por cédula
      if (filtros.cedula && !pasajero.cedula.includes(filtros.cedula)) {
        return false;
      }

      // Filtro por nombres
      if (filtros.nombres && !pasajero.nombres.toLowerCase().includes(filtros.nombres.toLowerCase())) {
        return false;
      }

      // Filtro por primer apellido
      if (filtros.primerApellido && !pasajero.primerApellido.toLowerCase().includes(filtros.primerApellido.toLowerCase())) {
        return false;
      }

      // Filtro por segundo apellido
      if (filtros.segundoApellido && !pasajero.segundoApellido.toLowerCase().includes(filtros.segundoApellido.toLowerCase())) {
        return false;
      }

      // Filtro por correo
      if (filtros.correo && !pasajero.correoElectronico.toLowerCase().includes(filtros.correo.toLowerCase())) {
        return false;
      }

      // Filtro por tipo de pago
      if (filtros.tipoPago && filtros.tipoPago !== 'todos' && pasajero.tipoPago !== filtros.tipoPago) {
        return false;
      }

      // Filtro por badge interno
      if (filtros.badgeInterno && pasajero.badgeInterno && !pasajero.badgeInterno.toLowerCase().includes(filtros.badgeInterno.toLowerCase())) {
        return false;
      }

      // Filtro por número de empleado
      if (filtros.numeroEmpleado && pasajero.numeroEmpleadoInterno && !pasajero.numeroEmpleadoInterno.includes(filtros.numeroEmpleado)) {
        return false;
      }

      // Filtro por estado
      if (filtros.estado && filtros.estado !== 'todos' && pasajero.estado !== filtros.estado) {
        return false;
      }

      // Filtro por solicitud de ruta
      if (filtros.solicitudRuta === true && !pasajero.solicitudRuta) {
        return false;
      }

      return true;
    });
  }, [pasajeros, filtros]);

  const totalPages = Math.ceil(pasajerosFiltrados.length / itemsPerPage);
  
  const pasajerosPaginados = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return pasajerosFiltrados.slice(startIndex, endIndex);
  }, [pasajerosFiltrados, currentPage]);

  const handleFilter = (newFilters: PasajeroFilter) => {
    setFiltros(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
    console.log('Filtros aplicados:', newFilters);
  };

  const handleChangeStatus = (id: number) => {
    setPasajeros(prevPasajeros => 
      prevPasajeros.map(pasajero => 
        pasajero.id === id 
          ? { 
              ...pasajero, 
              estado: pasajero.estado === 'activo' ? 'inactivo' : 'activo',
              fechaModificacion: new Date().toISOString(),
              usuarioModificacion: 'usuario.actual@sistema.com'
            }
          : pasajero
      )
    );
    console.log('Cambiando estado de pasajero:', id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuarios Pasajeros</h1>
            <p className="text-gray-600">Gestione los pasajeros registrados en el sistema</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/pasajeros/register">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Registrar
              </Button>
            </Link>
            <PasajerosExport pasajeros={pasajerosFiltrados} />
          </div>
        </div>
        
        <PasajerosFilter onFilter={handleFilter} />
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <PasajerosTable 
              pasajeros={pasajerosPaginados} 
              onChangeStatus={handleChangeStatus}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PasajerosIndex;
