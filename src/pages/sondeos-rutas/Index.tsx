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
  const [filters, setFilters] = useState<SondeoRutaFilter>({
    estado: 'todos'
  });

  const sondeosFiltrados = mockSondeosRutas.filter((sondeo) => {
    if (filters.titulo && !sondeo.titulo.toLowerCase().includes(filters.titulo.toLowerCase())) {
      return false;
    }
    if (filters.estado && filters.estado !== 'todos' && sondeo.estado !== filters.estado) {
      return false;
    }
    if (filters.turno && !sondeo.turnosObjetivo.includes(filters.turno)) {
      return false;
    }
    if (filters.fechaPublicacionStart) {
      const fechaPublicacion = new Date(sondeo.fechaPublicacion);
      const fechaFiltro = new Date(filters.fechaPublicacionStart);
      if (fechaPublicacion < fechaFiltro) {
        return false;
      }
    }
    return true;
  });

  const handleView = (sondeo: SondeoRuta) => {
    toast.info(`Visualizando sondeo: ${sondeo.titulo}`);
    // TODO: Implementar vista de detalles
  };

  const handleEdit = (sondeo: SondeoRuta) => {
    toast.info(`Editando sondeo: ${sondeo.titulo}`);
    navigate(`/sondeos-rutas/editar/${sondeo.id}`);
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
            onView={handleView}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SondeosRutasListado;
