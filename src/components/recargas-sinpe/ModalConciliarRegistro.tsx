import { useState, useEffect } from 'react';
import { Search, User, Building, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DetalleConciliacionSinpe } from '@/types/recarga-sinpe';

interface PasajeroEncontrado {
  id: string;
  cedula: string;
  nombre: string;
  empresaCliente: string;
  tipoContrato: 'Directo' | 'Indirecto';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  detalle: DetalleConciliacionSinpe | null;
  onConfirmarConciliacion: (detalle: DetalleConciliacionSinpe, pasajero: PasajeroEncontrado) => void;
}

// Mock data de pasajeros
const mockPasajeros: PasajeroEncontrado[] = [
  {
    id: '1',
    cedula: '123456789',
    nombre: 'Juan Carlos Rodríguez',
    empresaCliente: 'TechCorp S.A.',
    tipoContrato: 'Directo'
  },
  {
    id: '2',
    cedula: '987654321',
    nombre: 'María Elena González',
    empresaCliente: 'InnovateLab Ltd.',
    tipoContrato: 'Indirecto'
  },
  {
    id: '3',
    cedula: '456789123',
    nombre: 'Carlos Alberto Martínez',
    empresaCliente: 'GlobalTrade Inc.',
    tipoContrato: 'Directo'
  }
];

export default function ModalConciliarRegistro({
  isOpen,
  onClose,
  detalle,
  onConfirmarConciliacion
}: Props) {
  const [cedulaEditada, setCedulaEditada] = useState('');
  const [pasajeroEncontrado, setPasajeroEncontrado] = useState<PasajeroEncontrado | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [noEncontrado, setNoEncontrado] = useState(false);

  const handleBuscar = async () => {
    setBuscando(true);
    setNoEncontrado(false);
    setPasajeroEncontrado(null);

    // Simular delay de búsqueda
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pasajero = mockPasajeros.find(p => p.cedula === cedulaEditada);
    
    if (pasajero) {
      setPasajeroEncontrado(pasajero);
    } else {
      setNoEncontrado(true);
    }
    
    setBuscando(false);
  };

  const handleConfirmar = () => {
    if (detalle && pasajeroEncontrado) {
      onConfirmarConciliacion(detalle, pasajeroEncontrado);
      handleClose();
    }
  };

  const handleClose = () => {
    setCedulaEditada('');
    setPasajeroEncontrado(null);
    setNoEncontrado(false);
    setBuscando(false);
    onClose();
  };

  const getTipoContratoBadge = (tipo: PasajeroEncontrado['tipoContrato']) => {
    const variants = {
      'Directo': 'default',
      'Indirecto': 'secondary'
    } as const;
    
    return <Badge variant={variants[tipo]}>{tipo}</Badge>;
  };

  // Inicializar cédula cuando se abre el modal
  useEffect(() => {
    if (isOpen && detalle) {
      setCedulaEditada(detalle.cedula);
    }
  }, [isOpen, detalle]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Conciliar Registro</DialogTitle>
          <DialogDescription>
            Edite la cédula y busque el pasajero en el sistema para realizar la conciliación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del registro original */}
          {detalle && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Registro Original</h4>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Línea:</span> {detalle.linea}</div>
                <div><span className="font-medium">Nombre:</span> {detalle.nombre}</div>
                <div><span className="font-medium">Monto:</span> ₡{detalle.monto.toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Campo para editar cédula */}
          <div className="space-y-2">
            <Label htmlFor="cedula">Cédula</Label>
            <div className="flex gap-2">
              <Input
                id="cedula"
                value={cedulaEditada}
                onChange={(e) => setCedulaEditada(e.target.value)}
                placeholder="Ingrese la cédula"
                className="flex-1"
              />
              <Button 
                onClick={handleBuscar}
                disabled={!cedulaEditada || buscando}
                size="icon"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Estado de búsqueda */}
          {buscando && (
            <div className="flex items-center justify-center py-4">
              <div className="text-sm text-muted-foreground">Buscando...</div>
            </div>
          )}

          {/* Pasajero encontrado */}
          {pasajeroEncontrado && (
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Pasajero Encontrado</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Nombre:</span>
                  <span>{pasajeroEncontrado.nombre}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Empresa:</span>
                  <span>{pasajeroEncontrado.empresaCliente}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Contrato:</span>
                  {getTipoContratoBadge(pasajeroEncontrado.tipoContrato)}
                </div>
              </div>
            </div>
          )}

          {/* No encontrado */}
          {noEncontrado && (
            <div className="p-4 border rounded-lg bg-red-50 border-red-200">
              <div className="text-sm text-red-800">
                No se encontró ningún pasajero con la cédula <strong>{cedulaEditada}</strong>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmar}
            disabled={!pasajeroEncontrado}
          >
            Confirmar conciliación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}