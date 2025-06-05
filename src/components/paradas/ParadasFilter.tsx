
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
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Filtros de búsqueda</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFilters}
            className="flex items-center gap-2"
          >
            {showFilters ? (
              <>
                Ocultar filtros
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Mostrar filtros
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código de parada</Label>
                    <Input
                      id="codigo"
                      placeholder="Buscar por código"
                      value={filters.codigo}
                      onChange={(e) => handleInputChange('codigo', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de parada</Label>
                    <Input
                      id="nombre"
                      placeholder="Buscar por nombre"
                      value={filters.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select
                      value={filters.estado}
                      onValueChange={(value) => handleInputChange('estado', value)}
                    >
                      <SelectTrigger>
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

              <TabsContent value="ubicacion" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>País</Label>
                    <Select
                      value={filters.pais}
                      onValueChange={(value) => handleInputChange('pais', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Provincia</Label>
                    <Select
                      value={filters.provincia}
                      onValueChange={(value) => handleInputChange('provincia', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="San José">San José</SelectItem>
                        <SelectItem value="Alajuela">Alajuela</SelectItem>
                        <SelectItem value="Cartago">Cartago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cantón</Label>
                    <Select
                      value={filters.canton}
                      onValueChange={(value) => handleInputChange('canton', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cantón" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="San José">San José</SelectItem>
                        <SelectItem value="Escazú">Escazú</SelectItem>
                        <SelectItem value="Desamparados">Desamparados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <Input
                      placeholder="Buscar por sector"
                      value={filters.sector}
                      onChange={(e) => handleInputChange('sector', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </Button>
              <Button
                size="sm"
                onClick={handleApplyFilters}
                className="flex items-center gap-2"
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
