
import React, { useState } from 'react';
import { Check, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Vertex {
  lat: number;
  lng: number;
}

interface Geocerca {
  id: string;
  nombre: string;
  vertices: Vertex[];
  active: boolean;
}

interface GeocercaSelectorProps {
  geocercas: Geocerca[];
  selectedGeocercaIds: string[];
  onSelect: (geocercaIds: string[]) => void;
}

const GeocercaSelector = ({ geocercas, selectedGeocercaIds, onSelect }: GeocercaSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredGeocercas = geocercas.filter(geocerca => 
    geocerca.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGeocercaClick = (geocercaId: string) => {
    const isSelected = selectedGeocercaIds.includes(geocercaId);
    let newSelectedIds: string[];
    
    if (isSelected) {
      // Remove from selection
      newSelectedIds = selectedGeocercaIds.filter(id => id !== geocercaId);
    } else {
      // Add to selection
      newSelectedIds = [...selectedGeocercaIds, geocercaId];
    }
    
    onSelect(newSelectedIds);
  };

  return (
    <div className="border rounded-md">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar geocercas cercanas"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <ScrollArea className="h-60">
        <div className="p-1">
          {filteredGeocercas.length > 0 ? (
            filteredGeocercas.map((geocerca) => {
              const isSelected = selectedGeocercaIds.includes(geocerca.id);
              return (
                <div
                  key={geocerca.id}
                  className={`flex items-center px-2 py-2 cursor-pointer rounded ${
                    isSelected 
                      ? 'bg-blue-100' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleGeocercaClick(geocerca.id)}
                >
                  <div className="flex-shrink-0 mr-2">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                      isSelected 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <span className="block text-sm">{geocerca.nombre}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-4 text-center text-gray-500 text-sm">
              No se encontraron geocercas
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default GeocercaSelector;
