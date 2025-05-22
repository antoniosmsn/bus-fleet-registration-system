
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

interface RutaFilterValues {
  pais: string;
  provincia: string;
  canton: string;
  distrito: string;
  sector: string;
  ramal: string;
  tipo: string;
  estado: string;
}

interface RutasFilterProps {
  onFilter: (filters: RutaFilterValues) => void;
}

const RutasFilter: React.FC<RutasFilterProps> = ({ onFilter }) => {
  const initialFilters: RutaFilterValues = {
    pais: '',
    provincia: '',
    canton: '',
    distrito: '',
    sector: '',
    ramal: '',
    tipo: '',
    estado: '',
  };

  const [filters, setFilters] = useState<RutaFilterValues>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(true);

  // Mock data for dropdowns (you would replace this with actual API data)
  const paises = ["Costa Rica"];
  const provincias = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"];
  const cantones = ["Cantón 1", "Cantón 2", "Cantón 3"];
  const distritos = ["Distrito 1", "Distrito 2", "Distrito 3"];
  const sectores = ["Sector 1", "Sector 2", "Sector 3"];
  const ramales = ["Ramal 1", "Ramal 2", "Ramal 3"];

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="pais">País</Label>
              <Select 
                value={filters.pais} 
                onValueChange={(value) => handleSelectChange('pais', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los países</SelectItem>
                  {paises.map(pais => (
                    <SelectItem key={pais} value={pais}>{pais}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provincia">Provincia</Label>
              <Select 
                value={filters.provincia} 
                onValueChange={(value) => handleSelectChange('provincia', value)}
                disabled={!filters.pais}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar provincia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las provincias</SelectItem>
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
                disabled={!filters.provincia}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cantón" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los cantones</SelectItem>
                  {cantones.map(canton => (
                    <SelectItem key={canton} value={canton}>{canton}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distrito">Distrito</Label>
              <Select 
                value={filters.distrito} 
                onValueChange={(value) => handleSelectChange('distrito', value)}
                disabled={!filters.canton}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar distrito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los distritos</SelectItem>
                  {distritos.map(distrito => (
                    <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Select 
                value={filters.sector} 
                onValueChange={(value) => handleSelectChange('sector', value)}
                disabled={!filters.distrito}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los sectores</SelectItem>
                  {sectores.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ramal">Ramal</Label>
              <Select 
                value={filters.ramal} 
                onValueChange={(value) => handleSelectChange('ramal', value)}
                disabled={!filters.sector}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ramal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los ramales</SelectItem>
                  {ramales.map(ramal => (
                    <SelectItem key={ramal} value={ramal}>{ramal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Ruta</Label>
              <Select 
                value={filters.tipo} 
                onValueChange={(value) => handleSelectChange('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="privada">Privada</SelectItem>
                  <SelectItem value="parque">Parque</SelectItem>
                  <SelectItem value="especial">Especial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select 
                value={filters.estado} 
                onValueChange={(value) => handleSelectChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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

export default RutasFilter;
