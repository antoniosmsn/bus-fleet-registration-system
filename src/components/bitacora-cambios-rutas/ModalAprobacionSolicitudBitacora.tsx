import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ArrowRight, AlertTriangle } from 'lucide-react';
import { SolicitudAprobacion } from '@/types/solicitud-aprobacion';
import { toast } from '@/hooks/use-toast';
import { aprobarSolicitudBitacora, rechazarSolicitudBitacora } from '@/services/bitacoraSolicitudService';

interface ModalAprobacionSolicitudBitacoraProps {
  solicitud: SolicitudAprobacion | null;
  isOpen: boolean;
  onClose: () => void;
  onAprobacionComplete: (esAprobada: boolean) => void;
}

export function ModalAprobacionSolicitudBitacora({
  solicitud,
  isOpen,
  onClose,
  onAprobacionComplete
}: ModalAprobacionSolicitudBitacoraProps) {
  const [accionSeleccionada, setAccionSeleccionada] = useState<'aprobar' | 'rechazar' | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [procesando, setProcesando] = useState(false);

  if (!solicitud) return null;

  const resetModal = () => {
    setAccionSeleccionada(null);
    setMotivoRechazo('');
    setProcesando(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleAprobar = async () => {
    if (accionSeleccionada !== 'aprobar') {
      setAccionSeleccionada('aprobar');
      return;
    }

    setProcesando(true);
    try {
      await aprobarSolicitudBitacora(solicitud.id);
      toast({
        title: "Solicitud Aprobada",
        description: "La solicitud de cambio de ruta ha sido aprobada exitosamente.",
      });
      onAprobacionComplete(true);
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar la solicitud. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setProcesando(false);
    }
  };

  const handleRechazar = async () => {
    if (accionSeleccionada !== 'rechazar') {
      setAccionSeleccionada('rechazar');
      return;
    }

    if (!motivoRechazo.trim()) {
      toast({
        title: "Error",
        description: "El motivo de rechazo es obligatorio.",
        variant: "destructive",
      });
      return;
    }

    setProcesando(true);
    try {
      await rechazarSolicitudBitacora(solicitud.id, motivoRechazo);
      toast({
        title: "Solicitud Rechazada",
        description: "La solicitud de cambio de ruta ha sido rechazada.",
      });
      onAprobacionComplete(false);
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la solicitud. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setProcesando(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Aprobación de Solicitud de Cambio de Ruta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cambio de Ruta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cambio de Ruta Solicitado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ruta Original</Label>
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                    <span className="font-medium text-lg">{solicitud.rutaOriginal.nombre}</span>
                    <Badge variant="outline" className="ml-2">
                      {solicitud.rutaOriginal.sentido}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ruta Solicitada</Label>
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                    <span className="font-medium text-lg">{solicitud.rutaNueva.nombre}</span>
                    <Badge variant="outline" className="ml-2">
                      {solicitud.rutaNueva.sentido}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pregunta de Aprobación */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">¿Desea aprobar o rechazar la solicitud pendiente?</h3>
                
                {accionSeleccionada === 'rechazar' && (
                  <div className="max-w-md mx-auto space-y-2">
                    <Label htmlFor="motivoRechazo">Motivo del Rechazo (Obligatorio)</Label>
                    <Textarea
                      id="motivoRechazo"
                      placeholder="Ingrese el motivo del rechazo..."
                      value={motivoRechazo}
                      onChange={(e) => setMotivoRechazo(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-center gap-4 pt-4">
            {accionSeleccionada === 'aprobar' ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setAccionSeleccionada(null)}
                  disabled={procesando}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAprobar}
                  disabled={procesando}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {procesando ? 'Procesando...' : 'Confirmar Aprobación'}
                </Button>
              </div>
            ) : accionSeleccionada === 'rechazar' ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setAccionSeleccionada(null)}
                  disabled={procesando}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRechazar}
                  disabled={procesando}
                >
                  <X className="h-4 w-4 mr-2" />
                  {procesando ? 'Procesando..' : 'Confirmar Rechazo'}
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button
                  onClick={handleAprobar}
                  disabled={procesando}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Aprobar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRechazar}
                  disabled={procesando}
                  size="lg"
                >
                  <X className="h-4 w-4 mr-2" />
                  Rechazar
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}