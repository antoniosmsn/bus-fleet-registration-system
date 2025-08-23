import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { BitacoraCambioRutaFilter } from '@/types/bitacora-cambio-ruta';

// Mock options for dropdowns
const rutasOptions = [
  { value: 'todos', label: 'Todos' },
  { value: '1', label: 'Ruta Aeropuerto - Centro' },
  { value: '2', label: 'Ruta Norte Industrial' },
  { value: '3', label: 'Ruta Sur Comercial' },
  { value: '4', label: 'Ruta Este Residencial' },
  { value: '5', label: 'Ruta Oeste Universitaria' },
  { value: '6', label: 'Ruta Zona Franca Principal' },
  { value: '7', label: 'Ruta Zona Franca Secundaria' },
];

const empresasOptions = [
  { value: 'todos', label: 'Todos' },
  { value: '1', label: 'Transportes El Coyol S.A.' },
  { value: '2', label: 'Autobuses Unidos Ltda.' },
  { value: '3', label: 'Servicios Rápidos Express' },
  { value: '4', label: 'Transporte Seguro Nacional' },
];

const autobusesOptions = [
  { value: 'todos', label: 'Todos' },
  { value: '1', label: 'BUS-001 (TAX-1234)' },
  { value: '2', label: 'BUS-002 (TAX-5678)' },
  { value: '3', label: 'BUS-003 (TAX-9012)' },
  { value: '4', label: 'BUS-004 (TAX-3456)' },
  { value: '5', label: 'BUS-005 (TAX-7890)' },
];

const estadosOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'Aceptada', label: 'Aceptada' },
  { value: 'Rechazada', label: 'Rechazada' },
];

interface BitacoraCambiosRutasFiltersProps {
  filtros: BitacoraCambioRutaFilter;
  onFiltrosChange: (filtros: BitacoraCambioRutaFilter) => void;
}

const BitacoraCambiosRutasFilters = ({ filtros, onFiltrosChange }: BitacoraCambiosRutasFiltersProps) => {
  const [filtrosLocales, setFiltrosLocales] = useState<BitacoraCambioRutaFilter>(filtros);

  const today = new Date().toISOString().split('T')[0];

  const aplicarFiltros = () => {
    onFiltrosChange(filtrosLocales);
  };

  const limpiarFiltros = () => {
    const filtrosVacios: BitacoraCambioRutaFilter = {
      rutaOriginal: 'todos',
      rutaFinal: 'todos',
      usuario: '',
      fechaCambioInicio: today,
      fechaCambioFin: today,
      fechaServicioInicio: today,
      fechaServicioFin: today,
      numeroServicio: '',
      empresaTransporte: 'todos',
      autobus: 'todos',
      estado: 'todos',
    };
    setFiltrosLocales(filtrosVacios);
    onFiltrosChange(filtrosVacios);
  };

  const updateFiltro = (campo: keyof BitacoraCambioRutaFilter, valor: any) => {
    setFiltrosLocales(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Calculate active filters for display
  const activeFilters = [];
  if (filtrosLocales.rutaOriginal && filtrosLocales.rutaOriginal !== 'todos') {
    const rutaLabel = rutasOptions.find(r => r.value === filtrosLocales.rutaOriginal)?.label;
    activeFilters.push(`Ruta Original: ${rutaLabel}`);
  }
  if (filtrosLocales.rutaFinal && filtrosLocales.rutaFinal !== 'todos') {
    const rutaLabel = rutasOptions.find(r => r.value === filtrosLocales.rutaFinal)?.label;
    activeFilters.push(`Ruta Final: ${rutaLabel}`);
  }
  if (filtrosLocales.usuario) {
    activeFilters.push(`Usuario: ${filtrosLocales.usuario}`);
  }
  if (filtrosLocales.numeroServicio) {
    activeFilters.push(`Número Servicio: ${filtrosLocales.numeroServicio}`);
  }
  if (filtrosLocales.empresaTransporte && filtrosLocales.empresaTransporte !== 'todos') {
    const empresaLabel = empresasOptions.find(e => e.value === filtrosLocales.empresaTransporte)?.label;
    activeFilters.push(`Empresa: ${empresaLabel}`);
  }
  if (filtrosLocales.autobus && filtrosLocales.autobus !== 'todos') {
    const autobusLabel = autobusesOptions.find(a => a.value === filtrosLocales.autobus)?.label;
    activeFilters.push(`Autobús: ${autobusLabel}`);
  }
  if (filtrosLocales.estado && filtrosLocales.estado !== 'todos') {
    const estadoLabel = estadosOptions.find(e => e.value === filtrosLocales.estado)?.label;
    activeFilters.push(`Estado: ${estadoLabel}`);
  }

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-auto grid-cols-3">
              <TabsTrigger value="general" className="text-sm">General</TabsTrigger>
              <TabsTrigger value="fechas" className="text-sm">Fechas</TabsTrigger>
              <TabsTrigger value="servicios" className="text-sm">Servicios</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button
                onClick={aplicarFiltros}
                size="sm"
                className="min-w-[100px]"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button
                onClick={limpiarFiltros}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </div>

          <TabsContent value="general" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rutaOriginal">Ruta Original</Label>
                <Select value={filtrosLocales.rutaOriginal} onValueChange={(value) => updateFiltro('rutaOriginal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ruta original" />
                  </SelectTrigger>
                  <SelectContent>
                    {rutasOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rutaFinal">Ruta Final</Label>
                <Select value={filtrosLocales.rutaFinal} onValueChange={(value) => updateFiltro('rutaFinal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ruta final" />
                  </SelectTrigger>
                  <SelectContent>
                    {rutasOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuario</Label>
                <Input
                  id="usuario"
                  placeholder="Buscar por nombre o username..."
                  value={filtrosLocales.usuario}
                  onChange={(e) => updateFiltro('usuario', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fechas" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">Fecha del Cambio</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaCambioInicio">Desde</Label>
                    <Input
                      id="fechaCambioInicio"
                      type="date"
                      value={filtrosLocales.fechaCambioInicio}
                      onChange={(e) => updateFiltro('fechaCambioInicio', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaCambioFin">Hasta</Label>
                    <Input
                      id="fechaCambioFin"
                      type="date"
                      value={filtrosLocales.fechaCambioFin}
                      onChange={(e) => updateFiltro('fechaCambioFin', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">Fecha del Servicio</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaServicioInicio">Desde</Label>
                    <Input
                      id="fechaServicioInicio"
                      type="date"
                      value={filtrosLocales.fechaServicioInicio}
                      onChange={(e) => updateFiltro('fechaServicioInicio', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaServicioFin">Hasta</Label>
                    <Input
                      id="fechaServicioFin"
                      type="date"
                      value={filtrosLocales.fechaServicioFin}
                      onChange={(e) => updateFiltro('fechaServicioFin', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="servicios" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroServicio">Número de Servicio</Label>
                <Input
                  id="numeroServicio"
                  placeholder="Ej: SRV-1234"
                  value={filtrosLocales.numeroServicio}
                  onChange={(e) => updateFiltro('numeroServicio', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="empresaTransporte">Empresa de Transporte</Label>
                <Select value={filtrosLocales.empresaTransporte} onValueChange={(value) => updateFiltro('empresaTransporte', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresasOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="autobus">Autobús</Label>
                <Select value={filtrosLocales.autobus} onValueChange={(value) => updateFiltro('autobus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar autobús" />
                  </SelectTrigger>
                  <SelectContent>
                    {autobusesOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estado">Estado de Solicitud</Label>
                <Select value={filtrosLocales.estado} onValueChange={(value) => updateFiltro('estado', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-4 border-t mt-4">
            <span className="text-sm text-muted-foreground mr-2">Filtros activos:</span>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {filter}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BitacoraCambiosRutasFilters;