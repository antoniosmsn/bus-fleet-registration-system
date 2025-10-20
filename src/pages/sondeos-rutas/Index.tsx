import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SondeosRutasFilter } from "@/components/sondeos-rutas/SondeosRutasFilter";
import { SondeosRutasTable } from "@/components/sondeos-rutas/SondeosRutasTable";
import { mockSondeosRutas } from "@/data/mockSondeosRutas";
import { SondeoRuta, SondeoRutaFilter } from "@/types/sondeo-ruta";
import { toast } from "sonner";

const SondeosRutasListado = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  
  const [filters, setFilters] = useState<SondeoRutaFilter>({
    estado: 'publicado',
    fechaPublicacionStart: today,
    fechaPublicacionEnd: today,
    turnos: []
  });

  const [appliedFilters, setAppliedFilters] = useState<SondeoRutaFilter>({
    estado: 'publicado',
    fechaPublicacionStart: today,
    fechaPublicacionEnd: today,
    turnos: []
  });

  const sondeosFiltrados = mockSondeosRutas.filter((sondeo) => {
    // Filtrar solo publicados según HU
    if (appliedFilters.estado !== 'todos' && sondeo.estado !== appliedFilters.estado) {
      return false;
    }

    // Filtro por título español
    if (appliedFilters.tituloEs && 
        !sondeo.tituloEs.toLowerCase().includes(appliedFilters.tituloEs.toLowerCase())) {
      return false;
    }

    // Filtro por título inglés
    if (appliedFilters.tituloEn && 
        !sondeo.tituloEn.toLowerCase().includes(appliedFilters.tituloEn.toLowerCase())) {
      return false;
    }

    // Filtro por mensaje español
    if (appliedFilters.mensajeEs && 
        !sondeo.mensajeEs.toLowerCase().includes(appliedFilters.mensajeEs.toLowerCase())) {
      return false;
    }

    // Filtro por mensaje inglés
    if (appliedFilters.mensajeEn && 
        !sondeo.mensajeEn.toLowerCase().includes(appliedFilters.mensajeEn.toLowerCase())) {
      return false;
    }

    // Filtro por usuario creador
    if (appliedFilters.usuarioCreacion && 
        !sondeo.usuarioCreacion.toLowerCase().includes(appliedFilters.usuarioCreacion.toLowerCase())) {
      return false;
    }

    // Filtro por turnos
    if (appliedFilters.turnos && appliedFilters.turnos.length > 0) {
      const hasMatchingTurno = sondeo.turnosObjetivo.some(turno => 
        appliedFilters.turnos?.includes(turno)
      );
      if (!hasMatchingTurno) {
        return false;
      }
    }

    // Filtro por rango de fechas
    if (appliedFilters.fechaPublicacionStart) {
      const fechaPublicacion = new Date(sondeo.fechaPublicacion);
      const fechaInicio = new Date(appliedFilters.fechaPublicacionStart);
      fechaInicio.setHours(0, 0, 0, 0);
      if (fechaPublicacion < fechaInicio) {
        return false;
      }
    }

    if (appliedFilters.fechaPublicacionEnd) {
      const fechaPublicacion = new Date(sondeo.fechaPublicacion);
      const fechaFin = new Date(appliedFilters.fechaPublicacionEnd);
      fechaFin.setHours(23, 59, 59, 999);
      if (fechaPublicacion > fechaFin) {
        return false;
      }
    }

    return true;
  });

  const handleSearch = () => {
    // Validación de rango de fechas (máximo 30 días)
    if (filters.fechaPublicacionStart && filters.fechaPublicacionEnd) {
      const inicio = new Date(filters.fechaPublicacionStart);
      const fin = new Date(filters.fechaPublicacionEnd);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 30) {
        toast.error("El rango máximo de fechas permitido es de 1 mes.");
        return;
      }
      
      if (inicio > fin) {
        toast.error("Debe seleccionar una fecha de inicio y fin válidas.");
        return;
      }
    }
    
    setAppliedFilters(filters);
    toast.success("Filtros aplicados correctamente");
  };

  const handleClearFilters = () => {
    const defaultFilters: SondeoRutaFilter = {
      estado: 'publicado',
      fechaPublicacionStart: today,
      fechaPublicacionEnd: today,
      turnos: []
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    toast.success("Filtros limpiados");
  };

  const handleViewEncuesta = (sondeo: SondeoRuta) => {
    navigate(`/sondeos-rutas/detalle/${sondeo.id}`);
  };

  const handleViewResultados = (sondeo: SondeoRuta) => {
    navigate(`/sondeos-rutas/resultados/${sondeo.id}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sondeos de Rutas Nuevas</h1>
            <p className="text-muted-foreground mt-1">
              Gestión de encuestas y sondeos para evaluar nuevas rutas
            </p>
          </div>
          <Button onClick={() => navigate('/sondeos-rutas/registro')}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Sondeo de Ruta
          </Button>
        </div>

        <SondeosRutasFilter 
          filters={filters} 
          onFilterChange={setFilters}
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Mostrando {sondeosFiltrados.length} de {mockSondeosRutas.length} sondeos
            </p>
          </div>

          <SondeosRutasTable
            sondeos={sondeosFiltrados}
            onViewEncuesta={handleViewEncuesta}
            onViewResultados={handleViewResultados}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SondeosRutasListado;
