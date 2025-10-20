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

  const sondeosFiltrados = mockSondeosRutas.filter((sondeo) => {
    // Filtrar solo publicados según HU
    if (filters.estado !== 'todos' && sondeo.estado !== filters.estado) {
      return false;
    }

    // Filtro por título español
    if (filters.tituloEs && 
        !sondeo.tituloEs.toLowerCase().includes(filters.tituloEs.toLowerCase())) {
      return false;
    }

    // Filtro por título inglés
    if (filters.tituloEn && 
        !sondeo.tituloEn.toLowerCase().includes(filters.tituloEn.toLowerCase())) {
      return false;
    }

    // Filtro por mensaje español
    if (filters.mensajeEs && 
        !sondeo.mensajeEs.toLowerCase().includes(filters.mensajeEs.toLowerCase())) {
      return false;
    }

    // Filtro por mensaje inglés
    if (filters.mensajeEn && 
        !sondeo.mensajeEn.toLowerCase().includes(filters.mensajeEn.toLowerCase())) {
      return false;
    }

    // Filtro por usuario creador
    if (filters.usuarioCreacion && 
        !sondeo.usuarioCreacion.toLowerCase().includes(filters.usuarioCreacion.toLowerCase())) {
      return false;
    }

    // Filtro por turnos
    if (filters.turnos && filters.turnos.length > 0) {
      const hasMatchingTurno = sondeo.turnosObjetivo.some(turno => 
        filters.turnos?.includes(turno)
      );
      if (!hasMatchingTurno) {
        return false;
      }
    }

    // Filtro por rango de fechas
    if (filters.fechaPublicacionStart) {
      const fechaPublicacion = new Date(sondeo.fechaPublicacion);
      const fechaInicio = new Date(filters.fechaPublicacionStart);
      fechaInicio.setHours(0, 0, 0, 0);
      if (fechaPublicacion < fechaInicio) {
        return false;
      }
    }

    if (filters.fechaPublicacionEnd) {
      const fechaPublicacion = new Date(sondeo.fechaPublicacion);
      const fechaFin = new Date(filters.fechaPublicacionEnd);
      fechaFin.setHours(23, 59, 59, 999);
      if (fechaPublicacion > fechaFin) {
        return false;
      }
    }

    return true;
  });

  // Validación de rango de fechas (máximo 30 días)
  const validateDateRange = () => {
    if (filters.fechaPublicacionStart && filters.fechaPublicacionEnd) {
      const inicio = new Date(filters.fechaPublicacionStart);
      const fin = new Date(filters.fechaPublicacionEnd);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 30) {
        toast.error("El rango máximo de fechas permitido es de 1 mes.");
        return false;
      }
      
      if (inicio > fin) {
        toast.error("Debe seleccionar una fecha de inicio y fin válidas.");
        return false;
      }
    }
    return true;
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

        <SondeosRutasFilter filters={filters} onFilterChange={setFilters} />

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
