import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CumplimientoServicioData } from '@/types/cumplimiento-servicio';
import { SentidoRuta } from '@/types/cambio-ruta';
import { mockRamales } from '@/data/mockRamales';
import { registrarAcceso } from '@/services/bitacoraService';

interface CambioRutaModalProps {
  servicio: CumplimientoServicioData | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ConfirmacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmacionModal: React.FC<ConfirmacionModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Confirmar Cambio de Ruta</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <p className="text-sm text-muted-foreground">
          ¿Está seguro de que desea realizar el cambio de ruta?
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Procesando...' : 'Confirmar'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const CambioRutaModal: React.FC<CambioRutaModalProps> = ({ servicio, isOpen, onClose }) => {
  const [nuevaRutaId, setNuevaRutaId] = useState<string>('');
  const [sentidoSeleccionado, setSentidoSeleccionado] = useState<SentidoRuta>('ingreso');
  const [openRuta, setOpenRuta] = useState(false);
  const [openSentido, setOpenSentido] = useState(false);
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Filter available routes by transport company, fallback to all routes if none found
  const rutasDisponibles = React.useMemo(() => {
    console.log('Modal abierto:', isOpen);
    console.log('Servicio:', servicio);
    console.log('Total de ramales en mock:', mockRamales.length);
    
    // Por ahora mostrar siempre las primeras 10 rutas para testing
    const rutasParaMostrar = mockRamales.slice(0, 10);
    console.log('Rutas que se van a mostrar:', rutasParaMostrar);
    
    return rutasParaMostrar;
  }, [servicio, isOpen]);

  // Get unique route names for the selector (showing routes with service number)
  const rutasUnicas = React.useMemo(() => {
    console.log('Rutas disponibles:', rutasDisponibles);
    const rutasUnicasMap = new Map();
    
    rutasDisponibles.forEach((ruta) => {
      if (!rutasUnicasMap.has(ruta.nombre)) {
        rutasUnicasMap.set(ruta.nombre, {
          ...ruta,
          displayName: `${ruta.nombre} (${servicio?.numeroServicio || 'S-001'})`
        });
      }
    });
    
    const rutas = Array.from(rutasUnicasMap.values());
    console.log('Rutas únicas procesadas:', rutas);
    return rutas;
  }, [rutasDisponibles, servicio?.numeroServicio]);

  const opcionesSentido = [
    { value: 'ingreso' as SentidoRuta, label: 'Ingreso' },
    { value: 'salida' as SentidoRuta, label: 'Salida' }
  ];

  // Set default route when modal opens
  React.useEffect(() => {
    if (isOpen && rutasUnicas.length > 0 && !nuevaRutaId) {
      setNuevaRutaId(rutasUnicas[0].id);
    }
  }, [isOpen, rutasUnicas.length, nuevaRutaId]);

  if (!servicio) return null;

  const handleSolicitarCambio = () => {
    // Validate required fields
    if (!nuevaRutaId) {
      toast({
        title: "Error",
        description: "Debe seleccionar una ruta",
        variant: "destructive",
      });
      return;
    }

    const rutaSeleccionada = rutasUnicas.find(r => r.id === nuevaRutaId);
    if (!rutaSeleccionada) {
      toast({
        title: "Error",
        description: "Ruta no válida",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation modal
    setShowConfirmacion(true);
  };

  const handleConfirmarCambio = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate random success/error for demo purposes
      const success = Math.random() > 0.2; // 80% success rate

      if (success) {
        const rutaSeleccionada = rutasUnicas.find(r => r.id === nuevaRutaId);
        
        // Log the change request to bitácora
        registrarAcceso('CAMBIO_RUTA', {
          servicioId: servicio!.id,
          numeroServicio: servicio!.numeroServicio,
          rutaOriginal: servicio!.ramal,
          rutaNueva: rutaSeleccionada?.nombre,
          sentidoNuevo: sentidoSeleccionado,
          empresaTransporte: servicio!.empresaTransporte,
          autobus: servicio!.autobus,
          usuario: 'Usuario actual' // In real implementation, get from auth context
        });

        toast({
          title: "Éxito",
          description: "Cambio de ruta solicitado exitosamente",
          variant: "default",
        });

        // Reset form and close modals
        setNuevaRutaId('');
        setSentidoSeleccionado('ingreso');
        setShowConfirmacion(false);
        onClose();
      } else {
        throw new Error('Error simulado del servidor');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo realizar la solicitud de cambio de ruta",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNuevaRutaId('');
    setSentidoSeleccionado('ingreso');
    setOpenRuta(false);
    setOpenSentido(false);
    setShowConfirmacion(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambio de Ruta</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current service info */}
            <div className="bg-muted p-3 rounded-lg space-y-2">
              <h4 className="text-sm font-medium">Información Actual</h4>
              <div className="text-sm text-muted-foreground">
                <p><strong>Ruta:</strong> {servicio.ramal}</p>
                <p><strong>Autobús:</strong> {servicio.autobus}</p>
                <p><strong>Empresa Transporte:</strong> {servicio.empresaTransporte}</p>
                <p><strong>Sentido:</strong> Ingreso</p>
                <p><strong>Servicio:</strong> {servicio.numeroServicio}</p>
              </div>
            </div>

            {/* Nueva ruta selector */}
            <div className="space-y-2">
              <Label htmlFor="nueva-ruta">Ruta <span className="text-destructive">*</span></Label>
              <Popover open={openRuta} onOpenChange={setOpenRuta}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openRuta}
                    className={cn(
                      "w-full justify-between",
                      !nuevaRutaId && "border-destructive text-muted-foreground"
                    )}
                  >
                    {nuevaRutaId
                      ? rutasUnicas.find((ruta) => ruta.id === nuevaRutaId)?.displayName
                      : "Seleccionar ruta..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" style={{zIndex: 999999}}>
                  <Command>
                    <CommandInput placeholder="Buscar ruta..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron rutas.</CommandEmpty>
                      <CommandGroup>
                        {rutasUnicas.length > 0 ? (
                          rutasUnicas.map((ruta) => (
                            <CommandItem
                              key={ruta.id}
                              value={ruta.displayName}
                              onSelect={() => {
                                setNuevaRutaId(ruta.id === nuevaRutaId ? "" : ruta.id);
                                setOpenRuta(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  nuevaRutaId === ruta.id ? "opacity-100" : "opacity-0"
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

            {/* Sentido selector */}
            <div className="space-y-2">
              <Label htmlFor="sentido">Sentido <span className="text-destructive">*</span></Label>
              <Popover open={openSentido} onOpenChange={setOpenSentido}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSentido}
                    className="w-full justify-between"
                  >
                    {opcionesSentido.find((opcion) => opcion.value === sentidoSeleccionado)?.label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" style={{zIndex: 999999}}>
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {opcionesSentido.map((opcion) => (
                          <CommandItem
                            key={opcion.value}
                            value={opcion.label}
                            onSelect={() => {
                              setSentidoSeleccionado(opcion.value);
                              setOpenSentido(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                sentidoSeleccionado === opcion.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {opcion.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSolicitarCambio} 
              disabled={!nuevaRutaId}
            >
              Solicitar Cambio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmacionModal
        isOpen={showConfirmacion}
        onClose={() => setShowConfirmacion(false)}
        onConfirm={handleConfirmarCambio}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default CambioRutaModal;