import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Route, Clock, Building, Check, ChevronsUpDown } from "lucide-react";
import { ServicioEmpresaTransporte, SentidoServicio, RutaDisponible } from "@/types/servicio-empresa-transporte";
import { mockRutasDisponibles } from "@/data/mockRutasDisponibles";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openRuta, setOpenRuta] = useState(false);
  const [openSentido, setOpenSentido] = useState(false);
  const { toast } = useToast();

  // Available routes - same pattern as working modal
  const rutasDisponibles = React.useMemo(() => {
    console.log('Modal abierto:', open);
    console.log('Servicio:', servicio);
    console.log('Total de rutas en mock:', mockRutasDisponibles.length);
    
    return mockRutasDisponibles;
  }, [servicio, open]);

  // Process routes for display - same pattern as working modal
  const rutasParaMostrar = React.useMemo(() => {
    console.log('Rutas disponibles:', rutasDisponibles);
    const rutas = rutasDisponibles.map((ruta) => ({
      ...ruta,
      displayName: `${ruta.nombre} (${ruta.codigo})`
    }));
    console.log('Rutas procesadas:', rutas);
    return rutas;
  }, [rutasDisponibles]);

  // Available directions for selected route
  const sentidosDisponibles = React.useMemo(() => {
    if (!rutaSeleccionada) return [];
    const ruta = rutasDisponibles.find(r => r.id === rutaSeleccionada);
    return ruta?.sentidosDisponibles || [];
  }, [rutaSeleccionada, rutasDisponibles]);

  // Set default values when modal opens
  React.useEffect(() => {
    if (open && rutasParaMostrar.length > 0 && !rutaSeleccionada) {
      setRutaSeleccionada(rutasParaMostrar[0].id);
    }
  }, [open, rutasParaMostrar.length, rutaSeleccionada]);

  // Reset sentido when ruta changes
  React.useEffect(() => {
    setSentidoSeleccionado("");
  }, [rutaSeleccionada]);

  const handleConfirmarSolicitud = async () => {
    if (!servicio || !rutaSeleccionada || !sentidoSeleccionado) {
      toast({
        title: "Datos incompletos",
        description: "Por favor seleccione la nueva ruta y sentido.",
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
      onOpenChange(false);
    }
  };

  if (!servicio) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Solicitar Cambio de Ruta
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Nueva Configuración */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nueva Configuración de Ruta</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nueva Ruta Selector - Using working pattern */}
              <div className="space-y-2">
                <Label htmlFor="nueva-ruta">Nueva Ruta <span className="text-destructive">*</span></Label>
                <Popover open={openRuta} onOpenChange={setOpenRuta}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openRuta}
                      className={cn(
                        "w-full justify-between",
                        !rutaSeleccionada && "border-destructive text-muted-foreground"
                      )}
                    >
                      {rutaSeleccionada
                        ? rutasParaMostrar.find((ruta) => ruta.id === rutaSeleccionada)?.displayName
                        : "Seleccionar nueva ruta..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" style={{zIndex: 999999}}>
                    <Command>
                      <CommandInput placeholder="Buscar ruta..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron rutas.</CommandEmpty>
                        <CommandGroup>
                          {rutasParaMostrar.length > 0 ? (
                            rutasParaMostrar.map((ruta) => (
                              <CommandItem
                                key={ruta.id}
                                value={ruta.displayName}
                                onSelect={() => {
                                  setRutaSeleccionada(ruta.id === rutaSeleccionada ? "" : ruta.id);
                                  setOpenRuta(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    rutaSeleccionada === ruta.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {ruta.displayName}
                              </CommandItem>
                            ))
                          ) : (
                            <CommandItem disabled>
                              No hay rutas disponibles
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Nuevo Sentido Selector - Using working pattern */}
              <div className="space-y-2">
                <Label htmlFor="nuevo-sentido">Nuevo Sentido <span className="text-destructive">*</span></Label>
                <Popover open={openSentido} onOpenChange={setOpenSentido}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSentido}
                      disabled={!rutaSeleccionada}
                      className={cn(
                        "w-full justify-between",
                        !sentidoSeleccionado && rutaSeleccionada && "border-destructive text-muted-foreground"
                      )}
                    >
                      {sentidoSeleccionado || "Seleccionar sentido..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" style={{zIndex: 999999}}>
                    <Command>
                      <CommandList>
                        <CommandEmpty>No se encontraron sentidos.</CommandEmpty>
                        <CommandGroup>
                          {sentidosDisponibles.length > 0 ? (
                            sentidosDisponibles.map((sentido) => (
                              <CommandItem
                                key={sentido}
                                value={sentido}
                                onSelect={() => {
                                  setSentidoSeleccionado(sentido === sentidoSeleccionado ? "" : sentido);
                                  setOpenSentido(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    sentidoSeleccionado === sentido ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <Badge variant={sentido === 'Ingreso' ? 'default' : 'secondary'}>
                                  {sentido}
                                </Badge>
                              </CommandItem>
                            ))
                          ) : (
                            <CommandItem disabled>
                              {!rutaSeleccionada ? "Seleccione una ruta primero" : "No hay sentidos disponibles"}
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

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
              disabled={!rutaSeleccionada || !sentidoSeleccionado || isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Confirmar Solicitud"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}