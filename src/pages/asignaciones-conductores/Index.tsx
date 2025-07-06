import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import AsignacionesConductoresFilter from '@/components/asignaciones-conductores/AsignacionesConductoresFilter';
import AsignacionesConductoresTable from '@/components/asignaciones-conductores/AsignacionesConductoresTable';
import AsignacionesConductoresPagination from '@/components/asignaciones-conductores/AsignacionesConductoresPagination';
import { Button } from '@/components/ui/button';
import { mockAsignacionesConductores, AsignacionConductor } from '@/data/mockAsignacionesConductores';

const AsignacionesConductoresIndex = () => {
  const [filtros, setFiltros] = useState({
    empresaCliente: '',
    transportista: '',
    tipoUnidad: '',
    horarioInicio: '00:00',
    horarioFin: '23:59',
    fechaInicio: '2020-01-01',
    fechaFin: '2030-12-31',
    ramal: '',
    turno: '',
    conductor: '',
    codigoConductor: '',
    estadoAsignacion: 'todos'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Aplicar filtros a los datos
  const asignacionesFiltradas = useMemo(() => {
    return mockAsignacionesConductores.filter(asignacion => {
      // Filtro por empresa cliente
      if (filtros.empresaCliente && !asignacion.empresaCliente.toLowerCase().includes(filtros.empresaCliente.toLowerCase())) {
        return false;
      }
      
      // Filtro por transportista
      if (filtros.transportista && !asignacion.empresaTransporte.toLowerCase().includes(filtros.transportista.toLowerCase())) {
        return false;
      }
      
      // Filtro por tipo de unidad
      if (filtros.tipoUnidad && filtros.tipoUnidad !== 'todos' && asignacion.tipoUnidad !== filtros.tipoUnidad) {
        return false;
      }
      
      // Filtro por horario (rango)
      if (filtros.horarioInicio && asignacion.horario < filtros.horarioInicio) {
        return false;
      }
      if (filtros.horarioFin && asignacion.horario > filtros.horarioFin) {
        return false;
      }
      
      // Filtro por fecha (rango)
      const fechaOperacion = new Date(asignacion.fechaOperacion);
      if (filtros.fechaInicio) {
        const fechaInicio = new Date(filtros.fechaInicio);
        if (fechaOperacion < fechaInicio) {
          return false;
        }
      }
      if (filtros.fechaFin) {
        const fechaFin = new Date(filtros.fechaFin);
        if (fechaOperacion > fechaFin) {
          return false;
        }
      }
      
      // Filtro por ramal
      if (filtros.ramal && !asignacion.ramal.toLowerCase().includes(filtros.ramal.toLowerCase())) {
        return false;
      }
      
      // Filtro por turno
      if (filtros.turno && !asignacion.turno.toLowerCase().includes(filtros.turno.toLowerCase())) {
        return false;
      }
      
      // Filtro por conductor (nombre o apellidos)
      if (filtros.conductor) {
        const conductorCompleto = `${asignacion.conductorNombre || ''} ${asignacion.conductorApellidos || ''}`.toLowerCase();
        if (!conductorCompleto.includes(filtros.conductor.toLowerCase())) {
          return false;
        }
      }
      
      // Filtro por código conductor
      if (filtros.codigoConductor && asignacion.codigoConductor !== filtros.codigoConductor) {
        return false;
      }
      
      // Filtro por estado de asignación
      if (filtros.estadoAsignacion !== 'todos') {
        const tieneAsignacion = !!(asignacion.conductorId && asignacion.conductorNombre);
        if (filtros.estadoAsignacion === 'asignado' && !tieneAsignacion) {
          return false;
        }
        if (filtros.estadoAsignacion === 'sin-asignar' && tieneAsignacion) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => a.horario.localeCompare(b.horario)); // Ordenar por horario ascendente
  }, [filtros]);

  // Paginación
  const totalPages = Math.ceil(asignacionesFiltradas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const asignacionesPaginadas = asignacionesFiltradas.slice(startIndex, startIndex + itemsPerPage);

  const handleFilter = (newFilters: any) => {
    setFiltros(newFilters);
    setCurrentPage(1); // Reset a la primera página cuando se aplican filtros
  };

  const handleEditAsignacion = (id: string) => {
    // TODO: Implementar navegación a edición de asignación
    console.log('Editar asignación:', id);
  };

  const handleAsignarConductor = () => {
    // TODO: Implementar navegación a asignación de conductor
    console.log('Asignar conductor');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Asignación de Conductores</h1>
            <p className="text-gray-600">
              Gestiona las asignaciones de conductores a servicios
            </p>
          </div>
          <Button 
            onClick={handleAsignarConductor}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Asignar Conductor
          </Button>
        </div>
        
        <AsignacionesConductoresFilter onFiltrosChange={handleFilter} filtros={filtros} />
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 pb-0">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Asignaciones de Conductores</h2>
              <p className="text-gray-600">
                {asignacionesFiltradas.length} asignaciones encontradas
              </p>
            </div>
          </div>
          
          <div className="px-6">
            <AsignacionesConductoresTable 
              asignaciones={asignacionesPaginadas}
              onEditAsignacion={handleEditAsignacion}
            />
          </div>
          
          <div className="p-6 pt-4">
            <AsignacionesConductoresPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={asignacionesFiltradas.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AsignacionesConductoresIndex;