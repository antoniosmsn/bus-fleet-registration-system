import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoogleFormsBuilderV2 } from '@/components/plantillas-matriz/builder/GoogleFormsBuilderV2';
import { PlantillaBuilder as PlantillaBuilderType } from '@/types/plantilla-matriz';
import { getPlantillaMatrizById } from '@/data/mockPlantillasMatriz';
import { toast } from '@/hooks/use-toast';

export default function PlantillasMatrizEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [plantilla, setPlantilla] = useState<PlantillaBuilderType | null>(null);

  useEffect(() => {
    if (id) {
      const plantillaData = getPlantillaMatrizById(id);
      if (plantillaData) {
        // Convertir a formato builder
        const builderData: PlantillaBuilderType = {
          id: plantillaData.id,
          nombre: plantillaData.nombre,
          descripcion: plantillaData.descripcion,
          secciones: plantillaData.secciones.map(seccion => ({
            ...seccion,
            expanded: true
          }))
        };
        setPlantilla(builderData);
      } else {
        toast({
          title: "Error",
          description: "No se encontró la plantilla especificada",
          variant: "destructive"
        });
        navigate('/mantenimiento/plantillas-matriz');
      }
    }
  }, [id, navigate]);

  const handleSave = async (plantillaData: PlantillaBuilderType) => {
    setLoading(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Plantilla actualizada",
        description: `La plantilla "${plantillaData.nombre}" ha sido actualizada exitosamente.`
      });

      navigate('/mantenimiento/plantillas-matriz');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la plantilla. Inténtalo nuevamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/mantenimiento/plantillas-matriz');
  };

  if (!plantilla) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Cargando plantilla...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleFormsBuilderV2
      plantilla={plantilla}
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
    />
  );
}