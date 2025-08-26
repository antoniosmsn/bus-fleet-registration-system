import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import { Checkbox } from '@/components/ui/checkbox';
import { TimePicker } from '@/components/ui/time-picker';
import { Search, X, AlertCircle } from 'lucide-react';
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
      horaCambioInicio: '00:00',
      horaCambioFin: '23:59',
      usarFechaServicio: false,
      fechaServicioInicio: today,
      fechaServicioFin: today,
      horaServicioInicio: '00:00',
      horaServicioFin: '23:59',
      numeroServicio: '',
      empresaTransporte: 'todos',
      autobus: '',
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

  // Validation functions
  const isFechaCambioValid = () => {
    if (!filtrosLocales.fechaCambioInicio || !filtrosLocales.fechaCambioFin) return true;
    
    const fechaInicio = new Date(`${filtrosLocales.fechaCambioInicio}T${filtrosLocales.horaCambioInicio}`);
    const fechaFin = new Date(`${filtrosLocales.fechaCambioFin}T${filtrosLocales.horaCambioFin}`);
    
    return fechaInicio <= fechaFin;
  };

  const isFechaServicioValid = () => {
    if (!filtrosLocales.usarFechaServicio) return true;
    if (!filtrosLocales.fechaServicioInicio || !filtrosLocales.fechaServicioFin) return true;
    
    const fechaInicio = new Date(`${filtrosLocales.fechaServicioInicio}T${filtrosLocales.horaServicioInicio}`);
    const fechaFin = new Date(`${filtrosLocales.fechaServicioFin}T${filtrosLocales.horaServicioFin}`);
    
    return fechaInicio <= fechaFin;
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
  if (filtrosLocales.autobus && filtrosLocales.autobus.trim()) {
    activeFilters.push(`Autobús: ${filtrosLocales.autobus}`);
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
                <Combobox
                  options={rutasOptions}
                  value={filtrosLocales.rutaOriginal}
                  onValueChange={(value) => updateFiltro('rutaOriginal', value)}
                  placeholder="Seleccionar ruta original"
                  searchPlaceholder="Buscar ruta..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rutaFinal">Ruta Final</Label>
                <Combobox
                  options={rutasOptions}
                  value={filtrosLocales.rutaFinal}
                  onValueChange={(value) => updateFiltro('rutaFinal', value)}
                  placeholder="Seleccionar ruta final"
                  searchPlaceholder="Buscar ruta..."
                />
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
            <div className="space-y-6">
              {/* Fecha del Cambio */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">Fecha del Cambio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaCambioInicio">Fecha Desde</Label>
                    <Input
                      id="fechaCambioInicio"
                      type="date"
                      value={filtrosLocales.fechaCambioInicio}
                      onChange={(e) => updateFiltro('fechaCambioInicio', e.target.value)}
                      className={!isFechaCambioValid() ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaCambioFin">Fecha Hasta</Label>
                    <Input
                      id="fechaCambioFin"
                      type="date"
                      value={filtrosLocales.fechaCambioFin}
                      onChange={(e) => updateFiltro('fechaCambioFin', e.target.value)}
                      className={!isFechaCambioValid() ? "border-destructive" : ""}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horaCambioInicio">Hora Desde</Label>
                    <TimePicker
                      value={filtrosLocales.horaCambioInicio}
                      onValueChange={(value) => updateFiltro('horaCambioInicio', value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaCambioFin">Hora Hasta</Label>
                    <TimePicker
                      value={filtrosLocales.horaCambioFin}
                      onValueChange={(value) => updateFiltro('horaCambioFin', value)}
                    />
                  </div>
                </div>
                {!isFechaCambioValid() && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    La fecha/hora inicial no puede ser mayor a la final
                  </div>
                )}
              </div>
              
              {/* Fecha del Servicio */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="usarFechaServicio"
                    checked={filtrosLocales.usarFechaServicio}
                    onCheckedChange={(checked) => updateFiltro('usarFechaServicio', checked)}
                  />
                  <Label htmlFor="usarFechaServicio" className="font-medium text-sm text-muted-foreground">
                    Filtrar por Fecha del Servicio
                  </Label>
                </div>
                
                {filtrosLocales.usarFechaServicio && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fechaServicioInicio">Fecha Desde</Label>
                        <Input
                          id="fechaServicioInicio"
                          type="date"
                          value={filtrosLocales.fechaServicioInicio}
                          onChange={(e) => updateFiltro('fechaServicioInicio', e.target.value)}
                          className={!isFechaServicioValid() ? "border-destructive" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fechaServicioFin">Fecha Hasta</Label>
                        <Input
                          id="fechaServicioFin"
                          type="date"
                          value={filtrosLocales.fechaServicioFin}
                          onChange={(e) => updateFiltro('fechaServicioFin', e.target.value)}
                          className={!isFechaServicioValid() ? "border-destructive" : ""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="horaServicioInicio">Hora Desde</Label>
                        <TimePicker
                          value={filtrosLocales.horaServicioInicio}
                          onValueChange={(value) => updateFiltro('horaServicioInicio', value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="horaServicioFin">Hora Hasta</Label>
                        <TimePicker
                          value={filtrosLocales.horaServicioFin}
                          onValueChange={(value) => updateFiltro('horaServicioFin', value)}
                        />
                      </div>
                    </div>
                    {!isFechaServicioValid() && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        La fecha/hora inicial no puede ser mayor a la final
                      </div>
                    )}
                  </>
                )}
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
                <Combobox
                  options={empresasOptions}
                  value={filtrosLocales.empresaTransporte}
                  onValueChange={(value) => updateFiltro('empresaTransporte', value)}
                  placeholder="Seleccionar empresa"
                  searchPlaceholder="Buscar empresa..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="autobus">Autobús</Label>
                <Input
                  id="autobus"
                  placeholder="Buscar autobús..."
                  value={filtrosLocales.autobus}
                  onChange={(e) => updateFiltro('autobus', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estado">Estado de Solicitud</Label>
                <Combobox
                  options={estadosOptions}
                  value={filtrosLocales.estado}
                  onValueChange={(value) => updateFiltro('estado', value)}
                  placeholder="Seleccionar estado"
                  searchPlaceholder="Buscar estado..."
                />
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