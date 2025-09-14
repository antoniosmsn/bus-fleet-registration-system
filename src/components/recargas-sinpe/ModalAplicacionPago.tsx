import { useState, useEffect } from 'react';
import { Download, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nombreArchivo?: string;
}

export default function ModalAplicacionPago({ isOpen, onClose, nombreArchivo }: Props) {
  const [procesando, setProcesando] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setProcesando(true);
      const timer = setTimeout(() => {
        setProcesando(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDescargar = () => {
    toast.success('Descarga iniciada', {
      description: 'El archivo de aplicación de pago se está descargando...'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Aplicación de Pago
          </DialogTitle>
        </DialogHeader>

        <div className="py-8">
          {procesando ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Procesando archivo...</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Generando aplicación de pago para {nombreArchivo || 'el archivo seleccionado'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-green-800">¡Archivo generado con éxito!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  La aplicación de pago está lista para descargar
                </p>
              </div>
              <Button onClick={handleDescargar} className="gap-2">
                <Download className="h-4 w-4" />
                Descargar archivo
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}