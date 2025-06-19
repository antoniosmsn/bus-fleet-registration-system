
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TagResidenciaMapProps {
  value?: string;
  onChange: (value: string) => void;
}

const TagResidenciaMap: React.FC<TagResidenciaMapProps> = ({
  value,
  onChange
}) => {
  const [open, setOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(value || '');

  const handleSave = () => {
    onChange(tempLocation);
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setTempLocation('');
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value || ''}
          placeholder="Ubicación de residencia"
          readOnly
        />
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <MapPin className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Seleccionar Ubicación de Residencia</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Mapa interactivo aquí</p>
                  <p className="text-sm text-gray-400">
                    Click en el mapa para seleccionar la ubicación
                  </p>
                </div>
              </div>
              
              <div>
                <Input
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  placeholder="O escriba la dirección manualmente"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  Guardar Ubicación
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {value && (
          <Button variant="outline" size="icon" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TagResidenciaMap;
