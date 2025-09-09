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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Número de solicitud
              </label>
              <p className="text-sm font-medium">{solicitud.numeroDevolucion}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Monto solicitado
              </label>
              <p className="text-sm font-medium">{formatMonto(solicitud.monto)}</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Estado actual
            </label>
            <div className="mt-1">
              <Badge variant={getEstadoBadgeVariant(solicitud.estado)}>
                {getEstadoText(solicitud.estado)}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Pasajero
            </label>
            <p className="text-sm">{solicitud.nombrePasajero} - {solicitud.cedulaPasajero}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Motivo de devolución
            </label>
            <p className="text-sm">{solicitud.motivoDevolucion}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Fecha de solicitud
            </label>
            <p className="text-sm">{solicitud.fechaSolicitud}</p>
          </div>

          {solicitud.aprobadoPor && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Aprobado por
              </label>
              <p className="text-sm">{solicitud.aprobadoPor} - {solicitud.fechaAprobacion}</p>
            </div>
          )}

          {solicitud.autorizadoPor && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Autorizado por
              </label>
              <p className="text-sm">{solicitud.autorizadoPor} - {solicitud.fechaAutorizacion}</p>
            </div>
          )}

          {solicitud.rechazadoPor && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Rechazado por
              </label>
              <p className="text-sm">{solicitud.rechazadoPor} - {solicitud.fechaRechazo}</p>
              {solicitud.motivoRechazo && (
                <p className="text-sm text-destructive mt-1">
                  Motivo: {solicitud.motivoRechazo}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}