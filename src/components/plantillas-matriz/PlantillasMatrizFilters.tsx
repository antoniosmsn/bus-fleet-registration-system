import { useState } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { PlantillaMatrizFilter } from '@/types/plantilla-matriz';

interface PlantillasMatrizFiltersProps {
  filtros: PlantillaMatrizFilter;
  onFiltrosChange: (filtros: PlantillaMatrizFilter) => void;
  loading?: boolean;
}

export function PlantillasMatrizFilters({ 
  filtros, 
  onFiltrosChange, 
  loading = false 
}: PlantillasMatrizFiltersProps) {
  const [localFiltros, setLocalFiltros] = useState<PlantillaMatrizFilter>(filtros);

  const handleInputChange = (field: keyof PlantillaMatrizFilter, value: string | undefined) => {
    const newFiltros = { ...localFiltros, [field]: value };
    setLocalFiltros(newFiltros);
    onFiltrosChange(newFiltros);
  };

  const handleLimpiarFiltros = () => {
    const filtrosVacios: PlantillaMatrizFilter = {
      estado: 'todos'
    };
    setLocalFiltros(filtrosVacios);
    onFiltrosChange(filtrosVacios);
  };

  const handleBuscar = () => {
    onFiltrosChange(localFiltros);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Filtros de Búsqueda</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nombre de plantilla</Label>
            <Input
              placeholder="Buscar por nombre..."
              value={localFiltros.nombre || ''}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select 
              value={localFiltros.estado || 'todos'} 
              onValueChange={(value) => handleInputChange('estado', value as 'todos' | 'activos' | 'inactivos')}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="activos">Activos</SelectItem>
                <SelectItem value="inactivos">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button 
            onClick={handleBuscar} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Buscar
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleLimpiarFiltros}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}