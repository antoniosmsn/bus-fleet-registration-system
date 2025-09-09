import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { SolicitudDevolucionSaldo } from '@/types/solicitud-devolucion-saldo';

interface ModalVisualizarSolicitudProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solicitud: SolicitudDevolucionSaldo;
}

export default function ModalVisualizarSolicitud({ 
  open, 
  onOpenChange, 
  solicitud 
}: ModalVisualizarSolicitudProps) {
  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(monto);
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'pendiente_aprobacion':
        return 'secondary';
      case 'aprobada_pendiente_autorizacion':
        return 'default';
      case 'completamente_aprobada':
        return 'outline';
      case 'rechazada':
        return 'destructive';
      case 'procesada':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'pendiente_aprobacion':
        return 'Pendiente Aprobación';
      case 'aprobada_pendiente_autorizacion':
        return 'Pendiente Autorización';
      case 'completamente_aprobada':
        return 'Completamente Aprobada';
      case 'rechazada':
        return 'Rechazada';
      case 'procesada':
        return 'Procesada';
      default:
        return estado;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles de la Solicitud</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Usuario que ejecutó la acción
            </label>
            <p className="text-sm font-medium">
              {solicitud.aprobadoPor || solicitud.autorizadoPor || solicitud.rechazadoPor || 'Sin acción ejecutada'}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Fecha/hora (UTC)
            </label>
            <p className="text-sm font-medium">
              {solicitud.fechaAprobacion || solicitud.fechaAutorizacion || solicitud.fechaRechazo || 'Sin fecha registrada'}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Monto
            </label>
            <p className="text-sm font-medium">{formatMonto(solicitud.monto)}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Estado de la acción
            </label>
            <div className="mt-1">
              <Badge variant={getEstadoBadgeVariant(solicitud.estado)}>
                {getEstadoText(solicitud.estado)}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}