import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, X, ArrowRight, AlertTriangle } from 'lucide-react';
import { SolicitudAprobacion } from '@/types/solicitud-aprobacion';
import { formatShortDate } from '@/lib/dateUtils';
import { toast } from '@/hooks/use-toast';
import { aprobarSolicitud, rechazarSolicitud } from '@/services/solicitudAprobacionService';

interface ModalAprobacionSolicitudProps {
  solicitud: SolicitudAprobacion | null;
  isOpen: boolean;
  onClose: () => void;
  onAprobacionComplete: () => void;
}

export function ModalAprobacionSolicitud({
  solicitud,
  isOpen,
  onClose,
  onAprobacionComplete
}: ModalAprobacionSolicitudProps) {
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
      await aprobarSolicitud(solicitud.id);
      toast({
        title: "Solicitud Aprobada",
        description: "La solicitud de cambio de ruta ha sido aprobada exitosamente.",
      });
      onAprobacionComplete();
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
      await rechazarSolicitud(solicitud.id, motivoRechazo);
      toast({
        title: "Solicitud Rechazada",
        description: "La solicitud de cambio de ruta ha sido rechazada.",
      });
      onAprobacionComplete();
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
          {/* Detalles del Servicio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">N° Servicio</Label>
                  <p className="font-medium">{solicitud.numeroServicio}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Fecha Servicio</Label>
                  <p>{formatShortDate(solicitud.fechaServicio)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Placa Autobús</Label>
                  <Badge variant="secondary">{solicitud.placaAutobus}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ID Autobús</Label>
                  <Badge variant="outline">{solicitud.idAutobus}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Empresa de Transporte</Label>
                <p>{solicitud.empresaTransporte}</p>
              </div>
              
              <Separator className="my-4" />
              
              {/* Cambio de Ruta en Detalles del Servicio */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Cambio de Ruta Solicitado</Label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <span className="font-medium">{solicitud.rutaOriginal.nombre}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {solicitud.rutaOriginal.sentido}
                    </Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <span className="font-medium">{solicitud.rutaNueva.nombre}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
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
                  {procesando ? 'Procesando...' : 'Confirmar Rechazo'}
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