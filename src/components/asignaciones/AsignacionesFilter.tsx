
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

interface AsignacionFilterValues {
  ramal: string;
  empresaTransporte: string;
  empresaCliente: string;
  tipoRuta: string;
  provincia: string;
  canton: string;
  sector: string;
  tipoUnidad: string;
  fechaInicioVigenciaStart: string;
  fechaInicioVigenciaEnd: string;
  habilitarFiltroFecha: boolean;
  estado: string;
}

interface AsignacionesFilterProps {
  onFilter: (filters: AsignacionFilterValues) => void;
}

const AsignacionesFilter: React.FC<AsignacionesFilterProps> = ({ onFilter }) => {
  const initialFilters: AsignacionFilterValues = {
    ramal: '',
    empresaTransporte: '',
    empresaCliente: '',
    tipoRuta: '',
    provincia: '',
    canton: '',
    sector: '',
    tipoUnidad: '',
    fechaInicioVigenciaStart: '',
    fechaInicioVigenciaEnd: '',
    habilitarFiltroFecha: false,
    estado: '',
  };

  const [filters, setFilters] = useState<AsignacionFilterValues>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, habilitarFiltroFecha: checked }));
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    onFilter(initialFilters);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Filtros de búsqueda</CardTitle>
          <Button variant="ghost" size="sm" onClick={toggleExpanded} className="flex items-center gap-1">
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span className="hidden sm:inline">Ocultar filtros</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span className="hidden sm:inline">Mostrar filtros</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap">
              <TabsTrigger value="general">Información General</TabsTrigger>
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
              <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
              <TabsTrigger value="fechas">Fechas y Estado</TabsTrigger>
            </TabsList>
            
            {/* Información General */}
            <TabsContent value="general" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ramal">Ramal</Label>
                  <Input
                    id="ramal"
                    name="ramal"
                    placeholder="Buscar por ramal"
                    value={filters.ramal}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoRuta">Tipo de Ruta</Label>
                  <Select 
                    value={filters.tipoRuta} 
                    onValueChange={(value) => handleSelectChange('tipoRuta', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="privada">Privada</SelectItem>
                      <SelectItem value="parque">Parque</SelectItem>
                      <SelectItem value="especial">Especial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoUnidad">Tipo de Unidad</Label>
                  <Select 
                    value={filters.tipoUnidad} 
                    onValueChange={(value) => handleSelectChange('tipoUnidad', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="autobus">Autobús</SelectItem>
                      <SelectItem value="buseta">Buseta</SelectItem>
                      <SelectItem value="microbus">Microbús</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Input
                    id="sector"
                    name="sector"
                    placeholder="Buscar por sector"
                    value={filters.sector}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Empresas */}
            <TabsContent value="empresas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresaTransporte">Empresa de Transporte</Label>
                  <Input
                    id="empresaTransporte"
                    name="empresaTransporte"
                    placeholder="Nombre de empresa transportista"
                    value={filters.empresaTransporte}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresaCliente">Empresa Cliente</Label>
                  <Input
                    id="empresaCliente"
                    name="empresaCliente"
                    placeholder="Nombre de empresa cliente"
                    value={filters.empresaCliente}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Ubicación */}
            <TabsContent value="ubicacion" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input
                    id="provincia"
                    name="provincia"
                    placeholder="Buscar por provincia"
                    value={filters.provincia}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canton">Cantón</Label>
                  <Input
                    id="canton"
                    name="canton"
                    placeholder="Buscar por cantón"
                    value={filters.canton}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Fechas y Estado */}
            <TabsContent value="fechas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="habilitarFiltroFecha"
                      checked={filters.habilitarFiltroFecha}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="habilitarFiltroFecha">Filtrar por fecha de vigencia</Label>
                  </div>
                </div>
                
                {filters.habilitarFiltroFecha && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fechaInicioVigenciaStart">Fecha inicio desde</Label>
                      <Input
                        id="fechaInicioVigenciaStart"
                        name="fechaInicioVigenciaStart"
                        type="date"
                        value={filters.fechaInicioVigenciaStart}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fechaInicioVigenciaEnd">Fecha inicio hasta</Label>
                      <Input
                        id="fechaInicioVigenciaEnd"
                        name="fechaInicioVigenciaEnd"
                        type="date"
                        value={filters.fechaInicioVigenciaEnd}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select 
                    value={filters.estado} 
                    onValueChange={(value) => handleSelectChange('estado', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}

      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={handleResetFilters} className="flex items-center gap-1">
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Limpiar filtros</span>
        </Button>
        <Button onClick={handleApplyFilters} className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Aplicar filtros</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AsignacionesFilter;
