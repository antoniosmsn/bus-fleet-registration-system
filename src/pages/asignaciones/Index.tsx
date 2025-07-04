
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import AsignacionesFilter from '@/components/asignaciones/AsignacionesFilter';
import AsignacionesTable from '@/components/asignaciones/AsignacionesTable';
import { AsignacionRuta, AsignacionRutaFilter } from '@/types/asignacion-ruta';

import { mockAsignaciones } from '@/data/mockAsignaciones';

const AsignacionesIndex = () => {
  const [filtros, setFiltros] = useState<AsignacionRutaFilter>({});
  const [asignaciones, setAsignaciones] = useState<AsignacionRuta[]>(mockAsignaciones);

  const asignacionesFiltradas = useMemo(() => {
    return mockAsignaciones.filter(asignacion => {
      // Filtro por ramal
      if (filtros.ramal && !asignacion.ramal.toLowerCase().includes(filtros.ramal.toLowerCase())) {
        return false;
      }

      // Filtro por tipo de ruta
      if (filtros.tipoRuta && filtros.tipoRuta !== 'todos' && asignacion.tipoRuta !== filtros.tipoRuta) {
        return false;
      }

      // Filtro por empresa cliente
      if (filtros.empresaCliente && filtros.empresaCliente !== 'todas' && asignacion.empresaCliente !== filtros.empresaCliente) {
        return false;
      }

      // Filtro por empresa transporte
      if (filtros.empresaTransporte && filtros.empresaTransporte !== 'todas' && asignacion.empresaTransporte !== filtros.empresaTransporte) {
        return false;
      }

      // Filtro por tipo de unidad
      if (filtros.tipoUnidad && filtros.tipoUnidad !== 'todos' && asignacion.tipoUnidad !== filtros.tipoUnidad) {
        return false;
      }

      // Filtro por provincia
      if (filtros.provincia && filtros.provincia !== 'todas' && asignacion.provincia !== filtros.provincia) {
        return false;
      }

      // Filtro por cantón
      if (filtros.canton && filtros.canton !== 'todos' && asignacion.canton !== filtros.canton) {
        return false;
      }

      // Filtro por sector
      if (filtros.sector && filtros.sector !== 'todos' && asignacion.sector !== filtros.sector) {
        return false;
      }

      // Filtro por estado
      if (filtros.estado && filtros.estado !== 'ambos' && asignacion.estado !== filtros.estado) {
        return false;
      }

      // Filtro por fecha de inicio de vigencia
      if (filtros.habilitarFiltroFecha) {
        const fechaVigencia = new Date(asignacion.fechaInicioVigencia);
        
        if (filtros.fechaInicioVigenciaStart) {
          const fechaInicio = new Date(filtros.fechaInicioVigenciaStart);
          if (fechaVigencia < fechaInicio) {
            return false;
          }
        }
        
        if (filtros.fechaInicioVigenciaEnd) {
          const fechaFin = new Date(filtros.fechaInicioVigenciaEnd);
          if (fechaVigencia > fechaFin) {
            return false;
          }
        }
      }

      return true;
    });
  }, [filtros]);

  const handleFilter = (newFilters: any) => {
    setFiltros(newFilters);
    console.log('Filtros aplicados:', newFilters);
  };

  const handleChangeStatus = (id: number) => {
    setAsignaciones(prevAsignaciones => 
      prevAsignaciones.map(asignacion => 
        asignacion.id === id 
          ? { ...asignacion, estado: asignacion.estado === 'activo' ? 'inactivo' : 'activo' }
          : asignacion
      )
    );
    console.log('Cambiando estado de asignación:', id);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Asignaciones de Rutas</h1>
            
          </div>
          <Link 
            to="/asignaciones/register" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Registrar
          </Link>
        </div>
        
        <AsignacionesFilter onFilter={handleFilter} />
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 pb-0">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Asignaciones Registradas</h2>
              <p className="text-gray-600">
                {asignacionesFiltradas.length} asignaciones encontradas
              </p>
            </div>
          </div>
          <AsignacionesTable asignaciones={asignacionesFiltradas} onChangeStatus={handleChangeStatus} />
        </div>
      </div>
    </Layout>
  );
};

export default AsignacionesIndex;
