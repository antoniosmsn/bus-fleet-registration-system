import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, X, MapPin, Eye } from 'lucide-react';
import { Stop } from '@/data/mockStops';
import { cn } from '@/lib/utils';

interface StopsPanelProps {
  stops: Stop[];
  selectedStops: string[];
  onStopsChange: (stopIds: string[]) => void;
  onClose: () => void;
  onCenterMap?: (lat: number, lng: number) => void;
  isMobile?: boolean;
}

export const StopsPanel: React.FC<StopsPanelProps> = ({
  stops,
  selectedStops,
  onStopsChange,
  onClose,
  onCenterMap,
  isMobile = false
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  // Filter stops based on search
  const filteredStops = useMemo(() => {
    if (!searchFilter.trim()) return stops;
    
    const search = searchFilter.toLowerCase();
    return stops.filter(stop => 
      stop.codigo.toLowerCase().includes(search) ||
      stop.nombre.toLowerCase().includes(search) ||
      stop.provincia.toLowerCase().includes(search) ||
      stop.canton.toLowerCase().includes(search) ||
      stop.distrito.toLowerCase().includes(search)
    );
  }, [stops, searchFilter]);

  // Check if all visible stops are selected
  const allVisibleSelected = filteredStops.length > 0 && 
    filteredStops.every(stop => selectedStops.includes(stop.id));

  // Handle select all toggle
  const handleSelectAll = () => {
    if (allVisibleSelected) {
      // Deselect all visible stops
      const visibleStopIds = filteredStops.map(stop => stop.id);
      const newSelected = selectedStops.filter(id => !visibleStopIds.includes(id));
      onStopsChange(newSelected);
    } else {
      // Select all visible stops
      const visibleStopIds = filteredStops.map(stop => stop.id);
      const newSelected = [...new Set([...selectedStops, ...visibleStopIds])];
      onStopsChange(newSelected);
    }
  };

  // Handle individual stop toggle
  const handleStopToggle = (stopId: string) => {
    if (selectedStops.includes(stopId)) {
      onStopsChange(selectedStops.filter(id => id !== stopId));
    } else {
      onStopsChange([...selectedStops, stopId]);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchFilter('');
  };

  return (
    <div className={cn("flex flex-col", isMobile ? "h-full" : "space-y-3")}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn("font-medium text-muted-foreground", isMobile ? "text-sm" : "text-base")}>
          Paradas
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar parada..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Select All */}
      <div className="flex items-center space-x-2 mb-3">
        <Checkbox
          id="select-all-stops"
          checked={allVisibleSelected}
          onCheckedChange={handleSelectAll}
        />
        <label
          htmlFor="select-all-stops"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Todos ({filteredStops.length})
        </label>
        {selectedStops.length > 0 && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {selectedStops.length}
          </Badge>
        )}
      </div>

      {/* Stops List */}
      <ScrollArea className={cn("flex-1", isMobile ? "h-[400px]" : "h-[350px]")}>
        <div className="space-y-2 pr-2">
          {filteredStops.map((stop) => (
            <div
              key={stop.id}
              className="flex items-center space-x-2 group"
            >
              <Checkbox
                id={`stop-${stop.id}`}
                checked={selectedStops.includes(stop.id)}
                onCheckedChange={() => handleStopToggle(stop.id)}
              />
              <label
                htmlFor={`stop-${stop.id}`}
                className="flex-1 text-sm cursor-pointer leading-tight py-1"
              >
                <div className="font-medium">{stop.codigo}</div>
                <div className="text-muted-foreground text-xs truncate">{stop.nombre}</div>
              </label>
              {onCenterMap && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCenterMap(stop.lat, stop.lng)}
                  className="h-6 w-6 p-0"
                  title="Centrar en mapa"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          
          {filteredStops.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <MapPin className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No se encontraron paradas</p>
              {searchFilter && (
                <p className="text-xs mt-1">
                  Intenta con otros términos
                </p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};