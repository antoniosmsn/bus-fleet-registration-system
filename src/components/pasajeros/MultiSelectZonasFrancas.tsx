
import React, { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';

interface MultiSelectZonasFrancasProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const zonasFrancas = [
  'Zona Franca Cartago',
  'Zona Franca Coyol',
  'Zona Franca El Coyol',
  'Zona Franca Belén',
  'Zona Franca Metropolitana',
  'Zona Franca Pavas',
  'Zona Franca San José',
  'Zona Franca Heredia',
  'Zona Franca Alajuela',
  'Zona Franca Puntarenas',
];

const MultiSelectZonasFrancas: React.FC<MultiSelectZonasFrancasProps> = ({
  value,
  onChange
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (zona: string) => {
    const newValue = value.includes(zona)
      ? value.filter(v => v !== zona)
      : [...value, zona];
    onChange(newValue);
  };

  const handleRemove = (zona: string) => {
    onChange(value.filter(v => v !== zona));
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length === 0 
              ? "Seleccionar zonas francas..." 
              : `${value.length} zona(s) seleccionada(s)`
            }
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar zona franca..." />
            <CommandEmpty>No se encontraron zonas francas.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {zonasFrancas.map((zona) => (
                <CommandItem
                  key={zona}
                  onSelect={() => handleSelect(zona)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value.includes(zona) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {zona}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((zona) => (
            <Badge key={zona} variant="secondary" className="flex items-center gap-1">
              {zona}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemove(zona)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectZonasFrancas;
