import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SolicitudTrasladoFilter } from '../../types/solicitud-traslado';

interface SolicitudesTrasladoFilterProps {
  onFilter: (filters: SolicitudTrasladoFilter) => void;
}

export function SolicitudesTrasladoFilter({ onFilter }: SolicitudesTrasladoFilterProps) {
  // Obtener primer y último día del mes actual
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [filters, setFilters] = useState<SolicitudTrasladoFilter>({
    nombres: '',
    apellidos: '',
    cedula: '',
    correo: '',
    empresaDestino: '',
    empresaOrigen: '',
    fechaCreacionInicio: firstDayOfMonth.toISOString(),
    fechaCreacionFin: lastDayOfMonth.toISOString(),
    estado: 'todos'
  });

  const [fechaInicio, setFechaInicio] = useState<Date>(firstDayOfMonth);
  const [fechaFin, setFechaFin] = useState<Date>(lastDayOfMonth);

  const handleInputChange = (field: keyof SolicitudTrasladoFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (field: 'inicio' | 'fin', date: Date | undefined) => {
    if (date) {
      if (field === 'inicio') {
        setFechaInicio(date);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        setFilters(prev => ({
          ...prev,
          fechaCreacionInicio: startOfDay.toISOString()
        }));
      } else {
        setFechaFin(date);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        setFilters(prev => ({
          ...prev,
          fechaCreacionFin: endOfDay.toISOString()
        }));
      }
    }
  };

  const handleSearch = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters: SolicitudTrasladoFilter = {
      nombres: '',
      apellidos: '',
      cedula: '',
      correo: '',
      empresaDestino: '',
      empresaOrigen: '',
      fechaCreacionInicio: firstDayOfMonth.toISOString(),
      fechaCreacionFin: lastDayOfMonth.toISOString(),
      estado: 'todos'
    };
    setFilters(resetFilters);
    setFechaInicio(firstDayOfMonth);
    setFechaFin(lastDayOfMonth);
    onFilter(resetFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros de Búsqueda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombres">Nombres</Label>
            <Input
              id="nombres"
              value={filters.nombres}
              onChange={(e) => handleInputChange('nombres', e.target.value)}
              placeholder="Buscar por nombres"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input
              id="apellidos"
              value={filters.apellidos}
              onChange={(e) => handleInputChange('apellidos', e.target.value)}
              placeholder="Buscar por apellidos"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cedula">Cédula</Label>
            <Input
              id="cedula"
              value={filters.cedula}
              onChange={(e) => handleInputChange('cedula', e.target.value)}
              placeholder="Buscar por cédula"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input
              id="correo"
              value={filters.correo}
              onChange={(e) => handleInputChange('correo', e.target.value)}
              placeholder="Buscar por correo"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresaOrigen">Empresa Origen</Label>
            <Input
              id="empresaOrigen"
              value={filters.empresaOrigen}
              onChange={(e) => handleInputChange('empresaOrigen', e.target.value)}
              placeholder="Buscar por empresa origen"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresaDestino">Empresa Destino</Label>
            <Input
              id="empresaDestino"
              value={filters.empresaDestino}
              onChange={(e) => handleInputChange('empresaDestino', e.target.value)}
              placeholder="Buscar por empresa destino"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha Inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fechaInicio && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaInicio ? format(fechaInicio, "dd/MM/yyyy") : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fechaInicio}
                  onSelect={(date) => handleDateChange('inicio', date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Fecha Fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fechaFin && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaFin ? format(fechaFin, "dd/MM/yyyy") : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fechaFin}
                  onSelect={(date) => handleDateChange('fin', date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select value={filters.estado} onValueChange={(value) => handleInputChange('estado', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="aceptado">Aceptado</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
              <SelectItem value="rechazado">Rechazado</SelectItem>
              <SelectItem value="en-solicitud-traslado">En Solicitud de Traslado</SelectItem>
            </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Consultar
          </Button>
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}