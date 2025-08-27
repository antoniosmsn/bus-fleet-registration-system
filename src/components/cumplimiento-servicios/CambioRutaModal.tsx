import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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

const CambioRutaModal: React.FC<CambioRutaModalProps> = ({ servicio, isOpen, onClose }) => {
  const [nuevaRutaId, setNuevaRutaId] = useState<string>('');
  
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

  // Get unique route names for the selector (showing all available routes)
  const rutasUnicas = React.useMemo(() => {
    console.log('Rutas disponibles:', rutasDisponibles);
    const rutas = rutasDisponibles.map((ruta, index) => ({
      ...ruta,
      displayName: `${ruta.nombre} - ${ruta.sentido === 'ingreso' ? 'Ingreso' : 'Salida'}`
    }));
    console.log('Rutas únicas procesadas:', rutas);
    return rutas;
  }, [rutasDisponibles]);

  // Set default route when modal opens
  React.useEffect(() => {
    if (isOpen && rutasUnicas.length > 0 && !nuevaRutaId) {
      setNuevaRutaId(rutasUnicas[0].id);
    }
  }, [isOpen, rutasUnicas.length, nuevaRutaId]);

  if (!servicio) return null;

  const handleSubmit = async () => {
    // Validate required fields
    if (!nuevaRutaId) {
      toast({
        title: "Error",
        description: "Debe seleccionar una ruta",
        variant: "destructive",
      });
      return;
    }


    const rutaSeleccionada = mockRamales.find(r => r.id === nuevaRutaId);
    if (!rutaSeleccionada) {
      toast({
        title: "Error",
        description: "Ruta no válida",
        variant: "destructive",
      });
      return;
    }

    // Validate that it's not the same route as current
    const rutaActual = mockRamales.find(r => 
      r.nombre === servicio.ramal && r.empresaTransporte === servicio.empresaTransporte
    );

    if (rutaActual && rutaSeleccionada.nombre === rutaActual.nombre) {
      toast({
        title: "Error",
        description: "Debe seleccionar una ruta diferente a la actual",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate random success/error for demo purposes
      const success = Math.random() > 0.2; // 80% success rate

      if (success) {
        // Log the change request to bitácora
        registrarAcceso('CAMBIO_RUTA', {
          servicioId: servicio.id,
          numeroServicio: servicio.numeroServicio,
          rutaOriginal: servicio.ramal,
          rutaNueva: rutaSeleccionada.nombre,
          empresaTransporte: servicio.empresaTransporte,
          autobus: servicio.autobus,
          usuario: 'Usuario actual' // In real implementation, get from auth context
        });

        toast({
          title: "Éxito",
          description: "Cambio de ruta solicitado exitosamente",
          variant: "default",
        });

        // Reset form and close modal
        setNuevaRutaId('');
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-[9998]">
        <DialogHeader>
          <DialogTitle>Cambio de Ruta</DialogTitle>
          <DialogDescription>
            Solicitar cambio de ruta para el servicio {servicio.numeroServicio}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current service info */}
          <div className="bg-muted p-3 rounded-lg space-y-2">
            <h4 className="text-sm font-medium">Información Actual</h4>
            <div className="text-sm text-muted-foreground">
              <p><strong>Ruta:</strong> {servicio.ramal}</p>
              <p><strong>Autobús:</strong> {servicio.autobus}</p>
              <p><strong>Empresa:</strong> {servicio.empresaTransporte}</p>
            </div>
          </div>

          {/* Nueva ruta selector */}
          <div className="space-y-2">
            <Label htmlFor="nueva-ruta">Nueva Ruta <span className="text-destructive">*</span></Label>
            <Select value={nuevaRutaId} onValueChange={setNuevaRutaId} required>
              <SelectTrigger className={!nuevaRutaId ? "border-destructive" : ""}>
                <SelectValue placeholder="Seleccionar nueva ruta" />
              </SelectTrigger>
              <SelectContent className="z-[999999] bg-popover" sideOffset={5} position="popper">
                {rutasUnicas.length > 0 ? (
                  rutasUnicas.map((ruta) => (
                    <SelectItem key={ruta.id} value={ruta.id}>
                      {ruta.nombre} - {ruta.sentido === 'ingreso' ? 'Ingreso' : 'Salida'}
                      {ruta.empresaCliente ? ` (${ruta.empresaCliente})` : ''}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-routes" disabled>
                    No hay rutas disponibles para esta empresa
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !nuevaRutaId}
          >
            {isSubmitting ? 'Enviando...' : 'Solicitar Cambio'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CambioRutaModal;