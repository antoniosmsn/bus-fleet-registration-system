import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SolicitudDevolucionSaldo } from '@/types/solicitud-devolucion-saldo';
import { rechazarSolicitud } from '@/services/solicitudDevolucionService';
import { useToast } from '@/hooks/use-toast';

interface ModalConfirmacionRechazoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solicitud: SolicitudDevolucionSaldo;
  onConfirm: () => void;
}

export default function ModalConfirmacionRechazo({ 
  open, 
  onOpenChange, 
  solicitud,
  onConfirm 
}: ModalConfirmacionRechazoProps) {
  const { toast } = useToast();
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!motivoRechazo.trim()) {
      toast({
        title: "Motivo requerido",
        description: "Debe proporcionar un motivo para rechazar la solicitud.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await rechazarSolicitud(solicitud.id, motivoRechazo);
      toast({
        title: "Solicitud rechazada",
        description: `La solicitud ${solicitud.numeroDevolucion} ha sido rechazada correctamente.`
      });
      setMotivoRechazo('');
      onConfirm();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la solicitud. Intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMotivoRechazo('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rechazar Solicitud</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Está a punto de rechazar la solicitud de devolución número{' '}
            <span className="font-medium">{solicitud.numeroDevolucion}</span> por un monto de{' '}
            <span className="font-medium">
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 2
              }).format(solicitud.monto)}
            </span>.
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivoRechazo">Motivo del rechazo *</Label>
            <Textarea
              id="motivoRechazo"
              placeholder="Ingrese el motivo por el cual rechaza esta solicitud..."
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              rows={4}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={loading || !motivoRechazo.trim()}
          >
            {loading ? 'Procesando...' : 'Rechazar Solicitud'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}