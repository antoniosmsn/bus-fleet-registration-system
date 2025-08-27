
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MantenimientoRegistrationForm } from '@/components/mantenimiento/MantenimientoRegistrationForm';
import { registrarAcceso } from '@/services/bitacoraService';
import { toast } from '@/hooks/use-toast';

export default function MantenimientoRegister() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registrar acceso al módulo
  useEffect(() => {
    registrarAcceso('REGISTRO_MANTENIMIENTO');
  }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Simular guardado
      console.log('Datos de mantenimiento a guardar:', data);
      
      // Simular delay de guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mantenimiento registrado",
        description: "El registro se ha guardado exitosamente",
      });
      
      // Preguntar si desea registrar otro
      const registrarOtro = window.confirm("¿Desea registrar otro mantenimiento?");
      if (!registrarOtro) {
        navigate('/mantenimiento');
      }
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo registrar el mantenimiento. Inténtelo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/mantenimiento');
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Registro de Mantenimiento de Vehículos</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo Registro de Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <MantenimientoRegistrationForm
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
