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
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { BitacoraSistemaFilter, applicationsOptions, logLevelsOptions } from '@/types/bitacora-sistema';

interface BitacorasSistemaFiltersProps {
  filtros: BitacoraSistemaFilter;
  onFiltrosChange: (filtros: BitacoraSistemaFilter) => void;
  onBuscar: () => void;
  onLimpiar: () => void;
  loading?: boolean;
}

const BitacorasSistemaFilters: React.FC<BitacorasSistemaFiltersProps> = ({
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
      onFiltrosChange({ ...filtros, fechaInicio: date.toISOString() });
    }
  };

  const handleFechaFinChange = (date: Date | undefined) => {
    setFechaFin(date);
    if (date) {
      onFiltrosChange({ ...filtros, fechaFin: date.toISOString() });
    }
  };

  const handleLimpiar = () => {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    setFechaInicio(startOfDay);
    setFechaFin(endOfDay);
    
    const filtrosLimpios: BitacoraSistemaFilter = {
      fechaInicio: startOfDay.toISOString(),
      fechaFin: endOfDay.toISOString(),
      application: 'todos',
      logLevel: 'todos',
      user: '',
      message: '',
      errorCode: '',
      apiErrorMessage: '',
      internalErrorMessage: ''
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
            value="aplicacion"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:border-b-2"
          >
            Aplicación y Nivel
          </TabsTrigger>
          <TabsTrigger 
            value="usuario"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:border-b-2"
          >
            Usuario y Mensaje
          </TabsTrigger>
          <TabsTrigger 
            value="errores"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:border-b-2"
          >
            Códigos de Error
          </TabsTrigger>
        </TabsList>
        
        <div className="bg-white border border-t-0 border-slate-200 p-6">
          <TabsContent value="general" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha Inicio */}
              <div className="space-y-2">
                <Label htmlFor="fechaInicio" className="text-sm font-medium text-slate-600">Fecha y Hora de Inicio *</Label>
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
                      {fechaInicio 
                        ? format(fechaInicio, "dd/MM/yyyy HH:mm:ss")
                        : "Seleccionar fecha y hora"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <Calendar
                        mode="single"
                        selected={fechaInicio}
                        onSelect={handleFechaInicioChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                      <div className="border-t pt-3 mt-3">
                        <DateTimePicker
                          date={fechaInicio}
                          onDateTimeChange={handleFechaInicioChange}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Fecha Fin */}
              <div className="space-y-2">
                <Label htmlFor="fechaFin" className="text-sm font-medium text-slate-600">Fecha y Hora de Fin *</Label>
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
                      {fechaFin 
                        ? format(fechaFin, "dd/MM/yyyy HH:mm:ss")
                        : "Seleccionar fecha y hora"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <Calendar
                        mode="single"
                        selected={fechaFin}
                        onSelect={handleFechaFinChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                      <div className="border-t pt-3 mt-3">
                        <DateTimePicker
                          date={fechaFin}
                          onDateTimeChange={handleFechaFinChange}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="aplicacion" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="application" className="text-sm font-medium text-slate-600">Aplicación</Label>
                <Select 
                  value={filtros.application} 
                  onValueChange={(value) => onFiltrosChange({ ...filtros, application: value })}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Seleccionar aplicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicationsOptions.map((app) => (
                      <SelectItem key={app.value} value={app.value}>
                        {app.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logLevel" className="text-sm font-medium text-slate-600">Nivel de Log</Label>
                <Select 
                  value={filtros.logLevel} 
                  onValueChange={(value) => onFiltrosChange({ ...filtros, logLevel: value })}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {logLevelsOptions.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usuario" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user" className="text-sm font-medium text-slate-600">Usuario</Label>
                <Input
                  id="user"
                  placeholder="Buscar por usuario"
                  value={filtros.user}
                  onChange={(e) => onFiltrosChange({ ...filtros, user: e.target.value })}
                  maxLength={200}
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-slate-600">Mensaje</Label>
                <Input
                  id="message"
                  placeholder="Buscar en mensaje"
                  value={filtros.message}
                  onChange={(e) => onFiltrosChange({ ...filtros, message: e.target.value })}
                  maxLength={500}
                  className="border-slate-300"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="errores" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="errorCode" className="text-sm font-medium text-slate-600">Código de Error</Label>
                <Input
                  id="errorCode"
                  placeholder="Código de error"
                  value={filtros.errorCode}
                  onChange={(e) => onFiltrosChange({ ...filtros, errorCode: e.target.value })}
                  maxLength={50}
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiErrorMessage" className="text-sm font-medium text-slate-600">Mensaje de Error del API</Label>
                <Input
                  id="apiErrorMessage"
                  placeholder="Mensaje de error API"
                  value={filtros.apiErrorMessage}
                  onChange={(e) => onFiltrosChange({ ...filtros, apiErrorMessage: e.target.value })}
                  maxLength={500}
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="internalErrorMessage" className="text-sm font-medium text-slate-600">Mensaje de Error Interno</Label>
                <Input
                  id="internalErrorMessage"
                  placeholder="Mensaje de error interno"
                  value={filtros.internalErrorMessage}
                  onChange={(e) => onFiltrosChange({ ...filtros, internalErrorMessage: e.target.value })}
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

export default BitacorasSistemaFilters;