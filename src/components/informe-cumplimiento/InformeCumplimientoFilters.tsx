import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X, FileDown, Filter, RotateCcw } from 'lucide-react';
import { FiltrosInformeCumplimiento, CampoOrdenamiento, DireccionOrdenamiento } from '@/types/informe-cumplimiento';
import { 
  getUniqueEmpresasCliente as getUniqueEmpresasClienteInforme
} from '@/data/mockInformesCumplimiento';
import {
  getUniqueAutobuses,
  getUniqueRamales,
  getUniqueEmpresasCliente,
  estadosServicio,
  cumplimientosServicio
} from '@/data/mockCumplimientoServicios';

interface InformeCumplimientoFiltersProps {
  filtros: FiltrosInformeCumplimiento;
  onFiltrosChange: (filtros: FiltrosInformeCumplimiento) => void;
  onAplicarFiltros: () => void;
  onLimpiarFiltros: () => void;
  totalRegistros: number;
}

export default function InformeCumplimientoFilters({
  filtros,
  onFiltrosChange,
  onAplicarFiltros,
  onLimpiarFiltros,
  totalRegistros
}: InformeCumplimientoFiltersProps) {

  const updateFiltro = (key: keyof FiltrosInformeCumplimiento, value: any) => {
    onFiltrosChange({
      ...filtros,
      [key]: value
    });
  };

  const addToArrayFilter = (key: keyof FiltrosInformeCumplimiento, value: string) => {
    const currentArray = filtros[key] as string[];
    if (!currentArray.includes(value)) {
      updateFiltro(key, [...currentArray, value]);
    }
  };

  const removeFromArrayFilter = (key: keyof FiltrosInformeCumplimiento, value: string) => {
    const currentArray = filtros[key] as string[];
    updateFiltro(key, currentArray.filter(item => item !== value));
  };

  const contarFiltrosActivos = (): number => {
    let count = 0;
    if (filtros.fechaInicio) count++;
    if (filtros.fechaFin) count++;
    if (filtros.horaInicio && filtros.horaInicio !== '00:00') count++;
    if (filtros.horaFin && filtros.horaFin !== '23:59') count++;
    if (filtros.numeroServicio) count++;
    if (filtros.autobus.length > 0) count++;
    if (filtros.ramal.length > 0) count++;
    if (filtros.estadoServicio.length > 0) count++;
    if (filtros.cumplimientoServicio.length > 0) count++;
    if (filtros.empresaCliente.length > 0) count++;
    if (filtros.estadoRevision.length > 0) count++;
    if (filtros.programado.length > 0) count++;
    return count;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="fechas" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fechas">Fechas</TabsTrigger>
            <TabsTrigger value="basicos">Básicos</TabsTrigger>
            <TabsTrigger value="estados">Estados</TabsTrigger>
            <TabsTrigger value="empresas">Empresas</TabsTrigger>
          </TabsList>

          {/* Fechas */}
          <TabsContent value="fechas" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verSoloPendientes"
                  checked={filtros.verSoloPendientes}
                  onCheckedChange={(checked) => updateFiltro('verSoloPendientes', checked)}
                />
                <Label htmlFor="verSoloPendientes" className="font-medium text-sm">
                  Ver solo pendientes de aprobación
                </Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio" className="text-sm font-medium">Fecha de Servicio - Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={filtros.fechaInicio}
                    onChange={(e) => updateFiltro('fechaInicio', e.target.value)}
                    className="text-sm h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaInicio" className="text-sm font-medium">Hora de Inicio</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={filtros.horaInicio}
                    onChange={(e) => updateFiltro('horaInicio', e.target.value)}
                    className="text-sm h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fechaFin" className="text-sm font-medium">Fecha de Servicio - Fin</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={filtros.fechaFin}
                    onChange={(e) => updateFiltro('fechaFin', e.target.value)}
                    className="text-sm h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horaFin" className="text-sm font-medium">Hora de Fin</Label>
                  <Input
                    id="horaFin"
                    type="time"
                    value={filtros.horaFin}
                    onChange={(e) => updateFiltro('horaFin', e.target.value)}
                    className="text-sm h-9"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Filtros Básicos */}
          <TabsContent value="basicos" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="numeroServicio" className="text-xs">Número Servicio</Label>
                  <Input
                    id="numeroServicio"
                    value={filtros.numeroServicio}
                    onChange={(e) => updateFiltro('numeroServicio', e.target.value)}
                    placeholder="Número de servicio"
                    className="text-sm h-9"
                  />
                </div>

                {/* Autobús */}
                <div className="space-y-2">
                  <Label className="text-xs">Autobús</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => addToArrayFilter('autobus', value)}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Autobús" />
                      </SelectTrigger>
                      <SelectContent>
                        {getUniqueAutobuses().map(autobus => (
                          <SelectItem key={autobus} value={autobus}>
                            {autobus}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {filtros.autobus.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filtros.autobus.map(item => (
                        <Badge key={item} variant="secondary" className="flex items-center gap-1 text-xs">
                          {item}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeFromArrayFilter('autobus', item)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ramal */}
                <div className="space-y-2">
                  <Label className="text-xs">Ramal</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => addToArrayFilter('ramal', value)}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Ramal" />
                      </SelectTrigger>
                      <SelectContent>
                        {getUniqueRamales().map(ramal => (
                          <SelectItem key={ramal} value={ramal}>
                            {ramal}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {filtros.ramal.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filtros.ramal.map(item => (
                        <Badge key={item} variant="secondary" className="flex items-center gap-1 text-xs">
                          {item}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeFromArrayFilter('ramal', item)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sección de Ordenamiento */}
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-4">Ordenar por</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campo de ordenamiento */}
                  <div className="space-y-3">
                    <Label className="text-xs font-medium">Campo:</Label>
                    <RadioGroup
                      value={filtros.campoOrdenamiento}
                      onValueChange={(value: CampoOrdenamiento) => updateFiltro('campoOrdenamiento', value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fecha" id="fecha" />
                        <Label htmlFor="fecha" className="text-sm">Fecha</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="estadoServicio" id="estadoServicio" />
                        <Label htmlFor="estadoServicio" className="text-sm">Estado del servicio</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="programado" id="programado" />
                        <Label htmlFor="programado" className="text-sm">Programado (sí o no)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="indicadorInconsistencia" id="indicadorInconsistencia" />
                        <Label htmlFor="indicadorInconsistencia" className="text-sm">Indicador de inconsistencia (Neutro, positivo, Negativo)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Dirección de ordenamiento */}
                  <div className="space-y-3">
                    <Label className="text-xs font-medium">Dirección:</Label>
                    <RadioGroup
                      value={filtros.direccionOrdenamiento}
                      onValueChange={(value: DireccionOrdenamiento) => updateFiltro('direccionOrdenamiento', value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="asc" id="asc" />
                        <Label htmlFor="asc" className="text-sm">Ascendente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="desc" id="desc" />
                        <Label htmlFor="desc" className="text-sm">Descendente</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Estados */}
          <TabsContent value="estados" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Todos los estados en una sola línea */}
              <div className="space-y-2">
                <Label className="text-xs">Estado del Servicio</Label>
                <Select onValueChange={(value) => addToArrayFilter('estadoServicio', value)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosServicio.map(estado => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filtros.estadoServicio.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {filtros.estadoServicio.map(item => (
                      <Badge key={item} variant="secondary" className="flex items-center gap-1 text-xs h-5">
                        {item}
                        <X 
                          className="h-2 w-2 cursor-pointer" 
                          onClick={() => removeFromArrayFilter('estadoServicio', item)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Cumplimiento del Servicio</Label>
                <Select onValueChange={(value) => addToArrayFilter('cumplimientoServicio', value)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Cumplimiento" />
                  </SelectTrigger>
                  <SelectContent>
                    {cumplimientosServicio.map(cumplimiento => (
                      <SelectItem key={cumplimiento} value={cumplimiento}>
                        {cumplimiento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filtros.cumplimientoServicio.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {filtros.cumplimientoServicio.map(item => (
                      <Badge key={item} variant="secondary" className="flex items-center gap-1 text-xs h-5">
                        {item}
                        <X 
                          className="h-2 w-2 cursor-pointer" 
                          onClick={() => removeFromArrayFilter('cumplimientoServicio', item)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Estado de Revisión</Label>
                <Select onValueChange={(value) => addToArrayFilter('estadoRevision', value)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Revisión" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Revisado por Transportista">Revisado por Transportista</SelectItem>
                    <SelectItem value="Revisado por Administración">Revisado por Administración</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
                {filtros.estadoRevision.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {filtros.estadoRevision.map(item => (
                      <Badge key={item} variant="secondary" className="flex items-center gap-1 text-xs h-5">
                        {item}
                        <X 
                          className="h-2 w-2 cursor-pointer" 
                          onClick={() => removeFromArrayFilter('estadoRevision', item)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Programado</Label>
                <Select onValueChange={(value) => {
                  const boolValue = value === 'true';
                  updateFiltro('programado', [...filtros.programado, boolValue]);
                }}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Programado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sí</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
                {filtros.programado.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {filtros.programado.map((item, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs h-5">
                        {item ? 'Sí' : 'No'}
                        <X 
                          className="h-2 w-2 cursor-pointer" 
                          onClick={() => {
                            const newArray = [...filtros.programado];
                            newArray.splice(index, 1);
                            updateFiltro('programado', newArray);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Empresas */}
          <TabsContent value="empresas" className="space-y-4">
            <div className="space-y-4">
              {/* Empresa Cliente */}
              <div className="space-y-2">
                <Label>Empresa Cliente</Label>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => addToArrayFilter('empresaCliente', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Seleccionar empresa cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUniqueEmpresasCliente().map(empresa => (
                        <SelectItem key={empresa} value={empresa}>
                          {empresa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {filtros.empresaCliente.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filtros.empresaCliente.map(item => (
                      <Badge key={item} variant="secondary" className="flex items-center gap-1">
                        {item}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromArrayFilter('empresaCliente', item)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

        </Tabs>

        {/* Botones de acción */}
        <div className="flex justify-end items-center gap-4 mt-6 pt-6 border-t">
          <div className="flex gap-2">
            <Button 
              onClick={onLimpiarFiltros}
              variant="outline"
              size="sm"
              disabled={contarFiltrosActivos() === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
            <Button onClick={onAplicarFiltros} size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}