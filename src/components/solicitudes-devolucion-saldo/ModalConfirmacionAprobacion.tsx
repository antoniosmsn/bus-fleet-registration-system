import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { SolicitudDevolucionSaldo } from '@/types/solicitud-devolucion-saldo';
import { aprobarSolicitud, autorizarSolicitud } from '@/services/solicitudDevolucionService';
import { useToast } from '@/hooks/use-toast';

interface ModalConfirmacionAprobacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solicitud: SolicitudDevolucionSaldo;
  tipoAccion: 'aprobar' | 'autorizar';
  onConfirm: () => void;
}

export default function ModalConfirmacionAprobacion({ 
  open, 
  onOpenChange, 
  solicitud, 
  tipoAccion,
  onConfirm 
}: ModalConfirmacionAprobacionProps) {
  const { toast } = useToast();

  const handleConfirm = async () => {
    try {
      if (tipoAccion === 'aprobar') {
        await aprobarSolicitud(solicitud.id);
        toast({
          title: "Solicitud aprobada",
          description: `La solicitud ${solicitud.numeroDevolucion} ha sido aprobada correctamente.`
        });
      } else {
        const resultado = await autorizarSolicitud(solicitud.id);
        toast({
          title: "Solicitud autorizada",
          description: resultado.envioCorreo 
            ? `La solicitud ${solicitud.numeroDevolucion} ha sido autorizada y se ha enviado notificación al pasajero.`
            : `La solicitud ${solicitud.numeroDevolucion} ha sido autorizada correctamente.`
        });
      }
      onConfirm();
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo ${tipoAccion} la solicitud. Intente nuevamente.`,
        variant: "destructive"
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {tipoAccion === 'aprobar' ? 'Confirmar Aprobación' : 'Confirmar Autorización'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Desea {tipoAccion} la solicitud de devolución número {solicitud.numeroDevolucion} 
            por un monto de {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 2
            }).format(solicitud.monto)}?
            {tipoAccion === 'autorizar' && (
              <span className="block mt-2 text-sm">
                Al autorizar esta solicitud, se enviará automáticamente un correo de notificación al pasajero.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {tipoAccion === 'aprobar' ? 'Aprobar' : 'Autorizar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}