
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface Bus {
  id: number;
  placa: string;
}

interface BusSelectionModalProps {
  isOpen: boolean;
  busquedaAutobus: string;
  setBusquedaAutobus: (value: string) => void;
  autobusSelecionadoModal: string;
  setAutobusSelecionadoModal: (value: string) => void;
  onSeleccionar: () => void;
  onCancelar: () => void;
  autobuses: Bus[];
}

const BusSelectionModal: React.FC<BusSelectionModalProps> = ({
  isOpen,
  busquedaAutobus,
  setBusquedaAutobus,
  autobusSelecionadoModal,
  setAutobusSelecionadoModal,
  onSeleccionar,
  onCancelar,
  autobuses
}) => {
  // Filtrar autobuses según la búsqueda
  const autobusesFiltrados = autobuses.filter(bus => 
    bus.id.toString().includes(busquedaAutobus) || 
    bus.placa.toLowerCase().includes(busquedaAutobus.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar Autobús</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Campo de búsqueda */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por ID o placa..."
              value={busquedaAutobus}
              onChange={(e) => setBusquedaAutobus(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {/* Lista de autobuses con radio buttons */}
          <div className="max-h-60 overflow-y-auto border rounded-md p-2">
            <RadioGroup 
              value={autobusSelecionadoModal} 
              onValueChange={setAutobusSelecionadoModal}
              className="space-y-2"
            >
              {autobusesFiltrados.map((bus) => (
                <div key={bus.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <RadioGroupItem value={bus.id.toString()} id={`bus-${bus.id}`} />
                  <Label htmlFor={`bus-${bus.id}`} className="cursor-pointer flex-1">
                    {bus.id}-{bus.placa}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {/* Mensaje cuando no hay resultados */}
          {autobusesFiltrados.length === 0 && (
            <p className="text-gray-500 text-center py-4">No se encontraron autobuses</p>
          )}
          
          {/* Botones de acción del modal */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onCancelar}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={onSeleccionar}
              disabled={!autobusSelecionadoModal}
              className="flex-1"
            >
              Seleccionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusSelectionModal;
