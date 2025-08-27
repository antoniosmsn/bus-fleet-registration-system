import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { MantenimientoEditForm } from '@/components/mantenimiento/MantenimientoEditForm';
import { mockMantenimientos } from '@/data/mockMantenimientos';
import { MantenimientoRecord } from '@/types/mantenimiento';
import { toast } from '@/hooks/use-toast';
import { registrarAcceso } from '@/services/bitacoraService';

export default function MantenimientoEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mantenimiento, setMantenimiento] = useState<MantenimientoRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registrarAcceso('MANTENIMIENTO_EDICION');
  }, []);

  useEffect(() => {
    // Simular carga de datos del mantenimiento
    const loadMantenimiento = () => {
      if (id) {
        const found = mockMantenimientos.find(m => m.id === id);
        if (found) {
          setMantenimiento(found);
        } else {
          toast({
            title: "Error",
            description: "Mantenimiento no encontrado",
            variant: "destructive",
          });
          navigate('/mantenimiento');
        }
      }
      setLoading(false);
    };

    loadMantenimiento();
  }, [id, navigate]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Simular validación de duplicados
      const isDuplicate = mockMantenimientos.some(m => 
        m.id !== id &&
        m.placa === data.placa &&
        m.fechaMantenimiento === data.fechaMantenimiento &&
        m.categoria.id === data.categoriaId &&
        m.transportista.id === data.transportistaId
      );

      if (isDuplicate) {
        toast({
          title: "Error de duplicidad",
          description: "Ya existe un mantenimiento con los mismos datos",
          variant: "destructive",
        });
        return;
      }

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Éxito",
        description: "Mantenimiento actualizado correctamente",
      });

      navigate('/mantenimiento');
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el mantenimiento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/mantenimiento');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!mantenimiento) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-muted-foreground">Mantenimiento no encontrado</p>
            <Button onClick={() => navigate('/mantenimiento')} className="mt-4">
              Volver al listado
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </Button>
            <h1 className="text-2xl font-bold">Editar Mantenimiento de Vehículo</h1>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <MantenimientoEditForm
              mantenimiento={mantenimiento}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}