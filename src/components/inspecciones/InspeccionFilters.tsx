import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Search, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Combobox } from '@/components/ui/combobox';
import { InspeccionFilter } from '@/types/inspeccion-autobus';
import { PlantillaInspeccion } from '@/types/inspeccion-autobus';
import { Transportista } from '@/data/mockTransportistas';

interface InspeccionFiltersProps {
  filtros: InspeccionFilter;
  onFiltrosChange: (filtros: InspeccionFilter) => void;
  plantillas: PlantillaInspeccion[];
  transportistas: Transportista[];
  loading?: boolean;
}

export function InspeccionFilters({
  filtros,
  onFiltrosChange,
  plantillas,
  transportistas,
  loading = false
}: InspeccionFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleInputChange = (field: keyof InspeccionFilter, value: string | number | undefined) => {
    const newValue = value === '' ? undefined : value;
    onFiltrosChange({ ...filtros, [field]: newValue });
  };

  const clearFilters = () => {
    onFiltrosChange({});
  };

  const hasActiveFilters = Object.values(filtros).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  // Opciones para combobox
  const plantillaOptions = plantillas.map(p => ({
    value: p.id,
    label: p.nombre
  }));

  const transportistaOptions = transportistas.map(t => ({
    value: t.id,
    label: t.nombre
  }));

  const estadoOptions = [
    { value: 'completada', label: 'Completada' },
    { value: 'pendiente', label: 'Pendiente' }
  ];

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Filtros de búsqueda</span>
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                Activos
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          <div className="p-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Información General</TabsTrigger>
                <TabsTrigger value="inspeccion">Inspección</TabsTrigger>
                <TabsTrigger value="resultados">Resultados</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio">Fecha inicio</Label>
                    <Input
                      id="fechaInicio"
                      type="date"
                      value={filtros.fechaInicio || ''}
                      onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fechaFin">Fecha fin</Label>
                    <Input
                      id="fechaFin"
                      type="date"
                      value={filtros.fechaFin || ''}
                      onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Transportista</Label>
                    <Combobox
                      options={transportistaOptions}
                      value={filtros.transportista || ''}
                      onValueChange={(value) => handleInputChange('transportista', value)}
                      placeholder="Seleccionar transportista"
                      searchPlaceholder="Buscar transportista..."
                      emptyText="No se encontraron transportistas"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="placa">Placa</Label>
                    <Input
                      id="placa"
                      placeholder="Ej: CRC-1001"
                      value={filtros.placa || ''}
                      onChange={(e) => handleInputChange('placa', e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conductor">Conductor</Label>
                    <Input
                      id="conductor"
                      placeholder="Nombre o apellidos del conductor"
                      value={filtros.conductor || ''}
                      onChange={(e) => handleInputChange('conductor', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="inspeccion" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Plantilla utilizada</Label>
                    <Combobox
                      options={plantillaOptions}
                      value={filtros.plantilla || ''}
                      onValueChange={(value) => handleInputChange('plantilla', value)}
                      placeholder="Seleccionar plantilla"
                      searchPlaceholder="Buscar plantilla..."
                      emptyText="No se encontraron plantillas"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Combobox
                      options={estadoOptions}
                      value={filtros.estado || ''}
                      onValueChange={(value) => handleInputChange('estado', value)}
                      placeholder="Seleccionar estado"
                      searchPlaceholder="Buscar estado..."
                      emptyText="No se encontraron estados"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resultados" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calificacionMin">Calificación mínima</Label>
                    <Input
                      id="calificacionMin"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={filtros.calificacionMin || ''}
                      onChange={(e) => handleInputChange('calificacionMin', e.target.value ? Number(e.target.value) : undefined)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calificacionMax">Calificación máxima</Label>
                    <Input
                      id="calificacionMax"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="100"
                      value={filtros.calificacionMax || ''}
                      onChange={(e) => handleInputChange('calificacionMax', e.target.value ? Number(e.target.value) : undefined)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}