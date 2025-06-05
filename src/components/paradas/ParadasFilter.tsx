
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

interface ParadasFilterProps {
  onFilter: (filters: any) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const ParadasFilter: React.FC<ParadasFilterProps> = ({
  onFilter,
  onClearFilters,
  showFilters,
  onToggleFilters
}) => {
  const [filters, setFilters] = useState({
    codigo: '',
    nombre: '',
    pais: '',
    provincia: '',
    canton: '',
    sector: '',
    estado: ''
  });

  const handleInputChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      codigo: '',
      nombre: '',
      pais: '',
      provincia: '',
      canton: '',
      sector: '',
      estado: ''
    };
    setFilters(emptyFilters);
    onClearFilters();
  };

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium">Filtros de búsqueda</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFilters}
            className="flex items-center gap-1 h-8"
          >
            {showFilters ? (
              <>
                Ocultar filtros
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Mostrar filtros
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-3">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                <TabsTrigger value="ubicacion" className="text-xs">Ubicación</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="mt-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="codigo" className="text-xs">Código de parada</Label>
                    <Input
                      id="codigo"
                      placeholder="Buscar por código"
                      value={filters.codigo}
                      onChange={(e) => handleInputChange('codigo', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="nombre" className="text-xs">Nombre de parada</Label>
                    <Input
                      id="nombre"
                      placeholder="Buscar por nombre"
                      value={filters.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Estado</Label>
                    <Select
                      value={filters.estado}
                      onValueChange={(value) => handleInputChange('estado', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ubicacion" className="mt-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">País</Label>
                    <Select
                      value={filters.pais}
                      onValueChange={(value) => handleInputChange('pais', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Seleccionar país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Provincia</Label>
                    <Select
                      value={filters.provincia}
                      onValueChange={(value) => handleInputChange('provincia', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Seleccionar provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="San José">San José</SelectItem>
                        <SelectItem value="Alajuela">Alajuela</SelectItem>
                        <SelectItem value="Cartago">Cartago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Cantón</Label>
                    <Select
                      value={filters.canton}
                      onValueChange={(value) => handleInputChange('canton', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Seleccionar cantón" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="San José">San José</SelectItem>
                        <SelectItem value="Escazú">Escazú</SelectItem>
                        <SelectItem value="Desamparados">Desamparados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Sector</Label>
                    <Input
                      placeholder="Buscar por sector"
                      value={filters.sector}
                      onChange={(e) => handleInputChange('sector', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="flex items-center gap-1 h-8 text-xs"
              >
                <X className="h-3 w-3" />
                Limpiar filtros
              </Button>
              <Button
                size="sm"
                onClick={handleApplyFilters}
                className="flex items-center gap-1 h-8 text-xs"
              >
                Aplicar filtros
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParadasFilter;
