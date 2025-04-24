
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConductorFilterParams } from "@/types/conductor";
import { empresasTransporte } from "@/services/conductorService";
import { X, Search } from "lucide-react";

interface ConductoresFilterProps {
  filters: ConductorFilterParams;
  onFilterChange: (filters: ConductorFilterParams) => void;
  onResetFilters: () => void;
}

const ConductoresFilter: React.FC<ConductoresFilterProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const handleInputChange = (field: keyof ConductorFilterParams, value: string | number | null) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-sm font-medium mb-1">Empresa de Transporte</label>
          <Select
            value={filters.empresaTransporte || 'Todas'}
            onValueChange={(value) => handleInputChange('empresaTransporte', value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {empresasTransporte.map((empresa) => (
                <SelectItem key={empresa} value={empresa}>{empresa}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label className="text-sm font-medium mb-1">Nombre o Apellidos</label>
          <Input
            value={filters.nombreApellidos || ''}
            onChange={(e) => handleInputChange('nombreApellidos', e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full md:w-[200px]"
          />
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label className="text-sm font-medium mb-1">Cédula</label>
          <Input
            value={filters.cedula || ''}
            onChange={(e) => handleInputChange('cedula', e.target.value)}
            placeholder="Número de cédula"
            className="w-full md:w-[200px]"
          />
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label className="text-sm font-medium mb-1">Código</label>
          <Input
            value={filters.codigo || ''}
            onChange={(e) => handleInputChange('codigo', e.target.value)}
            placeholder="Código"
            className="w-full md:w-[200px]"
          />
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label className="text-sm font-medium mb-1">Estado</label>
          <Select
            value={filters.estado || 'Todos'}
            onValueChange={(value) => handleInputChange('estado', value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label className="text-sm font-medium mb-1">Documentos por vencer en</label>
          <Select
            value={filters.vencimientoEnMeses?.toString() || ''}
            onValueChange={(value) => handleInputChange('vencimientoEnMeses', value ? parseInt(value) : null)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sin filtro</SelectItem>
              <SelectItem value="1">1 mes</SelectItem>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline"
          onClick={onResetFilters}
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" /> Limpiar filtros
        </Button>
        <Button 
          onClick={() => {/* Los filtros ya se aplican automáticamente */}}
          className="flex items-center gap-1"
        >
          <Search className="h-4 w-4" /> Buscar
        </Button>
      </div>
    </div>
  );
};

export default ConductoresFilter;
