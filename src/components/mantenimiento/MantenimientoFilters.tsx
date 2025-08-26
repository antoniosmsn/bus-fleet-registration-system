import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { MantenimientoFilter, CategoriaMantenimiento } from '@/types/mantenimiento';
import { Transportista } from '@/data/mockTransportistas';

interface MantenimientoFiltersProps {
  filtros: MantenimientoFilter;
  onFiltrosChange: (filtros: MantenimientoFilter) => void;
  categorias: CategoriaMantenimiento[];
  transportistas: Transportista[];
  isTransportistaUser?: boolean;
  transportistaUsuario?: string;
}

export function MantenimientoFilters({
  filtros,
  onFiltrosChange,
  categorias,
  transportistas,
  isTransportistaUser = false,
  transportistaUsuario
}: MantenimientoFiltersProps) {
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(
    filtros.fechaInicio ? new Date(filtros.fechaInicio) : undefined
  );
  const [fechaFin, setFechaFin] = useState<Date | undefined>(
    filtros.fechaFin ? new Date(filtros.fechaFin) : undefined
  );

  const handleFechaInicioChange = (date: Date | undefined) => {
    setFechaInicio(date);
    if (date) {
      onFiltrosChange({
        ...filtros,
        fechaInicio: format(date, 'yyyy-MM-dd')
      });
    } else {
      const { fechaInicio: _, ...newFiltros } = filtros;
      onFiltrosChange(newFiltros);
    }
  };

  const handleFechaFinChange = (date: Date | undefined) => {
    setFechaFin(date);
    if (date) {
      onFiltrosChange({
        ...filtros,
        fechaFin: format(date, 'yyyy-MM-dd')
      });
    } else {
      const { fechaFin: _, ...newFiltros } = filtros;
      onFiltrosChange(newFiltros);
    }
  };

  const handleCategoriasChange = (categorias: string[]) => {
    onFiltrosChange({
      ...filtros,
      categorias: categorias.length > 0 ? categorias : undefined
    });
  };

  const handlePlacaChange = (value: string) => {
    onFiltrosChange({
      ...filtros,
      placa: value.trim() ? value : undefined
    });
  };

  const handleTransportistaChange = (value: string) => {
    onFiltrosChange({
      ...filtros,
      transportista: value === 'todos' ? undefined : value
    });
  };

  const limpiarFiltros = () => {
    setFechaInicio(undefined);
    setFechaFin(undefined);
    onFiltrosChange({});
  };

  const categoriasOptions = categorias
    .filter(cat => cat.activo)
    .map(cat => ({
      value: cat.id,
      label: cat.nombre
    }));

  // Validación de fechas
  const fechasValidas = !fechaInicio || !fechaFin || fechaInicio <= fechaFin;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div></div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={limpiarFiltros}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Limpiar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rango de fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          {!fechasValidas && (
            <div className="col-span-2 text-sm text-destructive">
              La fecha de inicio debe ser menor o igual a la fecha fin
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="fecha-inicio">Fecha Inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="fecha-inicio"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fechaInicio && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {fechaInicio ? format(fechaInicio, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={fechaInicio}
                  onSelect={handleFechaInicioChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha-fin">Fecha Fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="fecha-fin"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fechaFin && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {fechaFin ? format(fechaFin, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={fechaFin}
                  onSelect={handleFechaFinChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Categorías */}
          <div className="space-y-2">
            <Label htmlFor="categorias">Categorías de Mantenimiento</Label>
            <MultiSelect
              options={categoriasOptions}
              value={filtros.categorias || []}
              onValueChange={handleCategoriasChange}
              placeholder="Todas las categorías"
            />
          </div>

          {/* Placa */}
          <div className="space-y-2">
            <Label htmlFor="placa">Placa del Autobús</Label>
            <Input
              id="placa"
              type="text"
              placeholder="Buscar por placa..."
              value={filtros.placa || ''}
              onChange={(e) => handlePlacaChange(e.target.value)}
              className="w-full"
            />
            {filtros.placa && filtros.placa.length < 2 && (
              <p className="text-xs text-muted-foreground">
                Mínimo 2 caracteres para búsqueda
              </p>
            )}
          </div>

          {/* Transportista */}
          <div className="space-y-2">
            <Label htmlFor="transportista">Transportista</Label>
            <Select
              value={filtros.transportista || 'todos'}
              onValueChange={handleTransportistaChange}
              disabled={isTransportistaUser}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar transportista" />
              </SelectTrigger>
              <SelectContent>
                {!isTransportistaUser && (
                  <SelectItem value="todos">Todos los transportistas</SelectItem>
                )}
                {transportistas.map((transportista) => (
                  <SelectItem key={transportista.id} value={transportista.id}>
                    {transportista.codigo} - {transportista.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isTransportistaUser && (
              <p className="text-xs text-muted-foreground">
                Filtro bloqueado según sus permisos de empresa
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}