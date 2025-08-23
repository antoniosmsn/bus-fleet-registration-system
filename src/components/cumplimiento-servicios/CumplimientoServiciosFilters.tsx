import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MultiSelect } from '@/components/ui/multi-select';
import { CalendarIcon, Filter, Download, FileText, X, Search } from 'lucide-react';
import { FiltrosCumplimientoServicio, EstadoServicio, CumplimientoServicio } from '@/types/cumplimiento-servicio';
import { 
  getUniqueAutobuses, 
  getUniqueRamales, 
  getUniqueEmpresasCliente,
  estadosServicio,
  cumplimientosServicio
} from '@/data/mockCumplimientoServicios';

interface CumplimientoServiciosFiltersProps {
  filtros: FiltrosCumplimientoServicio;
  onFiltrosChange: (filtros: FiltrosCumplimientoServicio) => void;
}

const CumplimientoServiciosFilters: React.FC<CumplimientoServiciosFiltersProps> = ({
  filtros,
  onFiltrosChange
}) => {
  // Get options for filters
  const autobusOptions = getUniqueAutobuses().map(bus => ({ value: bus, label: bus }));
  const ramalOptions = getUniqueRamales().map(ramal => ({ value: ramal, label: ramal }));
  const empresaClienteOptions = getUniqueEmpresasCliente().map(empresa => ({ value: empresa, label: empresa }));
  const estadoOptions = estadosServicio.map(estado => ({ value: estado, label: estado }));
  const cumplimientoOptions = cumplimientosServicio.map(cumplimiento => ({ 
    value: cumplimiento, 
    label: cumplimiento 
  }));

  const handleInputChange = (field: keyof FiltrosCumplimientoServicio, value: any) => {
    onFiltrosChange({ ...filtros, [field]: value });
  };

  const handleBuscar = () => {
    // The search functionality is automatically handled by the parent component
    // This button serves as a visual indicator that filters are applied
    console.log('Aplicando filtros:', filtros);
  };

  const limpiarFiltros = () => {
    const today = new Date().toISOString().split('T')[0];
    onFiltrosChange({
      fechaInicio: today,
      fechaFin: today,
      autobus: [],
      numeroServicio: '',
      ramal: [],
      estadoServicio: [],
      cumplimientoServicio: [],
      empresaCliente: []
    });
  };

  // Count active filters
  const activeFiltersCount = [
    filtros.autobus.length > 0 ? 1 : 0,
    filtros.numeroServicio ? 1 : 0,
    filtros.ramal.length > 0 ? 1 : 0,
    filtros.estadoServicio.length > 0 ? 1 : 0,
    filtros.cumplimientoServicio.length > 0 ? 1 : 0,
    filtros.empresaCliente.length > 0 ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  // Get active filter tags
  const getActiveFilters = () => {
    const filters = [];
    
    if (filtros.autobus.length > 0) {
      filtros.autobus.forEach(bus => filters.push({ type: 'autobus', value: bus, label: `Autobús: ${bus}` }));
    }
    if (filtros.numeroServicio) {
      filters.push({ type: 'numeroServicio', value: filtros.numeroServicio, label: `Servicio: ${filtros.numeroServicio}` });
    }
    if (filtros.ramal.length > 0) {
      filtros.ramal.forEach(ramal => filters.push({ type: 'ramal', value: ramal, label: `Ramal: ${ramal}` }));
    }
    if (filtros.estadoServicio.length > 0) {
      filtros.estadoServicio.forEach(estado => filters.push({ type: 'estadoServicio', value: estado, label: `Estado: ${estado}` }));
    }
    if (filtros.cumplimientoServicio.length > 0) {
      filtros.cumplimientoServicio.forEach(cumplimiento => filters.push({ type: 'cumplimientoServicio', value: cumplimiento, label: `Cumplimiento: ${cumplimiento}` }));
    }
    if (filtros.empresaCliente.length > 0) {
      filtros.empresaCliente.forEach(empresa => filters.push({ type: 'empresaCliente', value: empresa, label: `Cliente: ${empresa}` }));
    }
    
    return filters;
  };

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case 'autobus':
        handleInputChange('autobus', filtros.autobus.filter(item => item !== value));
        break;
      case 'numeroServicio':
        handleInputChange('numeroServicio', '');
        break;
      case 'ramal':
        handleInputChange('ramal', filtros.ramal.filter(item => item !== value));
        break;
      case 'estadoServicio':
        handleInputChange('estadoServicio', filtros.estadoServicio.filter(item => item !== value));
        break;
      case 'cumplimientoServicio':
        handleInputChange('cumplimientoServicio', filtros.cumplimientoServicio.filter(item => item !== value));
        break;
      case 'empresaCliente':
        handleInputChange('empresaCliente', filtros.empresaCliente.filter(item => item !== value));
        break;
    }
  };

  const activeFilters = getActiveFilters();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-base">Filtros</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="h-5 min-w-5 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleBuscar} className="bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {filter.label}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive" 
                  onClick={() => removeFilter(filter.type, filter.value)}
                />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={limpiarFiltros}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Limpiar todos
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs defaultValue="basicos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basicos">Básicos</TabsTrigger>
            <TabsTrigger value="estados">Estados</TabsTrigger>
            <TabsTrigger value="empresas">Empresas</TabsTrigger>
          </TabsList>

          <TabsContent value="basicos" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <div className="relative">
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={filtros.fechaInicio}
                    onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                    className="pl-3"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha Fin</Label>
                <div className="relative">
                  <Input
                    id="fechaFin"
                    type="date"
                    value={filtros.fechaFin}
                    onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                    className="pl-3"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Número de Servicio</Label>
                <Input
                  placeholder="Ej: SV-001"
                  value={filtros.numeroServicio}
                  onChange={(e) => handleInputChange('numeroServicio', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Autobús</Label>
                <MultiSelect
                  options={autobusOptions}
                  value={filtros.autobus}
                  onValueChange={(value) => handleInputChange('autobus', value)}
                  placeholder="Seleccionar autobuses"
                  maxDisplay={1}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ramal</Label>
                <MultiSelect
                  options={ramalOptions}
                  value={filtros.ramal}
                  onValueChange={(value) => handleInputChange('ramal', value)}
                  placeholder="Seleccionar ramales"
                  maxDisplay={2}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="estados" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado del Servicio</Label>
                <MultiSelect
                  options={estadoOptions}
                  value={filtros.estadoServicio}
                  onValueChange={(value) => handleInputChange('estadoServicio', value)}
                  placeholder="Seleccionar estados"
                  maxDisplay={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Cumplimiento del Servicio</Label>
                <MultiSelect
                  options={cumplimientoOptions}
                  value={filtros.cumplimientoServicio}
                  onValueChange={(value) => handleInputChange('cumplimientoServicio', value)}
                  placeholder="Seleccionar cumplimiento"
                  maxDisplay={2}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="empresas" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Empresa Cliente</Label>
                <MultiSelect
                  options={empresaClienteOptions}
                  value={filtros.empresaCliente}
                  onValueChange={(value) => handleInputChange('empresaCliente', value)}
                  placeholder="Seleccionar empresas cliente"
                  maxDisplay={2}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CumplimientoServiciosFilters;