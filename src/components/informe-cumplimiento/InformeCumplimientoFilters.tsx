import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { X, FileDown, Filter, RotateCcw } from 'lucide-react';
import { FiltrosInformeCumplimiento } from '@/types/informe-cumplimiento';
import { 
  getUniqueTransportistas, 
  getUniqueEmpresasCliente, 
  getUniqueTiposRuta,
  getUniqueTurnos,
  getUniqueRamales,
  getUniqueTiposUnidad,
  getUniquePlacas
} from '@/data/mockInformesCumplimiento';

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
    if (filtros.noInforme) count++;
    if (filtros.noSemana) count++;
    if (filtros.fechaInicio) count++;
    if (filtros.fechaFin) count++;
    if (filtros.horaInicio) count++;
    if (filtros.horaFin) count++;
    if (filtros.idServicio) count++;
    if (filtros.transportista.length > 0) count++;
    if (filtros.empresaCliente.length > 0) count++;
    if (filtros.tipoRuta.length > 0) count++;
    if (filtros.turno.length > 0) count++;
    if (filtros.ramal.length > 0) count++;
    if (filtros.tipoUnidad.length > 0) count++;
    if (filtros.placa.length > 0) count++;
    if (filtros.sentido.length > 0) count++;
    if (filtros.estadoRevision.length > 0) count++;
    if (filtros.programado.length > 0) count++;
    return count;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="basicos" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basicos">Filtros Básicos</TabsTrigger>
            <TabsTrigger value="fechas">Fechas y Horarios</TabsTrigger>
            <TabsTrigger value="empresas">Empresas</TabsTrigger>
            <TabsTrigger value="estado">Estado y Programación</TabsTrigger>
          </TabsList>

          {/* Filtros Básicos */}
          <TabsContent value="basicos" className="space-y-4">
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="idServicio" className="text-xs">ID Servicio</Label>
                  <Input
                    id="idServicio"
                    value={filtros.idServicio}
                    onChange={(e) => updateFiltro('idServicio', e.target.value)}
                    placeholder="ID Servicio"
                    className="text-sm h-9"
                  />
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

              {/* Tipo Ruta */}
              <div className="space-y-2">
                <Label className="text-xs">Tipo de Ruta</Label>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => addToArrayFilter('tipoRuta', value)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Tipo de ruta" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUniqueTiposRuta().map(tipo => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {filtros.tipoRuta.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filtros.tipoRuta.map(item => (
                      <Badge key={item} variant="secondary" className="flex items-center gap-1 text-xs">
                        {item}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromArrayFilter('tipoRuta', item)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Tipo Unidad */}
              <div className="space-y-2">
                <Label className="text-xs">Tipo de Unidad</Label>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => addToArrayFilter('tipoUnidad', value)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Tipo unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUniqueTiposUnidad().map(tipo => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {filtros.tipoUnidad.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filtros.tipoUnidad.map(item => (
                      <Badge key={item} variant="secondary" className="flex items-center gap-1 text-xs">
                        {item}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromArrayFilter('tipoUnidad', item)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Placa */}
              <div className="space-y-2">
                <Label className="text-xs">Placa</Label>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => addToArrayFilter('placa', value)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Placa" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUniquePlacas().map(placa => (
                        <SelectItem key={placa} value={placa}>
                          {placa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {filtros.placa.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filtros.placa.map(item => (
                      <Badge key={item} variant="secondary" className="flex items-center gap-1 text-xs">
                        {item}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromArrayFilter('placa', item)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
               </div>
             </div>
           </div>
           </TabsContent>

          {/* Empresas */}
          <TabsContent value="empresas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transportista */}
              <div className="space-y-2">
                <Label>Transportista</Label>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => addToArrayFilter('transportista', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Seleccionar transportista" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUniqueTransportistas().map(transportista => (
                        <SelectItem key={transportista} value={transportista}>
                          {transportista}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {filtros.transportista.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filtros.transportista.map(item => (
                      <Badge key={item} variant="secondary" className="flex items-center gap-1">
                        {item}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromArrayFilter('transportista', item)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

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

          {/* Fechas y Horarios */}
          <TabsContent value="fechas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio" className="text-xs">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => updateFiltro('fechaInicio', e.target.value)}
                  className="text-sm h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaFin" className="text-xs">Fecha Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => updateFiltro('fechaFin', e.target.value)}
                  className="text-sm h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaInicio" className="text-xs">Hora Inicio</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={filtros.horaInicio}
                  onChange={(e) => updateFiltro('horaInicio', e.target.value)}
                  className="text-sm h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaFin" className="text-xs">Hora Fin</Label>
                <Input
                  id="horaFin"
                  type="time"
                  value={filtros.horaFin}
                  onChange={(e) => updateFiltro('horaFin', e.target.value)}
                  className="text-sm h-9"
                />
              </div>
            </div>
          </TabsContent>


          {/* Estado y Programación */}
          <TabsContent value="estado" className="space-y-4">
            {/* Estado Revisión */}
            <div className="space-y-2">
              <Label>Estado de Revisión</Label>
              <div className="flex gap-2">
                <Select onValueChange={(value) => addToArrayFilter('estadoRevision', value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Revisado por Transportista">Revisado por Transportista</SelectItem>
                    <SelectItem value="Revisado por Administración">Revisado por Administración</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {filtros.estadoRevision.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filtros.estadoRevision.map(item => (
                    <Badge key={item} variant="secondary" className="flex items-center gap-1">
                      {item}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFromArrayFilter('estadoRevision', item)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Programado */}
            <div className="space-y-2">
              <Label>Programado</Label>
              <div className="flex gap-2">
                <Select onValueChange={(value) => {
                  const boolValue = value === 'true';
                  updateFiltro('programado', [...filtros.programado, boolValue]);
                }}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccionar si está programado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sí</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {filtros.programado.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filtros.programado.map((item, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {item ? 'Sí' : 'No'}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => {
                          const newProgramado = filtros.programado.filter((_, i) => i !== index);
                          updateFiltro('programado', newProgramado);
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}
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