import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleFormsBuilderV2 } from '@/components/plantillas-matriz/builder/GoogleFormsBuilderV2';
import { PlantillaBuilder as PlantillaBuilderType } from '@/types/plantilla-matriz';
import { getProximoIdentificador } from '@/data/mockPlantillasMatriz';
import { toast } from '@/hooks/use-toast';

export default function PlantillasMatrizRegisterV2() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = async (plantilla: PlantillaBuilderType) => {
    setLoading(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const nuevaPlantilla = {
        ...plantilla,
        id: `plantilla-${Date.now()}`,
        identificador: getProximoIdentificador(),
        activa: true,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        usuarioCreacion: 'Usuario Actual'
      };

      toast({
        title: "Plantilla creada",
        description: `La plantilla "${plantilla.nombre}" ha sido creada exitosamente con ID ${nuevaPlantilla.identificador}.`
      });

      navigate('/mantenimiento/plantillas-matriz');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la plantilla. Inténtalo nuevamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/mantenimiento/plantillas-matriz');
  };

  return (
    <GoogleFormsBuilderV2
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
    />
  );
}