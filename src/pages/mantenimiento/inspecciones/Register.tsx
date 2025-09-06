import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { InspeccionRegistrationForm } from '@/components/inspecciones/InspeccionRegistrationForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { InspeccionRegistro } from '@/types/inspeccion-autobus';
import { mockPlantillasInspeccion } from '@/data/mockPlantillasInspeccion';
import { mockConductores } from '@/data/mockConductores';
import { mockAutobuses } from '@/data/mockAutobuses';
import { getNextConsecutivo } from '@/data/mockInspeccionesAutobus';
import { registrarAcceso } from '@/services/bitacoraService';
import { toast } from '@/hooks/use-toast';

export default function InspeccionesRegister() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPDFDialog, setShowPDFDialog] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<InspeccionRegistro | null>(null);
  const [generatedConsecutivo, setGeneratedConsecutivo] = useState<number | null>(null);

  useEffect(() => {
    registrarAcceso('REGISTRO_INSPECCIONES_AUTOBUS');
  }, []);

  const handleSubmit = async (data: InspeccionRegistro) => {
    setPendingSubmission(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmission = async () => {
    if (!pendingSubmission) return;

    setIsSubmitting(true);
    setShowConfirmDialog(false);

    try {
      // Simular procesamiento de la inspección
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generar consecutivo
      const consecutivo = getNextConsecutivo();
      setGeneratedConsecutivo(consecutivo);

      // Simular registro en base de datos
      console.log('Inspección registrada:', {
        consecutivo,
        ...pendingSubmission,
        fechaCreacion: new Date().toISOString(),
        usuarioCreacion: 'admin@sistema.com'
      });

      toast({
        title: "Inspección completada",
        description: `Inspección ${consecutivo} registrada exitosamente`,
      });

      setShowPDFDialog(true);
    } catch (error) {
      toast({
        title: "Error al procesar inspección",
        description: "Hubo un problema al registrar la inspección. Inténtelo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    // Simular descarga de PDF
    toast({
      title: "Descargando PDF",
      description: `Generando PDF de inspección ${generatedConsecutivo}...`,
    });
    
    // Simular envío por correo
    setTimeout(() => {
      toast({
        title: "Correo enviado",
        description: "El PDF ha sido enviado automáticamente al administrador de zona",
      });
    }, 1500);

    handleFinalizarProceso();
  };

  const handleStorePDFOnly = () => {
    // Simular almacenamiento sin descarga
    toast({
      title: "PDF almacenado",
      description: `Inspección ${generatedConsecutivo} guardada en el sistema`,
    });

    // Simular envío por correo
    setTimeout(() => {
      toast({
        title: "Correo enviado",
        description: "El PDF ha sido enviado automáticamente al administrador de zona",
      });
    }, 1000);

    handleFinalizarProceso();
  };

  const handleFinalizarProceso = () => {
    setShowPDFDialog(false);
    setPendingSubmission(null);
    setGeneratedConsecutivo(null);
    
    // Preguntar si desea registrar otra inspección
    setTimeout(() => {
      const registrarOtra = confirm('¿Desea registrar otra inspección?');
      if (registrarOtra) {
        // Recargar página para limpiar formulario
        window.location.reload();
      } else {
        navigate('/mantenimiento/inspecciones');
      }
    }, 500);
  };

  const handleCancel = () => {
    navigate('/mantenimiento/inspecciones');
  };

  const plantillasActivas = mockPlantillasInspeccion.filter(p => p.activa);

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Registro de Inspección de Autobús</h1>
            <p className="text-muted-foreground">Complete la información para realizar una nueva inspección</p>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Importante:</strong> Asegúrese de completar todos los campos obligatorios de la matriz de inspección. 
            Al finalizar se generará automáticamente un PDF que será enviado por correo al administrador de zona.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Nueva Inspección</CardTitle>
            <CardDescription>
              Seleccione la plantilla de inspección y complete la información del vehículo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InspeccionRegistrationForm
              plantillas={plantillasActivas}
              conductores={mockConductores}
              autobuses={mockAutobuses}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmación */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Inspección</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea finalizar esta inspección? 
              Se generará un PDF con todos los datos ingresados y se almacenará en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmission}>
              Sí, finalizar inspección
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de opciones de PDF */}
      <AlertDialog open={showPDFDialog} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inspección Completada</AlertDialogTitle>
            <AlertDialogDescription>
              La inspección {generatedConsecutivo} ha sido registrada exitosamente. 
              ¿Desea descargar el PDF ahora o solo almacenarlo en el sistema?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStorePDFOnly}>
              Solo almacenar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDownloadPDF}>
              Descargar PDF
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}