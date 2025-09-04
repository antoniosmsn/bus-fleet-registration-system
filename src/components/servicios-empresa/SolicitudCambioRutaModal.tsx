import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Route, Clock, Building } from "lucide-react";
import { ServicioEmpresaTransporte, SentidoServicio, RutaDisponible } from "@/types/servicio-empresa-transporte";
import { mockRutasDisponibles } from "@/data/mockRutasDisponibles";
import { useToast } from "@/hooks/use-toast";

interface SolicitudCambioRutaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servicio: ServicioEmpresaTransporte | null;
  onConfirmarSolicitud?: (solicitud: any) => void;
}

export default function SolicitudCambioRutaModal({
  open,
  onOpenChange,
  servicio,
  onConfirmarSolicitud
}: SolicitudCambioRutaModalProps) {
  const [rutaSeleccionada, setRutaSeleccionada] = useState<string>("");
  const [sentidoSeleccionado, setSentidoSeleccionado] = useState<SentidoServicio | "">("");
  const [motivo, setMotivo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Filter available routes (in real implementation, filter by empresa and zona franca)
  const rutasDisponibles = mockRutasDisponibles;

  const rutaActual = rutasDisponibles.find(ruta => ruta.nombre.includes(servicio?.ramal || ""));

  const handleRutaChange = (rutaId: string) => {
    setRutaSeleccionada(rutaId);
    setSentidoSeleccionado(""); // Reset sentido when route changes
  };

  const getSentidosDisponibles = (): SentidoServicio[] => {
    if (!rutaSeleccionada) return [];
    const ruta = rutasDisponibles.find(r => r.id === rutaSeleccionada);
    return ruta?.sentidosDisponibles || [];
  };

  const handleConfirmarSolicitud = async () => {
    if (!servicio || !rutaSeleccionada || !sentidoSeleccionado || !motivo.trim()) {
      toast({
        title: "Datos incompletos",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const solicitud = {
        servicioId: servicio.id,
        rutaActual: servicio.ramal,
        rutaNueva: rutasDisponibles.find(r => r.id === rutaSeleccionada)?.nombre,
        sentidoActual: servicio.sentido,
        sentidoNuevo: sentidoSeleccionado,
        motivo: motivo.trim(),
        fechaSolicitud: new Date().toISOString(),
      };

      if (onConfirmarSolicitud) {
        onConfirmarSolicitud(solicitud);
      }

      toast({
        title: "Solicitud enviada",
        description: "La solicitud de cambio de ruta ha sido enviada correctamente y está pendiente de aprobación.",
      });

      // Reset form
      setRutaSeleccionada("");
      setSentidoSeleccionado("");
      setMotivo("");
      onOpenChange(false);

    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar la solicitud. Inténtelo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRutaSeleccionada("");
      setSentidoSeleccionado("");
      setMotivo("");
      onOpenChange(false);
    }
  };

  if (!servicio) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Solicitar Cambio de Ruta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Servicio Actual */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4" />
                Información del Servicio Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Transportista:</span>
                  <p className="font-medium">{servicio.transportista}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo de Ruta:</span>
                  <p className="font-medium">{servicio.tipoRuta}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ramal Actual:</span>
                  <p className="font-medium">{servicio.ramal}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fecha del Servicio:</span>
                  <p className="font-medium">{servicio.fechaServicio}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Hora del Servicio:</span>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {servicio.horaServicio}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sentido Actual:</span>
                  <Badge variant={servicio.sentido === 'Ingreso' ? 'default' : 'secondary'}>
                    {servicio.sentido}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Placa:</span>
                  <p className="font-mono font-medium">{servicio.placaAutobus}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cliente:</span>
                  <p className="font-medium">{servicio.cliente}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Nueva Configuración */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nueva Configuración de Ruta</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nueva-ruta">Nueva Ruta *</Label>
                <Select onValueChange={handleRutaChange} value={rutaSeleccionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nueva ruta" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background border">
                    {rutasDisponibles.map((ruta) => (
                      <SelectItem key={ruta.id} value={ruta.id}>
                        <div>
                          <div className="font-medium">{ruta.nombre}</div>
                          <div className="text-xs text-muted-foreground">{ruta.codigo}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nuevo-sentido">Nuevo Sentido *</Label>
                <Select 
                  onValueChange={(value) => setSentidoSeleccionado(value as SentidoServicio)} 
                  value={sentidoSeleccionado}
                  disabled={!rutaSeleccionada}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sentido" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background border">
                    {getSentidosDisponibles().map((sentido) => (
                      <SelectItem key={sentido} value={sentido}>
                        <Badge variant={sentido === 'Ingreso' ? 'default' : 'secondary'}>
                          {sentido}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo del Cambio *</Label>
              <Textarea
                id="motivo"
                placeholder="Describa el motivo para solicitar el cambio de ruta..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {motivo.length}/500 caracteres
              </p>
            </div>
          </div>

          {/* Resumen del Cambio */}
          {rutaSeleccionada && sentidoSeleccionado && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Resumen del Cambio Solicitado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ruta actual:</span>
                    <p className="font-medium">{servicio.ramal}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nueva ruta:</span>
                    <p className="font-medium text-primary">
                      {rutasDisponibles.find(r => r.id === rutaSeleccionada)?.nombre}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sentido actual:</span>
                    <Badge variant={servicio.sentido === 'Ingreso' ? 'default' : 'secondary'}>
                      {servicio.sentido}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nuevo sentido:</span>
                    <Badge variant={sentidoSeleccionado === 'Ingreso' ? 'default' : 'secondary'}>
                      {sentidoSeleccionado}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmarSolicitud}
              disabled={!rutaSeleccionada || !sentidoSeleccionado || !motivo.trim() || isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Confirmar Solicitud"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}