import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Search, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { BitacoraUsuarioFilter, tiposAccion, tiposResultado } from '@/types/bitacora-usuario';

interface BitacorasUsuariosFiltersProps {
  filtros: BitacoraUsuarioFilter;
  onFiltrosChange: (filtros: BitacoraUsuarioFilter) => void;
  onBuscar: () => void;
  onLimpiar: () => void;
  loading?: boolean;
}

const BitacorasUsuariosFilters: React.FC<BitacorasUsuariosFiltersProps> = ({
  filtros,
  onFiltrosChange,
  onBuscar,
  onLimpiar,
  loading = false
}) => {
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(
    filtros.fechaInicio ? new Date(filtros.fechaInicio) : new Date()
  );
  const [fechaFin, setFechaFin] = useState<Date | undefined>(
    filtros.fechaFin ? new Date(filtros.fechaFin) : new Date()
  );

  const handleFechaInicioChange = (date: Date | undefined) => {
    setFechaInicio(date);
    if (date) {
      const isoDate = date.toISOString().split('T')[0] + 'T00:00:00.000Z';
      onFiltrosChange({ ...filtros, fechaInicio: isoDate });
    }
  };

  const handleFechaFinChange = (date: Date | undefined) => {
    setFechaFin(date);
    if (date) {
      const isoDate = date.toISOString().split('T')[0] + 'T23:59:59.999Z';
      onFiltrosChange({ ...filtros, fechaFin: isoDate });
    }
  };

  const handleLimpiar = () => {
    const today = new Date();
    const fechaInicioDefault = today.toISOString().split('T')[0] + 'T00:00:00.000Z';
    const fechaFinDefault = today.toISOString().split('T')[0] + 'T23:59:59.999Z';
    
    setFechaInicio(today);
    setFechaFin(today);
    
    const filtrosLimpios: BitacoraUsuarioFilter = {
      fechaInicio: fechaInicioDefault,
      fechaFin: fechaFinDefault,
      usuario: '',
      tipoAccion: 'todos',
      resultado: 'todos',
      textoDescripcion: ''
    };
    
    onFiltrosChange(filtrosLimpios);
    onLimpiar();
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100">
          <TabsTrigger 
            value="general"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:border-b-2"
          >
            Información General
          </TabsTrigger>
          <TabsTrigger 
            value="accion"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:border-b-2"
          >
            Tipo de Acción
          </TabsTrigger>
          <TabsTrigger 
            value="resultado"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:border-b-2"
          >
            Resultado
          </TabsTrigger>
          <TabsTrigger 
            value="avanzado"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:border-b-2"
          >
            Búsqueda Avanzada
          </TabsTrigger>
        </TabsList>
        
        <div className="bg-white border border-t-0 border-slate-200 p-6">
          <TabsContent value="general" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fecha Inicio */}
              <div className="space-y-2">
                <Label htmlFor="fechaInicio" className="text-sm font-medium text-slate-600">Fecha Inicio *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-slate-300",
                        !fechaInicio && "text-slate-400"
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
                      onSelect={handleFechaInicioChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Fecha Fin */}
              <div className="space-y-2">
                <Label htmlFor="fechaFin" className="text-sm font-medium text-slate-600">Fecha Fin *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-slate-300",
                        !fechaFin && "text-slate-400"
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
                      onSelect={handleFechaFinChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Usuario */}
              <div className="space-y-2">
                <Label htmlFor="usuario" className="text-sm font-medium text-slate-600">Usuario</Label>
                <Input
                  id="usuario"
                  placeholder="Buscar por usuario o email"
                  value={filtros.usuario}
                  onChange={(e) => onFiltrosChange({ ...filtros, usuario: e.target.value })}
                  maxLength={200}
                  className="border-slate-300"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accion" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoAccion" className="text-sm font-medium text-slate-600">Tipo de Acción</Label>
                <Select 
                  value={filtros.tipoAccion} 
                  onValueChange={(value) => onFiltrosChange({ ...filtros, tipoAccion: value })}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposAccion.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resultado" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resultado" className="text-sm font-medium text-slate-600">Resultado</Label>
                <Select 
                  value={filtros.resultado} 
                  onValueChange={(value) => onFiltrosChange({ ...filtros, resultado: value })}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Seleccionar resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposResultado.map((resultado) => (
                      <SelectItem key={resultado.value} value={resultado.value}>
                        {resultado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="avanzado" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="textoDescripcion" className="text-sm font-medium text-slate-600">Texto en Descripción</Label>
                <Input
                  id="textoDescripcion"
                  placeholder="Buscar en descripción"
                  value={filtros.textoDescripcion}
                  onChange={(e) => onFiltrosChange({ ...filtros, textoDescripcion: e.target.value })}
                  maxLength={500}
                  className="border-slate-300"
                />
              </div>
            </div>
          </TabsContent>

          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={handleLimpiar}
              className="flex items-center gap-2 border-slate-300 text-slate-600"
              disabled={loading}
            >
              <RotateCcw className="h-4 w-4" />
              Limpiar filtros
            </Button>
            <Button
              onClick={onBuscar}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              <Search className="h-4 w-4" />
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default BitacorasUsuariosFilters;