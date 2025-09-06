import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Search, RotateCcw, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Combobox } from '@/components/ui/combobox';
import { InspeccionFilter } from '@/types/inspeccion-autobus';
import { PlantillaInspeccion } from '@/types/inspeccion-autobus';
import { Transportista } from '@/data/mockTransportistas';

interface InspeccionFiltersProps {
  filtros: InspeccionFilter;
  onFiltrosChange: (filtros: InspeccionFilter) => void;
  onBuscar: () => void;
  transportistas: Transportista[];
  loading?: boolean;
}

export function InspeccionFilters({
  filtros,
  onFiltrosChange,
  onBuscar,
  transportistas,
  loading = false
}: InspeccionFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Establecer valores por defecto
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!filtros.fechaInicio && !filtros.fechaFin) {
      onFiltrosChange({
        ...filtros,
        fechaInicio: today,
        fechaFin: today,
        horaInicio: '00:00',
        horaFin: '23:59'
      });
    }
  }, []);

  const handleInputChange = (field: keyof InspeccionFilter, value: string | number | undefined) => {
    const newValue = value === '' ? undefined : value;
    onFiltrosChange({ ...filtros, [field]: newValue });
  };

  const clearFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    onFiltrosChange({
      fechaInicio: today,
      fechaFin: today,
      horaInicio: '00:00',
      horaFin: '23:59'
    });
  };

  const hasActiveFilters = Object.values(filtros).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  // Opciones para combobox
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
            <div className="space-y-4">
              {/* Empresa transportista */}
              <div className="space-y-2">
                <Label>Empresa transportista</Label>
                <Combobox
                  options={transportistaOptions}
                  value={filtros.transportista || ''}
                  onValueChange={(value) => handleInputChange('transportista', value)}
                  placeholder="Seleccionar empresa transportista"
                  searchPlaceholder="Buscar empresa..."
                  emptyText="No se encontraron empresas"
                />
              </div>

              {/* Placa */}
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

              {/* Fechas de inspección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* Horas de inspección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horaInicio">Hora inicio</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={filtros.horaInicio || ''}
                    onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horaFin">Hora fin</Label>
                  <Input
                    id="horaFin"
                    type="time"
                    value={filtros.horaFin || ''}
                    onChange={(e) => handleInputChange('horaFin', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Responsable */}
              <div className="space-y-2">
                <Label htmlFor="responsable">Responsable</Label>
                <Input
                  id="responsable"
                  placeholder="Nombre del usuario responsable"
                  value={filtros.responsable || ''}
                  onChange={(e) => handleInputChange('responsable', e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Identificador de matriz */}
              <div className="space-y-2">
                <Label htmlFor="consecutivo">Identificador de matriz</Label>
                <Input
                  id="consecutivo"
                  type="number"
                  placeholder="Número consecutivo"
                  value={filtros.consecutivo || ''}
                  onChange={(e) => handleInputChange('consecutivo', e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Estado */}
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

              {/* Botones de acción */}
              <div className="flex gap-2 pt-4">
                <Button onClick={onBuscar} disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" onClick={clearFilters} disabled={loading}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpiar filtros
                </Button>
              </div>
            </div>

          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}