
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

  // Mock data for dropdowns - estas listas deberían venir de una API
  const empresasTransporte = [
    "Transportes Unidos",
    "Transportes del Sur", 
    "Transportes Rápidos",
    "Autobuses Costa Rica",
    "Transportes San José"
  ];

  const empresasCliente = [
    "Empresa ABC S.A.",
    "Compañía XYZ",
    "Industrias RST",
    "Corporación DEF",
    "Servicios GHI Ltda."
  ];

  const provincias = [
    "San José",
    "Alajuela", 
    "Cartago",
    "Heredia",
    "Guanacaste",
    "Puntarenas",
    "Limón"
  ];

  const cantones = [
    "Central",
    "San Ramón",
    "Alajuela",
    "Cartago",
    "Heredia"
  ];

  const sectores = [
    "Centro",
    "Rural",
    "Industrial",
    "Comercial",
    "Residencial"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, habilitarFiltroFecha: checked }));
    if (!checked) {
      // Limpiar las fechas si se deshabilita el filtro
      setFilters(prev => ({ 
        ...prev, 
        fechaInicioVigenciaStart: '',
        fechaInicioVigenciaEnd: ''
      }));
    }
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
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
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
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      <SelectItem value="autobus">Autobús</SelectItem>
                      <SelectItem value="buseta">Buseta</SelectItem>
                      <SelectItem value="microbus">Microbús</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Select 
                    value={filters.sector} 
                    onValueChange={(value) => handleSelectChange('sector', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los sectores</SelectItem>
                      {sectores.map(sector => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            {/* Empresas */}
            <TabsContent value="empresas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresaTransporte">Empresa de Transporte</Label>
                  <Select 
                    value={filters.empresaTransporte} 
                    onValueChange={(value) => handleSelectChange('empresaTransporte', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa transportista" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las empresas</SelectItem>
                      {empresasTransporte.map(empresa => (
                        <SelectItem key={empresa} value={empresa}>{empresa}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresaCliente">Empresa Cliente</Label>
                  <Select 
                    value={filters.empresaCliente} 
                    onValueChange={(value) => handleSelectChange('empresaCliente', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las empresas</SelectItem>
                      {empresasCliente.map(empresa => (
                        <SelectItem key={empresa} value={empresa}>{empresa}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            {/* Ubicación */}
            <TabsContent value="ubicacion" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia</Label>
                  <Select 
                    value={filters.provincia} 
                    onValueChange={(value) => handleSelectChange('provincia', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las provincias</SelectItem>
                      {provincias.map(provincia => (
                        <SelectItem key={provincia} value={provincia}>{provincia}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canton">Cantón</Label>
                  <Select 
                    value={filters.canton} 
                    onValueChange={(value) => handleSelectChange('canton', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cantón" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los cantones</SelectItem>
                      {cantones.map(canton => (
                        <SelectItem key={canton} value={canton}>{canton}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            {/* Fechas y Estado */}
            <TabsContent value="fechas" className="mt-0">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="habilitarFiltroFecha"
                      checked={filters.habilitarFiltroFecha}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="habilitarFiltroFecha">Filtrar por fecha de inicio de vigencia</Label>
                  </div>
                  
                  {filters.habilitarFiltroFecha && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
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
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select 
                    value={filters.estado} 
                    onValueChange={(value) => handleSelectChange('estado', value)}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambos">Ambos estados</SelectItem>
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
